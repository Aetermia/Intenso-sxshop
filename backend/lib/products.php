<?php
// Productos: formato de los datos, validación y alta/edición en la base.
// La columna de la base usa snake_case (descuento_porcentaje) y la API
// devuelve camelCase (descuentoPorcentaje), como lo usa el sitio.

declare(strict_types=1);

function slugify(string $text): string
{
    // Reemplazo a mano de los caracteres del español: iconv con TRANSLIT
    // depende de la configuración regional del servidor y en algunos
    // hostings devuelve "?" (o falla) con las letras acentuadas.
    $text = strtr($text, [
        'á' => 'a', 'é' => 'e', 'í' => 'i', 'ó' => 'o', 'ú' => 'u', 'ü' => 'u', 'ñ' => 'n',
        'Á' => 'a', 'É' => 'e', 'Í' => 'i', 'Ó' => 'o', 'Ú' => 'u', 'Ü' => 'u', 'Ñ' => 'n',
    ]);
    $ascii = @iconv('UTF-8', 'ASCII//TRANSLIT//IGNORE', $text);
    if ($ascii !== false && $ascii !== '') {
        $text = $ascii;
    }
    $text = strtolower($text);
    $text = preg_replace('/[^a-z0-9]+/', '-', $text) ?? '';
    return substr(trim($text, '-'), 0, 180);
}

function unique_slug(PDO $pdo, string $base, ?int $excludeId = null): string
{
    $slug = $base !== '' ? $base : 'producto';
    $i = 2;
    while (true) {
        $sql = 'SELECT COUNT(*) FROM products WHERE slug = :slug';
        $params = [':slug' => $slug];
        if ($excludeId !== null) {
            $sql .= ' AND id != :id';
            $params[':id'] = $excludeId;
        }
        $stmt = $pdo->prepare($sql);
        $stmt->execute($params);
        if ((int) $stmt->fetchColumn() === 0) {
            return $slug;
        }
        $slug = $base . '-' . $i;
        $i++;
    }
}

// Tipos de promoción por volumen que entiende el sitio (src/utils/pricing.js).
const PROMO_TYPES = ['NONE', '2X1', '2DA_UNIDAD_DESCUENTO'];

function normalize_promo_type($value): string
{
    $v = strtoupper(trim((string) $value));
    return in_array($v, PROMO_TYPES, true) ? $v : 'NONE';
}

// Agrega las columnas que se sumaron después de la primera versión del
// esquema (promociones, sku) si la base se creó antes de que existieran.
// Es idempotente: si ya están, no hace nada. Si el usuario de MySQL no
// tiene permiso de ALTER, falla en silencio y hay que correr a mano los
// scripts de backend/migrations/.
function ensure_product_columns(PDO $pdo): void
{
    $columns = [
        'sku' => "VARCHAR(60) NULL DEFAULT NULL AFTER slug",
        'imagenes' => "LONGTEXT NULL AFTER imagen",
        'descuento_porcentaje' => "TINYINT UNSIGNED NOT NULL DEFAULT 0 AFTER promo",
        'tipo_promocion' => "VARCHAR(50) NOT NULL DEFAULT 'NONE' AFTER descuento_porcentaje",
        'descuento_segunda_unidad' => "TINYINT UNSIGNED NOT NULL DEFAULT 0 AFTER tipo_promocion",
    ];
    try {
        $existing = $pdo->query('SHOW COLUMNS FROM products')->fetchAll(PDO::FETCH_COLUMN);
        foreach ($columns as $name => $definition) {
            if (!in_array($name, $existing, true)) {
                // $name y $definition son constantes de este archivo, no
                // vienen del usuario: es seguro armarlas en el SQL.
                $pdo->exec("ALTER TABLE products ADD COLUMN `$name` $definition");
            }
        }
    } catch (PDOException $e) {
        // Sin permiso de ALTER u otro problema: lo dejamos anotado en el
        // log; si la columna de verdad falta, el INSERT/UPDATE avisa.
        error_log('[intenso-backend] ensure_product_columns: ' . $e->getMessage());
    }
}

// Lee una columna que guarda JSON como texto. Devuelve siempre un array
// (vacío si la columna está en NULL, vacía o con un JSON roto), para que
// un dato mal cargado a mano en phpMyAdmin no rompa toda la tienda.
function decode_json_column($raw): array
{
    if ($raw === null || $raw === '') {
        return [];
    }
    $data = json_decode((string) $raw, true);
    return is_array($data) ? $data : [];
}

// Fotos de un producto tal como están en la base: la lista de `imagenes`
// o, si esa columna está vacía (productos de antes), la única de `imagen`.
function product_images(array $row): array
{
    $list = [];
    foreach (decode_json_column($row['imagenes'] ?? null) as $url) {
        if (is_string($url) && $url !== '' && !in_array($url, $list, true)) {
            $list[] = $url;
        }
    }
    if (!$list && !empty($row['imagen'])) {
        $list[] = (string) $row['imagen'];
    }
    return array_slice($list, 0, MAX_PRODUCT_IMAGES);
}

// Lista de insignias limpia: solo textos, sin vacíos ni repetidos.
function normalize_insignias($insignias): array
{
    $out = [];
    foreach ((array) $insignias as $badge) {
        if (!is_scalar($badge)) {
            continue;
        }
        $badge = mb_substr(trim((string) $badge), 0, 60);
        if ($badge !== '' && !in_array($badge, $out, true)) {
            $out[] = $badge;
        }
    }
    return $out;
}

// Normaliza las variantes al formato:
//   { "Talle": [ { "nombre": "S", "descripcion": "65x25 cm", "precio": 25000 }, ... ] }
// - Opciones como texto plano (formato viejo) -> { nombre, descripcion: "", precio: null }.
// - precio vacío, 0 o inválido -> null (hereda el precio base del producto).
// - Grupos sin nombre u opciones sin nombre se descartan; nombres repetidos
//   dentro de un grupo también.
// Devuelve un stdClass/array listo para json_encode, o un string con el error.
function normalize_variantes($variantes)
{
    $out = [];
    foreach ((array) $variantes as $grupo => $opciones) {
        $grupo = trim((string) $grupo);
        if ($grupo === '') {
            continue;
        }
        if (is_string($opciones)) {
            $opciones = explode(',', $opciones);
        }
        if (!is_array($opciones)) {
            return "Las opciones de \"$grupo\" tienen que ser una lista.";
        }
        $lista = [];
        $vistos = [];
        foreach ($opciones as $opt) {
            if (is_object($opt)) {
                $opt = (array) $opt;
            }
            if (is_array($opt)) {
                $nombre = trim((string) ($opt['nombre'] ?? ''));
                $descripcion = trim((string) ($opt['descripcion'] ?? ''));
                $rawPrecio = $opt['precio'] ?? null;
            } elseif (is_scalar($opt)) {
                $nombre = trim((string) $opt);
                $descripcion = '';
                $rawPrecio = null;
            } else {
                continue;
            }
            if ($nombre === '' || isset($vistos[$nombre])) {
                continue;
            }
            $precio = null;
            if ($rawPrecio !== null && $rawPrecio !== '') {
                if (!is_numeric($rawPrecio) || (float) $rawPrecio < 0) {
                    return "El precio de \"$grupo: $nombre\" no es válido.";
                }
                $precio = (int) round((float) $rawPrecio);
                if ($precio <= 0) {
                    $precio = null;
                }
            }
            $vistos[$nombre] = true;
            $lista[] = [
                'nombre' => mb_substr($nombre, 0, 100),
                'descripcion' => mb_substr($descripcion, 0, 255),
                'precio' => $precio,
            ];
        }
        if ($lista) {
            $out[mb_substr($grupo, 0, 60)] = $lista;
        }
    }
    // Objeto vacío ({}) y no lista vacía ([]) cuando no hay variantes.
    return $out ? $out : new stdClass();
}

// Convierte la fila de la base (con las columnas JSON todavía como texto)
// al formato que espera el sitio: números como números de verdad (no
// como texto, que rompería las cuentas en JavaScript), insignias como
// lista, variantes como objeto y tinte como [colorA, colorB].
function product_row_to_json(array $row): array
{
    // Pasa por normalize_variantes también al leer: así el formato viejo
    // (textos planos) o un JSON tocado a mano salen siempre con la misma
    // forma { grupo: [ { nombre, descripcion, precio } ] }.
    $variantes = normalize_variantes(decode_json_column($row['variantes'] ?? null));
    if (is_string($variantes)) {
        $variantes = new stdClass();
    }

    return [
        'id' => (int) $row['id'],
        'slug' => $row['slug'],
        'sku' => $row['sku'] ?? null,
        'nombre' => $row['nombre'],
        'categoria' => $row['categoria'],
        'precio' => (int) $row['precio'],
        // imagen = la principal (la primera); imagenes = todas (hasta 3).
        'imagen' => product_images($row)[0] ?? null,
        'imagenes' => product_images($row),
        'insignias' => normalize_insignias(decode_json_column($row['insignias'] ?? null)),
        'variantes' => $variantes,
        'descripcion' => (string) ($row['descripcion'] ?? ''),
        'instrucciones' => (string) ($row['instrucciones'] ?? ''),
        'promo' => $row['promo'],
        // ?? por si la base todavía no tiene las columnas de promociones.
        'descuentoPorcentaje' => max(0, min(100, (int) ($row['descuento_porcentaje'] ?? 0))),
        'tipoPromocion' => normalize_promo_type($row['tipo_promocion'] ?? 'NONE'),
        'descuentoSegundaUnidad' => max(0, min(100, (int) ($row['descuento_segunda_unidad'] ?? 0))),
        'tinte' => ($row['tinte_inicio'] && $row['tinte_fin'])
            ? [$row['tinte_inicio'], $row['tinte_fin']]
            : null,
        'destacado' => (bool) $row['destacado'],
        'ordenDestacado' => $row['orden_destacado'] !== null ? (int) $row['orden_destacado'] : null,
        'activo' => (bool) $row['activo'],
        'sinStock' => (bool) $row['sin_stock'],
    ];
}

// ---------------------------------------------------------------------
// Alta y edición
// ---------------------------------------------------------------------

function validated_fields(array $input, bool $isUpdate): array
{
    $nombre = trim((string) ($input['nombre'] ?? ''));
    $categoria = trim((string) ($input['categoria'] ?? ''));
    $precio = $input['precio'] ?? null;

    if (!$isUpdate || array_key_exists('nombre', $input)) {
        if ($nombre === '' || mb_strlen($nombre) > 255) {
            json_error('El nombre es obligatorio (máximo 255 caracteres).', 400);
        }
    }
    if (!$isUpdate || array_key_exists('categoria', $input)) {
        if ($categoria === '' || mb_strlen($categoria) > 100) {
            json_error('La categoría es obligatoria.', 400);
        }
    }
    if (!$isUpdate || array_key_exists('precio', $input)) {
        if (!is_numeric($precio) || (int) round((float) $precio) <= 0 || (float) $precio > 4000000000) {
            json_error('Cargá un precio válido.', 400);
        }
    }

    $descripcion = isset($input['descripcion']) ? trim((string) $input['descripcion']) : null;
    if ((!$isUpdate || array_key_exists('descripcion', $input)) && ($descripcion === null || $descripcion === '')) {
        json_error('Escribí una descripción.', 400);
    }

    $insignias = $input['insignias'] ?? [];
    if (!is_array($insignias)) {
        json_error('Las insignias tienen que ser una lista.', 400);
    }
    $insignias = normalize_insignias($insignias);

    $variantes = $input['variantes'] ?? new stdClass();
    if (!is_array($variantes) && !is_object($variantes)) {
        json_error('Las variantes tienen que ser un objeto.', 400);
    }
    // { "Talle": [ { nombre, descripcion, precio }, ... ] } (acepta también
    // el formato viejo de textos planos y lo convierte). Ver normalize_variantes() más arriba.
    $variantes = normalize_variantes($variantes);
    if (is_string($variantes)) {
        json_error($variantes, 400);
    }

    $tinte = $input['tinte'] ?? null;
    $tinteInicio = null;
    $tinteFin = null;
    if (is_array($tinte) && count($tinte) === 2) {
        $tinte = array_values($tinte);
        // Solo colores hexadecimales (#abc o #aabbcc): van directo a un
        // style del sitio, no se acepta cualquier texto.
        foreach ($tinte as $color) {
            if (!is_string($color) || !preg_match('/^#[0-9a-fA-F]{3,8}$/', $color)) {
                json_error('Los colores del tinte tienen que ser hexadecimales (ej: #DC015B).', 400);
            }
        }
        $tinteInicio = $tinte[0];
        $tinteFin = $tinte[1];
    }

    // Fotos: `imagenes` es una lista de hasta 3 direcciones (la primera es
    // la principal). También se acepta `imagen` sola, como antes.
    $imagenes = null; // null = el pedido no trajo fotos (no se tocan)
    if (array_key_exists('imagenes', $input)) {
        if (!is_array($input['imagenes'])) {
            json_error('Las imágenes tienen que ser una lista.', 400);
        }
        $imagenes = [];
        foreach ($input['imagenes'] as $url) {
            $url = is_string($url) ? trim($url) : '';
            if ($url !== '' && !in_array($url, $imagenes, true)) {
                $imagenes[] = $url;
            }
        }
    } elseif (array_key_exists('imagen', $input)) {
        $single = trim((string) ($input['imagen'] ?? ''));
        $imagenes = $single !== '' ? [$single] : [];
    }
    if ($imagenes !== null) {
        if (count($imagenes) > MAX_PRODUCT_IMAGES) {
            json_error('Un producto puede tener hasta ' . MAX_PRODUCT_IMAGES . ' fotos.', 400);
        }
        foreach ($imagenes as $url) {
            $imageError = image_url_error($url);
            if ($imageError !== null) {
                json_error($imageError, 400);
            }
        }
    }

    $promo = isset($input['promo']) ? trim((string) $input['promo']) : null;
    if ($promo !== null && mb_strlen($promo) > 100) {
        json_error('La etiqueta de promo es muy larga (máximo 100 caracteres).', 400);
    }

    $sku = isset($input['sku']) ? trim((string) $input['sku']) : null;
    if ($sku !== null && mb_strlen($sku) > 60) {
        json_error('El SKU es muy largo (máximo 60 caracteres).', 400);
    }

    // Descuentos reales. Se aceptan en camelCase (como los devuelve la API).
    $descuentoPorcentaje = 0;
    if (array_key_exists('descuentoPorcentaje', $input)) {
        $raw = $input['descuentoPorcentaje'];
        if ($raw === null || $raw === '') {
            $raw = 0;
        }
        if (!is_numeric($raw) || (int) $raw < 0 || (int) $raw > 100) {
            json_error('El descuento directo tiene que estar entre 0 y 100.', 400);
        }
        $descuentoPorcentaje = (int) $raw;
    }

    $tipoPromocion = 'NONE';
    if (array_key_exists('tipoPromocion', $input)) {
        $rawTipo = strtoupper(trim((string) ($input['tipoPromocion'] ?? 'NONE')));
        if ($rawTipo === '') {
            $rawTipo = 'NONE';
        }
        if (!in_array($rawTipo, PROMO_TYPES, true)) {
            json_error('Tipo de promoción inválido.', 400);
        }
        $tipoPromocion = $rawTipo;
    }

    $descuentoSegunda = 0;
    if (array_key_exists('descuentoSegundaUnidad', $input)) {
        $raw = $input['descuentoSegundaUnidad'];
        if ($raw === null || $raw === '') {
            $raw = 0;
        }
        if (!is_numeric($raw) || (int) $raw < 0 || (int) $raw > 100) {
            json_error('El descuento de la 2da unidad tiene que estar entre 0 y 100.', 400);
        }
        $descuentoSegunda = (int) $raw;
    }
    if ($tipoPromocion === '2DA_UNIDAD_DESCUENTO'
        && array_key_exists('tipoPromocion', $input)
        && $descuentoSegunda <= 0) {
        json_error('Indicá qué % de descuento lleva la 2da unidad.', 400);
    }
    // El % de 2da unidad solo tiene sentido con esa promo: con otra se guarda 0.
    if (array_key_exists('tipoPromocion', $input) && $tipoPromocion !== '2DA_UNIDAD_DESCUENTO') {
        $descuentoSegunda = 0;
    }

    return [
        'nombre' => $nombre,
        'categoria' => $categoria,
        'precio' => is_numeric($precio) ? (int) round((float) $precio) : null,
        'sku' => ($sku !== null && $sku !== '') ? $sku : null,
        'imagen' => $imagenes[0] ?? null,
        // JSON_UNESCAPED_SLASHES: las rutas quedan legibles en phpMyAdmin.
        'imagenes' => $imagenes !== null
            ? json_encode($imagenes, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES)
            : null,
        'has_images' => $imagenes !== null,
        'insignias' => json_encode($insignias, JSON_UNESCAPED_UNICODE),
        'variantes' => json_encode($variantes, JSON_UNESCAPED_UNICODE),
        'descripcion' => $descripcion,
        'instrucciones' => isset($input['instrucciones']) ? trim((string) $input['instrucciones']) : null,
        'promo' => $promo !== '' ? $promo : null,
        'descuento_porcentaje' => $descuentoPorcentaje,
        'tipo_promocion' => $tipoPromocion,
        'descuento_segunda_unidad' => $descuentoSegunda,
        'tinte_inicio' => $tinteInicio,
        'tinte_fin' => $tinteFin,
        'destacado' => !empty($input['destacado']) ? 1 : 0,
        'orden_destacado' => isset($input['ordenDestacado']) && $input['ordenDestacado'] !== null
            ? (int) $input['ordenDestacado']
            : null,
        'activo' => array_key_exists('activo', $input) ? (!empty($input['activo']) ? 1 : 0) : null,
        'sin_stock' => array_key_exists('sinStock', $input) ? (!empty($input['sinStock']) ? 1 : 0) : null,
    ];
}

function create_product(PDO $pdo, array $input): void
{
    $f = validated_fields($input, false);
    $slug = unique_slug($pdo, slugify($f['nombre']));

    $stmt = $pdo->prepare(
        'INSERT INTO products
            (slug, sku, nombre, categoria, precio, imagen, imagenes, insignias, variantes, descripcion,
             instrucciones, promo, descuento_porcentaje, tipo_promocion, descuento_segunda_unidad,
             tinte_inicio, tinte_fin, destacado, orden_destacado, activo, sin_stock)
         VALUES
            (:slug, :sku, :nombre, :categoria, :precio, :imagen, :imagenes, :insignias, :variantes, :descripcion,
             :instrucciones, :promo, :descuento_porcentaje, :tipo_promocion, :descuento_segunda_unidad,
             :tinte_inicio, :tinte_fin, :destacado, :orden_destacado, :activo, :sin_stock)'
    );
    $stmt->execute([
        ':slug' => $slug,
        ':sku' => $f['sku'],
        ':nombre' => $f['nombre'],
        ':categoria' => $f['categoria'],
        ':precio' => $f['precio'],
        ':imagen' => $f['imagen'],
        ':imagenes' => $f['imagenes'] ?? '[]',
        ':insignias' => $f['insignias'],
        ':variantes' => $f['variantes'],
        ':descripcion' => $f['descripcion'],
        ':instrucciones' => $f['instrucciones'],
        ':promo' => $f['promo'],
        ':descuento_porcentaje' => $f['descuento_porcentaje'],
        ':tipo_promocion' => $f['tipo_promocion'],
        ':descuento_segunda_unidad' => $f['descuento_segunda_unidad'],
        ':tinte_inicio' => $f['tinte_inicio'],
        ':tinte_fin' => $f['tinte_fin'],
        ':destacado' => $f['destacado'],
        ':orden_destacado' => $f['orden_destacado'],
        ':activo' => $f['activo'] ?? 1,
        ':sin_stock' => $f['sin_stock'] ?? 0,
    ]);

    $id = (int) $pdo->lastInsertId();
    $stmt = $pdo->prepare('SELECT * FROM products WHERE id = :id');
    $stmt->execute([':id' => $id]);
    json_out(product_row_to_json($stmt->fetch()), 201);
}

function update_product(PDO $pdo, int $id, array $input): void
{
    $existing = $pdo->prepare('SELECT * FROM products WHERE id = :id');
    $existing->execute([':id' => $id]);
    $row = $existing->fetch();
    if (!$row) {
        json_error('Producto no encontrado.', 404);
    }

    $f = validated_fields($input, true);

    $slug = $row['slug'];
    if (array_key_exists('nombre', $input) && $f['nombre'] !== $row['nombre']) {
        $slug = unique_slug($pdo, slugify($f['nombre']), $id);
    }

    // Solo pisamos los campos que realmente vinieron en el pedido, para
    // poder mandar actualizaciones parciales (ej: solo "activo") sin tener
    // que reenviar el producto entero.
    $fields = [
        'slug' => $slug,
        'sku' => array_key_exists('sku', $input) ? $f['sku'] : ($row['sku'] ?? null),
        'nombre' => array_key_exists('nombre', $input) ? $f['nombre'] : $row['nombre'],
        'categoria' => array_key_exists('categoria', $input) ? $f['categoria'] : $row['categoria'],
        'precio' => array_key_exists('precio', $input) ? $f['precio'] : $row['precio'],
        'imagen' => $f['has_images'] ? $f['imagen'] : $row['imagen'],
        'imagenes' => $f['has_images'] ? $f['imagenes'] : ($row['imagenes'] ?? null),
        'insignias' => array_key_exists('insignias', $input) ? $f['insignias'] : $row['insignias'],
        'variantes' => array_key_exists('variantes', $input) ? $f['variantes'] : $row['variantes'],
        'descripcion' => array_key_exists('descripcion', $input) ? $f['descripcion'] : $row['descripcion'],
        'instrucciones' => array_key_exists('instrucciones', $input) ? $f['instrucciones'] : $row['instrucciones'],
        'promo' => array_key_exists('promo', $input) ? $f['promo'] : $row['promo'],
        'descuento_porcentaje' => array_key_exists('descuentoPorcentaje', $input)
            ? $f['descuento_porcentaje']
            : (int) ($row['descuento_porcentaje'] ?? 0),
        'tipo_promocion' => array_key_exists('tipoPromocion', $input)
            ? $f['tipo_promocion']
            : normalize_promo_type($row['tipo_promocion'] ?? 'NONE'),
        'descuento_segunda_unidad' => (array_key_exists('descuentoSegundaUnidad', $input) || array_key_exists('tipoPromocion', $input))
            ? $f['descuento_segunda_unidad']
            : (int) ($row['descuento_segunda_unidad'] ?? 0),
        'tinte_inicio' => array_key_exists('tinte', $input) ? $f['tinte_inicio'] : $row['tinte_inicio'],
        'tinte_fin' => array_key_exists('tinte', $input) ? $f['tinte_fin'] : $row['tinte_fin'],
        'destacado' => array_key_exists('destacado', $input) ? $f['destacado'] : $row['destacado'],
        'orden_destacado' => array_key_exists('ordenDestacado', $input) ? $f['orden_destacado'] : $row['orden_destacado'],
        'activo' => $f['activo'] !== null ? $f['activo'] : $row['activo'],
        'sin_stock' => $f['sin_stock'] !== null ? $f['sin_stock'] : $row['sin_stock'],
    ];

    $stmt = $pdo->prepare(
        'UPDATE products SET
            slug = :slug, sku = :sku, nombre = :nombre, categoria = :categoria, precio = :precio,
            imagen = :imagen, imagenes = :imagenes, insignias = :insignias, variantes = :variantes,
            descripcion = :descripcion, instrucciones = :instrucciones, promo = :promo,
            descuento_porcentaje = :descuento_porcentaje, tipo_promocion = :tipo_promocion,
            descuento_segunda_unidad = :descuento_segunda_unidad,
            tinte_inicio = :tinte_inicio, tinte_fin = :tinte_fin, destacado = :destacado,
            orden_destacado = :orden_destacado, activo = :activo, sin_stock = :sin_stock
         WHERE id = :id'
    );
    $stmt->execute([
        ':slug' => $fields['slug'],
        ':sku' => $fields['sku'],
        ':nombre' => $fields['nombre'],
        ':categoria' => $fields['categoria'],
        ':precio' => $fields['precio'],
        ':imagen' => $fields['imagen'],
        ':imagenes' => $fields['imagenes'],
        ':insignias' => $fields['insignias'],
        ':variantes' => $fields['variantes'],
        ':descripcion' => $fields['descripcion'],
        ':instrucciones' => $fields['instrucciones'],
        ':promo' => $fields['promo'],
        ':descuento_porcentaje' => $fields['descuento_porcentaje'],
        ':tipo_promocion' => $fields['tipo_promocion'],
        ':descuento_segunda_unidad' => $fields['descuento_segunda_unidad'],
        ':tinte_inicio' => $fields['tinte_inicio'],
        ':tinte_fin' => $fields['tinte_fin'],
        ':destacado' => $fields['destacado'],
        ':orden_destacado' => $fields['orden_destacado'],
        ':activo' => $fields['activo'],
        ':sin_stock' => $fields['sin_stock'],
        ':id' => $id,
    ]);

    // Las fotos que el producto tenía y ya no tiene se borran del servidor
    // (solo si eran de backend/uploads y ningún otro producto las usa).
    if ($f['has_images']) {
        foreach (product_images($row) as $oldImage) {
            delete_uploaded_image_if_unused($pdo, $oldImage);
        }
    }

    $stmt = $pdo->prepare('SELECT * FROM products WHERE id = :id');
    $stmt->execute([':id' => $id]);
    json_out(product_row_to_json($stmt->fetch()));
}

function delete_product(PDO $pdo, int $id): void
{
    // Antes de borrar se anotan sus fotos, para limpiarlas después.
    $find = $pdo->prepare('SELECT * FROM products WHERE id = :id');
    $find->execute([':id' => $id]);
    $row = $find->fetch();
    if (!$row) {
        json_error('Producto no encontrado.', 404);
    }
    $stmt = $pdo->prepare('DELETE FROM products WHERE id = :id');
    $stmt->execute([':id' => $id]);
    // Las fotos subidas desde el panel que ya no usa nadie se borran del
    // servidor (las del sitio, /products/..., no se tocan).
    foreach (product_images($row) as $oldImage) {
        delete_uploaded_image_if_unused($pdo, $oldImage);
    }
    json_out(['ok' => true]);
}

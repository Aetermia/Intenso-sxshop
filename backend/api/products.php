<?php
// Endpoint de productos.
//   GET    /api/products.php            -> lista los productos activos (público)
//   GET    /api/products.php?all=1      -> lista TODOS (requiere login, para el panel)
//   GET    /api/products.php?id=5       -> un producto puntual
//   POST   /api/products.php            -> crear producto (requiere login)
//   PUT    /api/products.php?id=5       -> editar producto (requiere login)
//   DELETE /api/products.php?id=5       -> borrar producto (requiere login)
//
// Algunos hostings compartidos bloquean PUT y DELETE antes de que lleguen
// a PHP. Por eso también se aceptan como POST con "_method" en la URL
// (así los manda el panel):
//   POST   /api/products.php?id=5&_method=PUT
//   POST   /api/products.php?id=5&_method=DELETE

declare(strict_types=1);
require __DIR__ . '/../db.php';
require __DIR__ . '/../cors.php';
require __DIR__ . '/../auth.php';
require __DIR__ . '/../helpers.php';

apply_cors();

$pdo = db();
$method = strtoupper($_SERVER['REQUEST_METHOD'] ?? 'GET');
if ($method === 'POST' && isset($_GET['_method'])) {
    $override = strtoupper((string) $_GET['_method']);
    if (in_array($override, ['PUT', 'DELETE'], true)) {
        $method = $override;
    }
}

if ($method === 'GET') {
    $id = isset($_GET['id']) ? (int) $_GET['id'] : null;

    if ($id !== null) {
        $stmt = $pdo->prepare('SELECT * FROM products WHERE id = :id LIMIT 1');
        $stmt->execute([':id' => $id]);
        $row = $stmt->fetch();
        // Un producto oculto (activo = 0) solo lo puede ver el panel.
        if (!$row || (!(int) $row['activo'] && current_admin() === null)) {
            json_out(['error' => 'Producto no encontrado.'], 404);
        }
        json_out(product_row_to_json($row));
    }

    $wantsAll = isset($_GET['all']) && $_GET['all'] === '1';
    if ($wantsAll) {
        require_admin(); // ver inactivos/sin publicar es solo para el panel
        $stmt = $pdo->query('SELECT * FROM products ORDER BY id ASC');
    } else {
        $stmt = $pdo->query('SELECT * FROM products WHERE activo = 1 ORDER BY id ASC');
    }

    $products = array_map('product_row_to_json', $stmt->fetchAll());
    json_out(['products' => $products]);
}

// A partir de acá, todo requiere estar logueado: crear, editar y borrar.
require_admin();

// Solo en escrituras: si la base es anterior a las promociones o al sku,
// agrega las columnas que faltan (las lecturas ya toleran que no estén).
if ($method === 'POST' || $method === 'PUT') {
    ensure_product_columns($pdo);
}

if ($method === 'POST') {
    $input = json_input();
    create_product($pdo, $input);
}

if ($method === 'PUT') {
    $id = isset($_GET['id']) ? (int) $_GET['id'] : null;
    if ($id === null) {
        json_out(['error' => 'Falta el id del producto a editar.'], 400);
    }
    $input = json_input();
    update_product($pdo, $id, $input);
}

if ($method === 'DELETE') {
    $id = isset($_GET['id']) ? (int) $_GET['id'] : null;
    if ($id === null) {
        json_out(['error' => 'Falta el id del producto a borrar.'], 400);
    }
    // Antes de borrar se anota qué foto tenía, para limpiarla después.
    $find = $pdo->prepare('SELECT * FROM products WHERE id = :id');
    $find->execute([':id' => $id]);
    $row = $find->fetch();
    if (!$row) {
        json_out(['error' => 'Producto no encontrado.'], 404);
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

json_out(['error' => 'Método no permitido.'], 405);

// ---------------------------------------------------------------------

function validated_fields(array $input, bool $isUpdate): array
{
    $nombre = trim((string) ($input['nombre'] ?? ''));
    $categoria = trim((string) ($input['categoria'] ?? ''));
    $precio = $input['precio'] ?? null;

    if (!$isUpdate || array_key_exists('nombre', $input)) {
        if ($nombre === '' || mb_strlen($nombre) > 255) {
            json_out(['error' => 'El nombre es obligatorio (máximo 255 caracteres).'], 400);
        }
    }
    if (!$isUpdate || array_key_exists('categoria', $input)) {
        if ($categoria === '' || mb_strlen($categoria) > 100) {
            json_out(['error' => 'La categoría es obligatoria.'], 400);
        }
    }
    if (!$isUpdate || array_key_exists('precio', $input)) {
        if (!is_numeric($precio) || (int) round((float) $precio) <= 0 || (float) $precio > 4000000000) {
            json_out(['error' => 'Cargá un precio válido.'], 400);
        }
    }

    $descripcion = isset($input['descripcion']) ? trim((string) $input['descripcion']) : null;
    if ((!$isUpdate || array_key_exists('descripcion', $input)) && ($descripcion === null || $descripcion === '')) {
        json_out(['error' => 'Escribí una descripción.'], 400);
    }

    $insignias = $input['insignias'] ?? [];
    if (!is_array($insignias)) {
        json_out(['error' => 'Las insignias tienen que ser una lista.'], 400);
    }
    $insignias = normalize_insignias($insignias);

    $variantes = $input['variantes'] ?? new stdClass();
    if (!is_array($variantes) && !is_object($variantes)) {
        json_out(['error' => 'Las variantes tienen que ser un objeto.'], 400);
    }
    // { "Talle": [ { nombre, descripcion, precio }, ... ] } (acepta también
    // el formato viejo de textos planos y lo convierte). Ver helpers.php.
    $variantes = normalize_variantes($variantes);
    if (is_string($variantes)) {
        json_out(['error' => $variantes], 400);
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
                json_out(['error' => 'Los colores del tinte tienen que ser hexadecimales (ej: #DC015B).'], 400);
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
            json_out(['error' => 'Las imágenes tienen que ser una lista.'], 400);
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
            json_out(['error' => 'Un producto puede tener hasta ' . MAX_PRODUCT_IMAGES . ' fotos.'], 400);
        }
        foreach ($imagenes as $url) {
            $imageError = image_url_error($url);
            if ($imageError !== null) {
                json_out(['error' => $imageError], 400);
            }
        }
    }

    $promo = isset($input['promo']) ? trim((string) $input['promo']) : null;
    if ($promo !== null && mb_strlen($promo) > 100) {
        json_out(['error' => 'La etiqueta de promo es muy larga (máximo 100 caracteres).'], 400);
    }

    $sku = isset($input['sku']) ? trim((string) $input['sku']) : null;
    if ($sku !== null && mb_strlen($sku) > 60) {
        json_out(['error' => 'El SKU es muy largo (máximo 60 caracteres).'], 400);
    }

    // Descuentos reales. Se aceptan en camelCase (como los devuelve la API).
    $descuentoPorcentaje = 0;
    if (array_key_exists('descuentoPorcentaje', $input)) {
        $raw = $input['descuentoPorcentaje'];
        if ($raw === null || $raw === '') {
            $raw = 0;
        }
        if (!is_numeric($raw) || (int) $raw < 0 || (int) $raw > 100) {
            json_out(['error' => 'El descuento directo tiene que estar entre 0 y 100.'], 400);
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
            json_out(['error' => 'Tipo de promoción inválido.'], 400);
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
            json_out(['error' => 'El descuento de la 2da unidad tiene que estar entre 0 y 100.'], 400);
        }
        $descuentoSegunda = (int) $raw;
    }
    if ($tipoPromocion === '2DA_UNIDAD_DESCUENTO'
        && array_key_exists('tipoPromocion', $input)
        && $descuentoSegunda <= 0) {
        json_out(['error' => 'Indicá qué % de descuento lleva la 2da unidad.'], 400);
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
        json_out(['error' => 'Producto no encontrado.'], 404);
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

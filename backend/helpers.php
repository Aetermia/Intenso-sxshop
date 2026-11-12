<?php
// Funciones chicas que usan varios endpoints.

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
        'imagen' => $row['imagen'],
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
// Fotos subidas desde el panel (carpeta backend/uploads)
// ---------------------------------------------------------------------

const IMAGE_MAX_SIDE = 1400;      // px del lado más largo (como las fotos del catálogo)
const IMAGE_WEBP_QUALITY = 82;    // 0-100: buen equilibrio entre peso y nitidez
const IMAGE_MAX_PIXELS = 30000000; // por encima de esto no se procesa (memoria del hosting)

// Achica la foto a IMAGE_MAX_SIDE y la convierte a WEBP, que pesa mucho
// menos que JPG/PNG con la misma calidad. Devuelve el contenido del archivo
// nuevo, o null si no se pudo o no conviene (hosting sin GD, foto gigante,
// o el resultado pesa más que el original): en ese caso quien llama guarda
// la foto original tal cual. No agrega marca de agua ni nada encima.
function compress_image_to_webp(string $path, string $mime): ?string
{
    if (!function_exists('imagewebp') || !function_exists('imagecreatetruecolor')) {
        return null;
    }
    $info = @getimagesize($path);
    if (!$info || $info[0] < 1 || $info[1] < 1 || $info[0] * $info[1] > IMAGE_MAX_PIXELS) {
        return null;
    }

    $loaders = [
        'image/jpeg' => 'imagecreatefromjpeg',
        'image/png' => 'imagecreatefrompng',
        'image/webp' => 'imagecreatefromwebp',
    ];
    $loader = $loaders[$mime] ?? null;
    if ($loader === null || !function_exists($loader)) {
        return null;
    }
    $src = @$loader($path);
    if (!$src) {
        return null;
    }

    // Las fotos de celular suelen venir "acostadas" con una marca EXIF que
    // dice cómo girarlas. Al convertir esa marca se pierde, así que se
    // endereza la imagen de verdad.
    if ($mime === 'image/jpeg' && function_exists('exif_read_data')) {
        $exif = @exif_read_data($path);
        $angles = [3 => 180, 6 => -90, 8 => 90];
        $orientation = (int) ($exif['Orientation'] ?? 1);
        if (isset($angles[$orientation])) {
            $rotated = imagerotate($src, $angles[$orientation], 0);
            if ($rotated) {
                imagedestroy($src);
                $src = $rotated;
            }
        }
    }

    $w = imagesx($src);
    $h = imagesy($src);
    $scale = min(1, IMAGE_MAX_SIDE / max($w, $h));
    $newW = max(1, (int) round($w * $scale));
    $newH = max(1, (int) round($h * $scale));

    // Lienzo nuevo en color real y con transparencia (los PNG sin fondo
    // siguen sin fondo).
    $dst = imagecreatetruecolor($newW, $newH);
    imagealphablending($dst, false);
    imagesavealpha($dst, true);
    imagefill($dst, 0, 0, imagecolorallocatealpha($dst, 0, 0, 0, 127));
    imagecopyresampled($dst, $src, 0, 0, 0, 0, $newW, $newH, $w, $h);
    imagedestroy($src);

    ob_start();
    $ok = imagewebp($dst, null, IMAGE_WEBP_QUALITY);
    $data = (string) ob_get_clean();
    imagedestroy($dst);

    if (!$ok || strlen($data) < 100) {
        return null;
    }
    // Si no hubo que achicarla y encima quedó más pesada, no conviene.
    if ($scale >= 1 && strlen($data) >= (int) @filesize($path)) {
        return null;
    }
    return $data;
}

// Ruta en disco de una foto subida desde el panel, a partir de lo que hay
// guardado en la columna `imagen`. Devuelve null si esa imagen NO es de
// backend/uploads (por ejemplo las del sitio, "/products/..."): esas nunca
// se tocan. Solo acepta los nombres que genera upload.php, así es imposible
// que termine apuntando a otro archivo del servidor.
function uploaded_image_path(?string $imagen): ?string
{
    if ($imagen === null || $imagen === '') {
        return null;
    }
    $cfg = app_config();
    $baseUrlPath = rtrim((string) parse_url((string) ($cfg['uploads_url'] ?? ''), PHP_URL_PATH), '/');
    $imagePath = (string) parse_url($imagen, PHP_URL_PATH);
    if ($baseUrlPath === '' || $imagePath === '') {
        return null;
    }
    $name = basename($imagePath);
    if ($imagePath !== $baseUrlPath . '/' . $name || !preg_match('/^[a-f0-9]{32}\.(jpg|png|webp)$/', $name)) {
        return null;
    }
    return rtrim((string) $cfg['uploads_dir'], '/') . '/' . $name;
}

// Borra del servidor una foto que ya no usa ningún producto. Llamarla
// DESPUÉS de guardar el cambio en la base (producto eliminado o con otra
// foto). Si falla no corta nada: lo peor que pasa es que quede el archivo.
function delete_uploaded_image_if_unused(PDO $pdo, ?string $imagen): void
{
    $path = uploaded_image_path($imagen);
    if ($path === null) {
        return;
    }
    try {
        // Se compara por nombre de archivo: cubre que la misma foto esté
        // guardada como ruta ("/backend/uploads/x") o como URL completa.
        $stmt = $pdo->prepare('SELECT COUNT(*) FROM products WHERE imagen LIKE :needle');
        $stmt->execute([':needle' => '%/' . basename($path)]);
        if ((int) $stmt->fetchColumn() > 0) {
            return;
        }
        if (is_file($path) && !@unlink($path)) {
            error_log('[intenso-backend] no se pudo borrar la foto ' . basename($path));
        }
    } catch (Throwable $e) {
        error_log('[intenso-backend] delete_uploaded_image_if_unused: ' . $e->getMessage());
    }
}

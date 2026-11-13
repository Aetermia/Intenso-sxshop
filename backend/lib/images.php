<?php
// Fotos de productos: validación de direcciones, compresión de las fotos
// subidas desde el panel (backend/uploads) y borrado de las que quedan sin
// uso. No agrega marca de agua ni nada encima.

declare(strict_types=1);

const MAX_PRODUCT_IMAGES = 3;
const MAX_UPLOAD_BYTES = 5 * 1024 * 1024; // 5 MB por foto
// Tipos aceptados (según el contenido real del archivo) -> extensión.
const UPLOAD_IMAGE_TYPES = [
    'image/jpeg' => 'jpg',
    'image/png' => 'png',
    'image/webp' => 'webp',
];
const IMAGE_MAX_SIDE = 1400;      // px del lado más largo (como las fotos del catálogo)
const IMAGE_WEBP_QUALITY = 82;    // 0-100: buen equilibrio entre peso y nitidez
const IMAGE_MAX_PIXELS = 30000000; // por encima de esto no se procesa (memoria del hosting)

// Valida la dirección de una foto: una URL o ruta (la que devuelve
// upload.php), nunca la foto en sí. Devuelve null si está bien, o el
// mensaje de error.
function image_url_error(string $imagen): ?string
{
    if (stripos($imagen, 'data:') === 0) {
        return 'La imagen se sube primero con upload.php; acá va solo su dirección.';
    }
    if (mb_strlen($imagen) > 500 || !preg_match('#^(https?://|/)[^\\s<>"\']+$#i', $imagen)) {
        return 'La dirección de la imagen no es válida.';
    }
    return null;
}

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
        // Se busca por nombre de archivo (32 caracteres al azar, no se
        // repite) tanto en la foto principal como en la lista de fotos.
        $needle = '%' . basename($path) . '%';
        $stmt = $pdo->prepare('SELECT COUNT(*) FROM products WHERE imagen LIKE :a OR imagenes LIKE :b');
        $stmt->execute([':a' => $needle, ':b' => $needle]);
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

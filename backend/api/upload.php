<?php
// Sube una foto de producto. Requiere estar logueado.
//   POST /api/upload.php   (multipart, campo "imagen")  -> 201 {"url": "..."}
// La foto se achica y se convierte a WEBP para que pese poco (ver
// lib/images.php). Devuelve la dirección para guardar en el producto.

declare(strict_types=1);
require __DIR__ . '/../lib/bootstrap.php';

require_method('POST');
require_admin();

$file = $_FILES['imagen'] ?? null;
if (!is_array($file)) {
    json_error('No llegó ningún archivo.', 400);
}
if (is_array($file['error'])) {
    json_error('Subí una sola imagen por vez.', 400);
}
if ($file['error'] === UPLOAD_ERR_INI_SIZE || $file['error'] === UPLOAD_ERR_FORM_SIZE) {
    json_error('La imagen pesa más de lo que permite el servidor. Probá con una más liviana.', 400);
}
if ($file['error'] !== UPLOAD_ERR_OK || !is_uploaded_file($file['tmp_name'])) {
    json_error('Error al subir el archivo.', 400);
}
if ($file['size'] > MAX_UPLOAD_BYTES) {
    json_error('La imagen pesa mucho. Subí una de menos de 5 MB.', 400);
}

$cfg = app_config();
$dir = rtrim((string) $cfg['uploads_dir'], '/');
if (!is_dir($dir) && !@mkdir($dir, 0755, true)) {
    json_error('No existe la carpeta de fotos (backend/uploads) y no se pudo crear.', 500);
}
if (!is_writable($dir)) {
    json_error('La carpeta backend/uploads no tiene permiso de escritura (dale 755 desde el Administrador de Archivos).', 500);
}

// Primero se mueve el archivo a uploads/ con un nombre temporal, y todo lo
// demás se hace sobre esa copia: en hosting compartido PHP muchas veces no
// tiene permiso para leer la carpeta temporal del sistema (open_basedir),
// pero mover lo subido siempre está permitido. Ese nombre temporal no se
// puede abrir desde el navegador (ver uploads/.htaccess).
$basename = bin2hex(random_bytes(16));
$tmpPath = $dir . '/.subiendo-' . $basename;
if (!@move_uploaded_file($file['tmp_name'], $tmpPath)) {
    $why = error_get_last()['message'] ?? 'sin detalle';
    json_error('No se pudo guardar la imagen en el servidor.', 500, 'move_uploaded_file: ' . $why);
}

// No confiamos en la extensión ni en el "content-type" que manda el
// navegador (se pueden falsear fácil): miramos el contenido real.
$realType = detect_image_type($tmpPath);
if (!isset(UPLOAD_IMAGE_TYPES[$realType])) {
    @unlink($tmpPath);
    json_error('Subí una imagen JPG, PNG o WEBP.', 400);
}

// Se achica y se pasa a WEBP; si no se puede, queda la original.
$compressed = compress_image_to_webp($tmpPath, $realType);
$filename = '';
if ($compressed !== null) {
    $filename = $basename . '.webp';
    if (@file_put_contents($dir . '/' . $filename, $compressed) === false) {
        error_log('[intenso-backend] no se pudo escribir la foto comprimida; se guarda la original');
        $compressed = null;
    } else {
        @unlink($tmpPath);
    }
}
if ($compressed === null) {
    $filename = $basename . '.' . UPLOAD_IMAGE_TYPES[$realType];
    if (!@rename($tmpPath, $dir . '/' . $filename)) {
        @unlink($tmpPath);
        $why = error_get_last()['message'] ?? 'sin detalle';
        json_error('No se pudo guardar la imagen en el servidor.', 500, 'rename: ' . $why);
    }
}

json_out([
    'url' => rtrim((string) $cfg['uploads_url'], '/') . '/' . $filename,
    'optimizada' => $compressed !== null,
    'bytes_original' => (int) $file['size'],
    'bytes_final' => (int) filesize($dir . '/' . $filename),
], 201);

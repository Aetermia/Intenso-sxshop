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

// No confiamos en la extensión ni en el "content-type" que manda el
// navegador (se pueden falsear fácil): miramos el contenido real.
if (class_exists('finfo')) {
    $realType = (string) (new finfo(FILEINFO_MIME_TYPE))->file($file['tmp_name']);
} else {
    // Hosting sin la extensión fileinfo: getimagesize también lee el contenido.
    $info = @getimagesize($file['tmp_name']);
    $realType = $info ? (string) $info['mime'] : '';
}
if (!isset(UPLOAD_IMAGE_TYPES[$realType])) {
    json_error('Subí una imagen JPG, PNG o WEBP.', 400);
}

$cfg = app_config();
$dir = rtrim((string) $cfg['uploads_dir'], '/');
if (!is_dir($dir) && !@mkdir($dir, 0755, true)) {
    json_error('No existe la carpeta de fotos (backend/uploads) y no se pudo crear.', 500);
}
if (!is_writable($dir)) {
    json_error('La carpeta backend/uploads no tiene permiso de escritura (dale 755 desde el Administrador de Archivos).', 500);
}

// Nombre de archivo random: nunca se usa el que mandó el navegador, así no
// hay rutas raras ni nombres pensados para pisar otro archivo.
$basename = bin2hex(random_bytes(16));
$compressed = compress_image_to_webp($file['tmp_name'], $realType);
if ($compressed !== null) {
    $filename = $basename . '.webp';
    if (file_put_contents($dir . '/' . $filename, $compressed) === false) {
        json_error('No se pudo guardar la imagen.', 500);
    }
} else {
    // No se pudo (o no convenía) comprimir: se guarda la original.
    $filename = $basename . '.' . UPLOAD_IMAGE_TYPES[$realType];
    if (!move_uploaded_file($file['tmp_name'], $dir . '/' . $filename)) {
        json_error('No se pudo guardar la imagen.', 500);
    }
}

json_out([
    'url' => rtrim((string) $cfg['uploads_url'], '/') . '/' . $filename,
    'optimizada' => $compressed !== null,
    'bytes_original' => (int) $file['size'],
    'bytes_final' => (int) filesize($dir . '/' . $filename),
], 201);

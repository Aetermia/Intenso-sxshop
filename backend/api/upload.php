<?php
// Sube una foto de producto. Requiere estar logueado.
// Devuelve la URL pública para guardar en el campo "imagen" del producto.

declare(strict_types=1);
require __DIR__ . '/../db.php';
require __DIR__ . '/../cors.php';
require __DIR__ . '/../auth.php';

apply_cors();
require_admin();

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    json_out(['error' => 'Método no permitido.'], 405);
}

if (!isset($_FILES['imagen'])) {
    json_out(['error' => 'No llegó ningún archivo.'], 400);
}

$file = $_FILES['imagen'];

if ($file['error'] !== UPLOAD_ERR_OK) {
    json_out(['error' => 'Error al subir el archivo.'], 400);
}

const MAX_BYTES = 5 * 1024 * 1024; // 5 MB
if ($file['size'] > MAX_BYTES) {
    json_out(['error' => 'La imagen pesa mucho. Subí una de menos de 5 MB.'], 400);
}

// No confiamos en la extensión ni en el "content-type" que manda el
// navegador (se pueden falsear fácil): miramos el contenido real del
// archivo con finfo.
$finfo = new finfo(FILEINFO_MIME_TYPE);
$realType = $finfo->file($file['tmp_name']);

$allowed = [
    'image/jpeg' => 'jpg',
    'image/png' => 'png',
    'image/webp' => 'webp',
];

if (!isset($allowed[$realType])) {
    json_out(['error' => 'Subí una imagen JPG, PNG o WEBP.'], 400);
}

$cfg = app_config();
$dir = $cfg['uploads_dir'];
if (!is_dir($dir)) {
    mkdir($dir, 0755, true);
}

// Nombre de archivo random: nunca usamos el nombre que mandó el navegador,
// así evitamos rutas raras o nombres pensados para pisar otro archivo.
$filename = bin2hex(random_bytes(16)) . '.' . $allowed[$realType];
$destination = rtrim($dir, '/') . '/' . $filename;

if (!move_uploaded_file($file['tmp_name'], $destination)) {
    json_out(['error' => 'No se pudo guardar la imagen.'], 500);
}

$url = rtrim($cfg['uploads_url'], '/') . '/' . $filename;
json_out(['url' => $url]);

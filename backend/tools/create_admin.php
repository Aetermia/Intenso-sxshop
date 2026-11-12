<?php
// Crea un usuario admin. Pensado para usarse UNA VEZ por cada persona que
// necesite entrar al panel, a través del formulario create_admin.html que
// está al lado de este archivo (no se usa directo desde la URL: así la
// contraseña nunca queda guardada en los logs del servidor).
//
// IMPORTANTE: borrá (o renombrá) esta carpeta tools/ completa del servidor
// cuando ya hayan creado a todos los admins que necesitan. Dejarla activa
// es un riesgo: cualquiera que adivine el setup_token podría crear un
// usuario nuevo.

declare(strict_types=1);
require __DIR__ . '/../db.php';
require __DIR__ . '/../cors.php';

apply_cors();

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    json_out(['error' => 'Método no permitido. Usá el formulario create_admin.html.'], 405);
}

$cfg = app_config();
$input = json_input();

// Si en config.php quedó el token de ejemplo (o uno cortito), cualquiera
// que haya visto el repositorio podría crear un admin: no se acepta.
$setupToken = (string) ($cfg['setup_token'] ?? '');
if (strlen($setupToken) < 16 || stripos($setupToken, 'cambiame') === 0) {
    json_out(['error' => 'Antes de crear un admin, poné un setup_token propio (largo y random, 16 caracteres o más) en backend/config.php.'], 403);
}

$token = (string) ($input['token'] ?? '');
if (!hash_equals($setupToken, $token)) {
    json_out(['error' => 'Token incorrecto.'], 403);
}

$email = trim((string) ($input['email'] ?? ''));
$password = (string) ($input['password'] ?? '');

if ($email === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    json_out(['error' => 'Mandá un mail válido.'], 400);
}

if (mb_strlen($password) < 8) {
    json_out(['error' => 'La contraseña tiene que tener al menos 8 caracteres.'], 400);
}

$pdo = db();
$hash = password_hash($password, PASSWORD_DEFAULT);

try {
    $stmt = $pdo->prepare(
        'INSERT INTO admin_users (email, password_hash) VALUES (:email, :hash)
         ON DUPLICATE KEY UPDATE password_hash = :hash2'
    );
    $stmt->execute([':email' => $email, ':hash' => $hash, ':hash2' => $hash]);
    json_out(['ok' => true, 'message' => "Admin creado/actualizado para $email."]);
} catch (PDOException $e) {
    error_log('[intenso-backend] create_admin: ' . $e->getMessage());
    json_out(['error' => 'Error al crear el admin. Revisá que hayas importado backend/schema.sql.'], 500);
}

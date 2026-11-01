<?php
declare(strict_types=1);
require __DIR__ . '/../db.php';
require __DIR__ . '/../cors.php';
require __DIR__ . '/../auth.php';

apply_cors();

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    json_out(['error' => 'Método no permitido.'], 405);
}

// Frenamos por IP antes de siquiera mirar el mail/contraseña: así da igual
// si prueban con mails que no existen, el límite es el mismo.
if (is_ip_rate_limited()) {
    json_out(['error' => 'Demasiados intentos. Probá de nuevo en unos minutos.'], 429);
}

$input = json_input();
$email = trim((string) ($input['email'] ?? ''));
$password = (string) ($input['password'] ?? '');

record_login_attempt();

if ($email === '' || $password === '') {
    json_out(['error' => 'Completá el mail y la contraseña.'], 400);
}

$user = verify_credentials($email, $password);
if ($user === null) {
    json_out(['error' => 'Mail o contraseña incorrectos.'], 401);
}

$token = create_session_token((int) $user['id']);

json_out([
    'token' => $token,
    'admin' => ['id' => (int) $user['id'], 'email' => $user['email']],
]);

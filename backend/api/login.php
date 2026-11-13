<?php
// Inicia sesión en el panel.
//   POST /api/login.php  {"email", "password"}  -> {"token", "admin"}

declare(strict_types=1);
require __DIR__ . '/../lib/bootstrap.php';

require_method('POST');

// Frenamos por IP antes de siquiera mirar el mail/contraseña: así da igual
// si prueban con mails que no existen, el límite es el mismo.
if (is_ip_rate_limited()) {
    json_error('Demasiados intentos. Probá de nuevo en unos minutos.', 429);
}

$input = json_input();
$email = trim((string) ($input['email'] ?? ''));
$password = (string) ($input['password'] ?? '');

record_login_attempt();

if ($email === '' || $password === '') {
    json_error('Completá el mail y la contraseña.', 400);
}

$user = verify_credentials($email, $password);
if ($user === null) {
    json_error('Mail o contraseña incorrectos.', 401);
}

json_out([
    'token' => create_session_token((int) $user['id']),
    'admin' => ['id' => (int) $user['id'], 'email' => $user['email']],
]);

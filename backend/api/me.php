<?php
// El panel llama a esto al cargar para saber si el token guardado todavía
// sirve (por ejemplo, después de recargar la página).

declare(strict_types=1);
require __DIR__ . '/../db.php';
require __DIR__ . '/../cors.php';
require __DIR__ . '/../auth.php';

apply_cors();

$user = require_admin();

json_out(['admin' => ['id' => (int) $user['id'], 'email' => $user['email']]]);

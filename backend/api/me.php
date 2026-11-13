<?php
// El panel llama a esto al cargar para saber si el token guardado todavía
// sirve (por ejemplo, después de recargar la página).
//   GET /api/me.php  -> {"admin": {...}}  o 401

declare(strict_types=1);
require __DIR__ . '/../lib/bootstrap.php';

require_method('GET');
$user = require_admin();

json_out(['admin' => ['id' => (int) $user['id'], 'email' => $user['email']]]);

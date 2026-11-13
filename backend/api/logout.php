<?php
// Cierra la sesión del panel (invalida el token).
//   POST /api/logout.php  -> {"ok": true}

declare(strict_types=1);
require __DIR__ . '/../lib/bootstrap.php';

require_method('POST');

$token = bearer_token();
if ($token !== null) {
    delete_session_token($token);
}

json_out(['ok' => true]);

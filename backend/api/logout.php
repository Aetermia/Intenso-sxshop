<?php
declare(strict_types=1);
require __DIR__ . '/../db.php';
require __DIR__ . '/../cors.php';
require __DIR__ . '/../auth.php';

apply_cors();

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    json_out(['error' => 'Método no permitido.'], 405);
}

$token = bearer_token();
if ($token !== null) {
    delete_session_token($token);
}

json_out(['ok' => true]);

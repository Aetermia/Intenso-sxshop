<?php
// Cuentas del panel. Todo requiere estar logueado.
//   GET    /api/admins.php            -> {"admins": [...]}
//   POST   /api/admins.php            {"email", "password"} -> 201 la cuenta creada
//   DELETE /api/admins.php?id=5       -> {"ok": true}   (también POST ...&_method=DELETE)
//   POST   /api/admins.php?action=password  {"actual", "nueva"} -> {"ok": true}
//
// La lógica está en lib/admins.php.

declare(strict_types=1);
require __DIR__ . '/../lib/bootstrap.php';

$method = require_method('GET', 'POST', 'DELETE');
if ($method === 'POST' && strtoupper((string) ($_GET['_method'] ?? '')) === 'DELETE') {
    $method = 'DELETE';
}

$admin = require_admin();
$currentId = (int) $admin['id'];
$pdo = db();

if ($method === 'GET') {
    json_out(['admins' => list_admins($pdo, $currentId)]);
}

if ($method === 'DELETE') {
    if (!isset($_GET['id'])) {
        json_error('Falta el id de la cuenta.', 400);
    }
    delete_admin_user($pdo, (int) $_GET['id'], $currentId);
    json_out(['ok' => true]);
}

// POST
$input = json_input();
if (($_GET['action'] ?? '') === 'password') {
    change_own_password($pdo, $admin, (string) ($input['actual'] ?? ''), (string) ($input['nueva'] ?? ''));
    json_out(['ok' => true]);
}

json_out(create_admin_user($pdo, (string) ($input['email'] ?? ''), (string) ($input['password'] ?? ''), $currentId), 201);

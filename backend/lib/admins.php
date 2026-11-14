<?php
// Cuentas del panel: listar, crear, borrar y cambiar la propia contraseña.
// Todas las cuentas tienen los mismos permisos. Nadie puede registrarse
// solo: una cuenta nueva la crea alguien que ya está logueado en el panel
// (o, la primera de todas, tools/create_admin.html).

declare(strict_types=1);

const MIN_PASSWORD_LENGTH = 8;

// Valida mail y contraseña nuevos. Devuelve el mail normalizado o corta
// con 400.
function validate_admin_input(string $email, string $password): string
{
    $email = strtolower(trim($email));
    if ($email === '' || mb_strlen($email) > 190 || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
        json_error('Escribí un mail válido.', 400);
    }
    validate_new_password($password);
    return $email;
}

function validate_new_password(string $password): void
{
    if (mb_strlen($password) < MIN_PASSWORD_LENGTH) {
        json_error('La contraseña tiene que tener al menos ' . MIN_PASSWORD_LENGTH . ' caracteres.', 400);
    }
    if (strlen($password) > 200) {
        json_error('La contraseña es demasiado larga.', 400);
    }
}

function admin_row_to_json(array $row, int $currentId): array
{
    return [
        'id' => (int) $row['id'],
        'email' => $row['email'],
        'createdAt' => $row['created_at'],
        'esVos' => (int) $row['id'] === $currentId,
    ];
}

function list_admins(PDO $pdo, int $currentId): array
{
    $rows = $pdo->query('SELECT id, email, created_at FROM admin_users ORDER BY created_at ASC, id ASC')->fetchAll();
    return array_map(fn (array $row) => admin_row_to_json($row, $currentId), $rows);
}

function create_admin_user(PDO $pdo, string $email, string $password, int $currentId): array
{
    $email = validate_admin_input($email, $password);
    $exists = $pdo->prepare('SELECT COUNT(*) FROM admin_users WHERE email = :email');
    $exists->execute([':email' => $email]);
    if ((int) $exists->fetchColumn() > 0) {
        json_error('Ya existe una cuenta con ese mail.', 409);
    }
    $stmt = $pdo->prepare('INSERT INTO admin_users (email, password_hash) VALUES (:email, :hash)');
    $stmt->execute([':email' => $email, ':hash' => password_hash($password, PASSWORD_DEFAULT)]);

    $row = $pdo->prepare('SELECT id, email, created_at FROM admin_users WHERE id = :id');
    $row->execute([':id' => (int) $pdo->lastInsertId()]);
    return admin_row_to_json($row->fetch(), $currentId);
}

// Borra otra cuenta (sus sesiones abiertas se cierran solas por la clave
// foránea). No se puede borrar la propia, así nunca queda el panel sin
// ninguna cuenta.
function delete_admin_user(PDO $pdo, int $id, int $currentId): void
{
    if ($id === $currentId) {
        json_error('No podés borrar tu propia cuenta. Pedile a otra persona con acceso que lo haga.', 400);
    }
    $stmt = $pdo->prepare('DELETE FROM admin_users WHERE id = :id');
    $stmt->execute([':id' => $id]);
    if ($stmt->rowCount() === 0) {
        json_error('Esa cuenta no existe.', 404);
    }
}

// Cambia la contraseña de quien está logueado, pidiendo la actual. Cierra
// las demás sesiones abiertas de esa cuenta (otros navegadores) y deja
// viva la actual.
function change_own_password(PDO $pdo, array $admin, string $current, string $new): void
{
    if (!password_verify($current, $admin['password_hash'])) {
        json_error('La contraseña actual no es correcta.', 400);
    }
    validate_new_password($new);
    if (hash_equals($current, $new)) {
        json_error('La contraseña nueva tiene que ser distinta de la actual.', 400);
    }
    $stmt = $pdo->prepare('UPDATE admin_users SET password_hash = :hash, failed_attempts = 0, locked_until = NULL WHERE id = :id');
    $stmt->execute([':hash' => password_hash($new, PASSWORD_DEFAULT), ':id' => (int) $admin['id']]);

    $token = bearer_token();
    $close = $pdo->prepare('DELETE FROM admin_sessions WHERE admin_id = :id AND token_hash <> :hash');
    $close->execute([':id' => (int) $admin['id'], ':hash' => $token !== null ? hash('sha256', $token) : '']);
}

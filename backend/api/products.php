<?php
// Endpoint de productos.
//   GET    /api/products.php            -> productos activos (público)
//   GET    /api/products.php?all=1      -> TODOS (requiere login, para el panel)
//   GET    /api/products.php?id=5       -> un producto (los ocultos, solo con login)
//   POST   /api/products.php            -> crear (requiere login)            201
//   PUT    /api/products.php?id=5       -> editar (requiere login)
//   DELETE /api/products.php?id=5       -> borrar (requiere login)
//
// Algunos hostings compartidos bloquean PUT y DELETE antes de que lleguen
// a PHP. Por eso también se aceptan como POST con "_method" en la URL
// (así los manda el panel):
//   POST   /api/products.php?id=5&_method=PUT
//   POST   /api/products.php?id=5&_method=DELETE
//
// La validación y el guardado están en lib/products.php.

declare(strict_types=1);
require __DIR__ . '/../lib/bootstrap.php';

$method = require_method('GET', 'POST', 'PUT', 'DELETE');
if ($method === 'POST' && isset($_GET['_method'])) {
    $override = strtoupper((string) $_GET['_method']);
    if (in_array($override, ['PUT', 'DELETE'], true)) {
        $method = $override;
    }
}

$pdo = db();
$id = isset($_GET['id']) ? (int) $_GET['id'] : null;

if ($method === 'GET') {
    if ($id !== null) {
        $stmt = $pdo->prepare('SELECT * FROM products WHERE id = :id LIMIT 1');
        $stmt->execute([':id' => $id]);
        $row = $stmt->fetch();
        // Un producto oculto (activo = 0) solo lo puede ver el panel.
        if (!$row || (!(int) $row['activo'] && current_admin() === null)) {
            json_error('Producto no encontrado.', 404);
        }
        json_out(product_row_to_json($row));
    }

    if (($_GET['all'] ?? '') === '1') {
        require_admin(); // ver los ocultos es solo para el panel
        $stmt = $pdo->query('SELECT * FROM products ORDER BY id ASC');
    } else {
        $stmt = $pdo->query('SELECT * FROM products WHERE activo = 1 ORDER BY id ASC');
    }
    json_out(['products' => array_map('product_row_to_json', $stmt->fetchAll())]);
}

// A partir de acá, todo requiere estar logueado: crear, editar y borrar.
require_admin();

if ($method === 'POST') {
    ensure_product_columns($pdo);
    create_product($pdo, json_input());
}

if ($id === null) {
    json_error('Falta el id del producto.', 400);
}

if ($method === 'PUT') {
    ensure_product_columns($pdo);
    update_product($pdo, $id, json_input());
}

// DELETE
delete_product($pdo, $id);

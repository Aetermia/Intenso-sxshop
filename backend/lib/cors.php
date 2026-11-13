<?php
// Controla desde qué sitios se puede llamar a esta API. Sin esto, cualquier
// página del mundo podría intentar leer o escribir nuestros datos desde el
// navegador del cliente.

declare(strict_types=1);

function apply_cors(): void
{
    $allowed = app_config()['allowed_origins'] ?? [];
    $origin = $_SERVER['HTTP_ORIGIN'] ?? '';

    if ($origin !== '' && in_array($origin, $allowed, true)) {
        header('Access-Control-Allow-Origin: ' . $origin);
        header('Vary: Origin');
    }

    header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Auth-Token');
    header('Access-Control-Max-Age: 600');

    // El navegador manda un "OPTIONS" antes del pedido real (preflight);
    // acá solo confirmamos los headers de arriba y cortamos, sin hacer nada más.
    if (($_SERVER['REQUEST_METHOD'] ?? '') === 'OPTIONS') {
        http_response_code(204);
        exit;
    }
}

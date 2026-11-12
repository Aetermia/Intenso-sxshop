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

function json_input(): array
{
    $raw = file_get_contents('php://input');
    if ($raw === false || $raw === '') {
        return [];
    }
    $data = json_decode($raw, true);
    return is_array($data) ? $data : [];
}

function json_out($data, int $status = 200): void
{
    http_response_code($status);
    header('Content-Type: application/json; charset=utf-8');
    // Las respuestas de la API nunca se cachean: un cambio hecho en el
    // panel se tiene que ver en la tienda apenas se recarga.
    header('Cache-Control: no-store');
    echo json_encode($data, JSON_UNESCAPED_UNICODE);
    exit;
}

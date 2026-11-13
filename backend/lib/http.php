<?php
// Respuestas JSON de la API. Todos los endpoints responden con estas
// funciones, así el formato es siempre el mismo:
//   - éxito: el dato pedido (código 200, o 201 al crear);
//   - error: {"error": "mensaje para mostrar"} con su código HTTP
//     (400 datos inválidos, 401 sin sesión, 403 prohibido, 404 no existe,
//     405 método incorrecto, 429 demasiados intentos, 500 error del servidor).

declare(strict_types=1);

// Cuerpo JSON del pedido como array ([] si no vino o no es JSON válido).
function json_input(): array
{
    $raw = file_get_contents('php://input');
    if ($raw === false || $raw === '') {
        return [];
    }
    $data = json_decode($raw, true);
    return is_array($data) ? $data : [];
}

// Responde con éxito y corta el script.
function json_out($data, int $status = 200): void
{
    if (!headers_sent()) {
        http_response_code($status);
        header('Content-Type: application/json; charset=utf-8');
        // Las respuestas de la API nunca se cachean: un cambio hecho en el
        // panel se tiene que ver en la tienda apenas se recarga.
        header('Cache-Control: no-store');
    }
    echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

// Responde con error y corta el script. El detalle técnico ($logDetail) va
// al log del servidor, nunca al navegador: así no se filtran claves,
// nombres de tablas ni rutas del hosting.
function json_error(string $message, int $status = 400, ?string $logDetail = null): void
{
    if ($logDetail !== null) {
        error_log('[intenso-backend] ' . $logDetail);
    }
    json_out(['error' => $message], $status);
}

// Corta con 405 si el pedido no usa el método esperado ('GET', 'POST'...).
function require_method(string ...$allowed): string
{
    $method = strtoupper($_SERVER['REQUEST_METHOD'] ?? 'GET');
    if (!in_array($method, $allowed, true)) {
        header('Allow: ' . implode(', ', $allowed));
        json_error('Método no permitido.', 405);
    }
    return $method;
}

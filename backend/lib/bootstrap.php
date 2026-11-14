<?php
// Punto de entrada común de todos los endpoints (api/*.php y tools/*.php):
//   require __DIR__ . '/../lib/bootstrap.php';
// Carga las piezas del backend, configura el manejo de errores y aplica
// CORS. Esta carpeta lib/ no se puede abrir desde el navegador (.htaccess).

declare(strict_types=1);

// Nada de warnings mezclados con el JSON: los errores de PHP van al log del
// servidor, nunca a la pantalla.
ini_set('display_errors', '0');
error_reporting(E_ALL);

require __DIR__ . '/http.php';
require __DIR__ . '/db.php';
require __DIR__ . '/cors.php';
require __DIR__ . '/auth.php';
require __DIR__ . '/images.php';
require __DIR__ . '/products.php';

// Cualquier warning o notice de PHP se trata como error (los suprimidos a
// propósito con @ se respetan): mejor cortar con un mensaje claro que
// seguir con datos a medias.
set_error_handler(function (int $severity, string $message, string $file, int $line): bool {
    if (!(error_reporting() & $severity)) {
        return false;
    }
    throw new ErrorException($message, 0, $severity, $file, $line);
});

// Cualquier error no previsto (una consulta que falla, una tabla que
// falta) responde JSON prolijo en vez de un error de PHP en HTML.
set_exception_handler(function (Throwable $e): void {
    $msg = $e instanceof PDOException
        ? 'Error de base de datos. Revisá que hayas importado backend/schema.sql.'
        : 'Error interno del servidor.';
    json_error($msg, 500, get_class($e) . ': ' . $e->getMessage() . ' @ ' . basename($e->getFile()) . ':' . $e->getLine());
});

apply_cors();

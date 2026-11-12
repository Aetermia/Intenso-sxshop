<?php
// Conexión a MySQL. Todo el resto del backend usa esta función en vez de
// abrir conexiones propias, y SIEMPRE con consultas preparadas (nunca
// pegando texto del usuario directo en el SQL).

declare(strict_types=1);

// Corta el pedido con un error en JSON. El detalle técnico va al log del
// servidor (error_log), nunca al navegador: así no se filtran claves,
// nombres de tablas ni rutas del hosting.
function fail_json(string $publicMessage, int $status = 500, ?string $logDetail = null): void
{
    if ($logDetail !== null) {
        error_log('[intenso-backend] ' . $logDetail);
    }
    if (!headers_sent()) {
        http_response_code($status);
        header('Content-Type: application/json; charset=utf-8');
    }
    echo json_encode(['error' => $publicMessage], JSON_UNESCAPED_UNICODE);
    exit;
}

// Cualquier error no previsto (una consulta que falla, una tabla que
// falta) responde JSON prolijo en vez de un error de PHP en HTML, que el
// sitio no podría leer y que puede mostrar datos internos.
set_exception_handler(function (Throwable $e): void {
    $msg = $e instanceof PDOException
        ? 'Error de base de datos. Revisá que hayas importado backend/schema.sql.'
        : 'Error interno del servidor.';
    fail_json($msg, 500, get_class($e) . ': ' . $e->getMessage() . ' @ ' . basename($e->getFile()) . ':' . $e->getLine());
});

function app_config(): array
{
    static $config = null;
    if ($config === null) {
        $path = __DIR__ . '/config.php';
        if (!is_file($path)) {
            fail_json('Falta backend/config.php. Copiá config.example.php a config.php y completá los datos.');
        }
        $config = require $path;
        if (!is_array($config) || !isset($config['db']) || !is_array($config['db'])) {
            fail_json('backend/config.php no tiene el formato esperado. Volvé a copiarlo desde config.example.php.');
        }
        foreach (['host', 'name', 'user', 'pass'] as $key) {
            if (!array_key_exists($key, $config['db'])) {
                fail_json("En backend/config.php falta el dato 'db' > '$key'.");
            }
        }
    }
    return $config;
}

function db(): PDO
{
    static $pdo = null;
    if ($pdo === null) {
        if (!extension_loaded('pdo_mysql')) {
            fail_json('El servidor no tiene activa la extensión pdo_mysql de PHP. Activala desde el panel del hosting.');
        }
        $cfg = app_config()['db'];
        // Solo letras, números y guion bajo: el charset va dentro del DSN.
        $charset = preg_replace('/[^a-zA-Z0-9_]/', '', (string) ($cfg['charset'] ?? 'utf8mb4')) ?: 'utf8mb4';
        $dsn = 'mysql:host=' . $cfg['host'];
        if (!empty($cfg['port'])) {
            $dsn .= ';port=' . (int) $cfg['port'];
        }
        $dsn .= ';dbname=' . $cfg['name'] . ';charset=' . $charset;
        try {
            $pdo = new PDO($dsn, (string) $cfg['user'], (string) $cfg['pass'], [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES => false, // prepared statements reales, no simuladas
            ]);
        } catch (PDOException $e) {
            // El código de MySQL alcanza para diagnosticar (1045 = usuario o
            // clave mal, 1049 = no existe la base, 2002 = host mal) y no
            // revela ninguna credencial. El mensaje completo va solo al log.
            $code = (int) ($e->errorInfo[1] ?? 0);
            $hints = [
                1044 => 'el usuario no tiene permisos sobre esa base',
                1045 => 'usuario o contraseña incorrectos',
                1049 => 'no existe una base con ese nombre',
                2002 => 'no se encuentra el servidor (revisá el host)',
                2005 => 'no se encuentra el servidor (revisá el host)',
            ];
            $hint = isset($hints[$code]) ? ' (' . $hints[$code] . ')' : '';
            fail_json(
                "No se pudo conectar a la base de datos$hint. Revisá los datos de 'db' en backend/config.php.",
                500,
                'Conexión MySQL falló [' . $code . ']: ' . $e->getMessage()
            );
        }
    }
    return $pdo;
}

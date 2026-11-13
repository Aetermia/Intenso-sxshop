<?php
// Configuración (backend/config.php) y conexión a MySQL. Todo el backend
// usa db() en vez de abrir conexiones propias, y SIEMPRE con consultas
// preparadas (nunca pegando texto del usuario directo en el SQL). PHP
// cierra la conexión solo al terminar cada pedido.

declare(strict_types=1);

function app_config(): array
{
    static $config = null;
    if ($config === null) {
        $path = dirname(__DIR__) . '/config.php';
        if (!is_file($path)) {
            json_error('Falta backend/config.php. Copiá config.example.php a config.php y completá los datos.', 500);
        }
        $config = require $path;
        if (!is_array($config) || !isset($config['db']) || !is_array($config['db'])) {
            json_error('backend/config.php no tiene el formato esperado. Volvé a copiarlo desde config.example.php.', 500);
        }
        foreach (['host', 'name', 'user', 'pass'] as $key) {
            if (!array_key_exists($key, $config['db'])) {
                json_error("En backend/config.php falta el dato 'db' > '$key'.", 500);
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
            json_error('El servidor no tiene activa la extensión pdo_mysql de PHP. Activala desde el panel del hosting.', 500);
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
            json_error(
                "No se pudo conectar a la base de datos$hint. Revisá los datos de 'db' en backend/config.php.",
                500,
                'Conexión MySQL falló [' . $code . ']: ' . $e->getMessage()
            );
        }
    }
    return $pdo;
}

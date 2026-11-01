<?php
// Copiá este archivo a config.php (mismo directorio) y completá los datos
// reales ahí. config.php NUNCA se sube a GitHub (está en .gitignore) —
// las claves reales solo viven en el servidor de DonWeb.

return [
    // Datos de conexión a MySQL (los da DonWeb al crear la base de datos).
    'db' => [
        'host' => 'localhost',
        'name' => 'nombre_de_la_base',
        'user' => 'usuario_mysql',
        'pass' => 'contraseña_mysql',
        'charset' => 'utf8mb4',
    ],

    // Dominios desde los que el navegador puede llamar a esta API.
    // Poné acá el dominio real del sitio (y el de Vercel si lo seguís usando
    // en paralelo). Nunca uses "*" junto con credenciales/tokens.
    'allowed_origins' => [
        'https://intensotandil.com.ar',
        'https://intensoshop.vercel.app',
    ],

    // Token secreto de un solo uso para poder crear el primer admin desde
    // tools/create_admin.php. Generá uno random vos mismo (cualquier texto
    // largo) y borralo (o cambialo) después de crear el primer usuario.
    'setup_token' => 'cambiame-por-algo-largo-y-random',

    // Carpeta donde se guardan las fotos subidas, y la URL pública con la
    // que el navegador las puede ver. Tienen que apuntar al mismo lugar.
    'uploads_dir' => __DIR__ . '/uploads',
    'uploads_url' => '/backend/uploads',
];

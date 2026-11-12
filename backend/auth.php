<?php
// Todo lo relacionado a "quién puede entrar al panel": login, tokens de
// sesión y el freno contra que alguien pruebe contraseñas a lo loco.
//
// Cómo funciona el login (en criollo):
// 1. El panel manda email + contraseña a /api/login.php
// 2. Si está bien, generamos un "token" random (como una llave larga)
// 3. Guardamos un hash de esa llave en la base (nunca la llave en texto plano)
// 4. Le devolvemos la llave real al panel UNA sola vez
// 5. El panel la guarda y la manda en cada pedido siguiente
//    (header "Authorization: Bearer <llave>")
// 6. Nosotros, en cada pedido, volvemos a hashear lo que nos mandan y
//    buscamos ese hash en la base. Si existe y no venció, están logueados.

declare(strict_types=1);

const SESSION_LIFETIME_HOURS = 12;
const MAX_LOGIN_ATTEMPTS_PER_WINDOW = 10; // por IP, en la ventana de abajo
const LOGIN_ATTEMPT_WINDOW_MINUTES = 15;
const MAX_FAILED_ATTEMPTS_PER_ACCOUNT = 5;
const ACCOUNT_LOCK_MINUTES = 15;

function client_ip(): string
{
    return $_SERVER['REMOTE_ADDR'] ?? 'desconocida';
}

// Registra el intento (se llama siempre, haya salido bien o mal el login) y
// dice si esta IP ya se pasó de la cantidad de intentos permitida.
function is_ip_rate_limited(): bool
{
    $pdo = db();
    $stmt = $pdo->prepare(
        'SELECT COUNT(*) FROM login_attempts
         WHERE ip_address = :ip AND attempted_at > (NOW() - INTERVAL :mins MINUTE)'
    );
    $stmt->execute([
        ':ip' => client_ip(),
        ':mins' => LOGIN_ATTEMPT_WINDOW_MINUTES,
    ]);
    return (int) $stmt->fetchColumn() >= MAX_LOGIN_ATTEMPTS_PER_WINDOW;
}

function record_login_attempt(): void
{
    $pdo = db();
    $stmt = $pdo->prepare('INSERT INTO login_attempts (ip_address) VALUES (:ip)');
    $stmt->execute([':ip' => client_ip()]);

    // Limpieza: los intentos viejos y las sesiones vencidas ya no sirven
    // para nada; así las tablas no crecen para siempre.
    $pdo->exec('DELETE FROM login_attempts WHERE attempted_at < (NOW() - INTERVAL 1 DAY)');
    $pdo->exec('DELETE FROM admin_sessions WHERE expires_at < NOW()');
}

// Verifica email + contraseña. Devuelve el usuario (array) si está todo
// bien, o null si no. No dice nunca "el mail no existe" vs "la clave está
// mal" por separado, para no regalarle esa info a quien intenta adivinar.
function verify_credentials(string $email, string $password): ?array
{
    $pdo = db();
    // El bloqueo se compara dentro de MySQL (locked_until contra NOW()):
    // si se comparara en PHP, un huso horario distinto entre PHP y MySQL
    // (común en hosting compartido) lo alargaría o lo anularía.
    $stmt = $pdo->prepare(
        'SELECT u.*, (u.locked_until IS NOT NULL AND u.locked_until > NOW()) AS is_locked
         FROM admin_users u WHERE u.email = :email LIMIT 1'
    );
    $stmt->execute([':email' => $email]);
    $user = $stmt->fetch();

    if (!$user) {
        return null;
    }

    if ((int) $user['is_locked'] === 1) {
        return null; // cuenta bloqueada temporalmente por demasiados intentos
    }

    if (!password_verify($password, $user['password_hash'])) {
        $attempts = (int) $user['failed_attempts'] + 1;
        if ($attempts >= MAX_FAILED_ATTEMPTS_PER_ACCOUNT) {
            $lock = $pdo->prepare(
                'UPDATE admin_users
                 SET failed_attempts = 0, locked_until = (NOW() + INTERVAL :mins MINUTE)
                 WHERE id = :id'
            );
            $lock->execute([':mins' => ACCOUNT_LOCK_MINUTES, ':id' => $user['id']]);
        } else {
            $upd = $pdo->prepare('UPDATE admin_users SET failed_attempts = :n WHERE id = :id');
            $upd->execute([':n' => $attempts, ':id' => $user['id']]);
        }
        return null;
    }

    // Login correcto: reseteamos el contador de intentos fallidos.
    $reset = $pdo->prepare('UPDATE admin_users SET failed_attempts = 0, locked_until = NULL WHERE id = :id');
    $reset->execute([':id' => $user['id']]);

    return $user;
}

function create_session_token(int $adminId): string
{
    $token = bin2hex(random_bytes(32));
    $hash = hash('sha256', $token);

    $pdo = db();
    $stmt = $pdo->prepare(
        'INSERT INTO admin_sessions (admin_id, token_hash, expires_at)
         VALUES (:admin_id, :hash, NOW() + INTERVAL :hrs HOUR)'
    );
    $stmt->execute([
        ':admin_id' => $adminId,
        ':hash' => $hash,
        ':hrs' => SESSION_LIFETIME_HOURS,
    ]);

    return $token;
}

// Lee el token que manda el panel. En hosting compartido (PHP como
// CGI/FastCGI) Apache suele NO pasarle a PHP el header "Authorization",
// así que se prueba en todos los lugares donde puede aparecer y, como
// último recurso, en el header propio "X-Auth-Token" que el panel manda
// siempre con el mismo valor.
function bearer_token(): ?string
{
    $candidates = [
        $_SERVER['HTTP_AUTHORIZATION'] ?? '',
        $_SERVER['REDIRECT_HTTP_AUTHORIZATION'] ?? '',
    ];
    if (function_exists('getallheaders')) {
        foreach ((array) getallheaders() as $name => $value) {
            if (strcasecmp((string) $name, 'Authorization') === 0) {
                $candidates[] = (string) $value;
            }
        }
    }
    foreach ($candidates as $header) {
        if (preg_match('/^Bearer\s+(.+)$/i', trim((string) $header), $m)) {
            return trim($m[1]);
        }
    }
    $fallback = trim((string) ($_SERVER['HTTP_X_AUTH_TOKEN'] ?? ''));
    return $fallback !== '' ? $fallback : null;
}

// Devuelve el admin logueado (array) según el token del header, o null.
function current_admin(): ?array
{
    $token = bearer_token();
    if ($token === null || $token === '') {
        return null;
    }

    $hash = hash('sha256', $token);
    $pdo = db();
    $stmt = $pdo->prepare(
        'SELECT u.* FROM admin_sessions s
         JOIN admin_users u ON u.id = s.admin_id
         WHERE s.token_hash = :hash AND s.expires_at > NOW()
         LIMIT 1'
    );
    $stmt->execute([':hash' => $hash]);
    $user = $stmt->fetch();
    return $user ?: null;
}

// Cortina de seguridad: llamalo al principio de cualquier endpoint que solo
// puede usar el panel logueado (crear/editar/borrar productos, subir fotos).
function require_admin(): array
{
    $user = current_admin();
    if ($user === null) {
        json_out(['error' => 'No autorizado. Iniciá sesión de nuevo.'], 401);
    }
    return $user;
}

function delete_session_token(string $token): void
{
    $hash = hash('sha256', $token);
    $pdo = db();
    $stmt = $pdo->prepare('DELETE FROM admin_sessions WHERE token_hash = :hash');
    $stmt->execute([':hash' => $hash]);
}

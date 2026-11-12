<?php
// Funciones chicas que usan varios endpoints.

declare(strict_types=1);

function slugify(string $text): string
{
    // Reemplazo a mano de los caracteres del español: iconv con TRANSLIT
    // depende de la configuración regional del servidor y en algunos
    // hostings devuelve "?" (o falla) con las letras acentuadas.
    $text = strtr($text, [
        'á' => 'a', 'é' => 'e', 'í' => 'i', 'ó' => 'o', 'ú' => 'u', 'ü' => 'u', 'ñ' => 'n',
        'Á' => 'a', 'É' => 'e', 'Í' => 'i', 'Ó' => 'o', 'Ú' => 'u', 'Ü' => 'u', 'Ñ' => 'n',
    ]);
    $ascii = @iconv('UTF-8', 'ASCII//TRANSLIT//IGNORE', $text);
    if ($ascii !== false && $ascii !== '') {
        $text = $ascii;
    }
    $text = strtolower($text);
    $text = preg_replace('/[^a-z0-9]+/', '-', $text) ?? '';
    return substr(trim($text, '-'), 0, 180);
}

function unique_slug(PDO $pdo, string $base, ?int $excludeId = null): string
{
    $slug = $base !== '' ? $base : 'producto';
    $i = 2;
    while (true) {
        $sql = 'SELECT COUNT(*) FROM products WHERE slug = :slug';
        $params = [':slug' => $slug];
        if ($excludeId !== null) {
            $sql .= ' AND id != :id';
            $params[':id'] = $excludeId;
        }
        $stmt = $pdo->prepare($sql);
        $stmt->execute($params);
        if ((int) $stmt->fetchColumn() === 0) {
            return $slug;
        }
        $slug = $base . '-' . $i;
        $i++;
    }
}

// Tipos de promoción por volumen que entiende el sitio (src/utils/pricing.js).
const PROMO_TYPES = ['NONE', '2X1', '2DA_UNIDAD_DESCUENTO'];

function normalize_promo_type($value): string
{
    $v = strtoupper(trim((string) $value));
    return in_array($v, PROMO_TYPES, true) ? $v : 'NONE';
}

// Agrega las columnas que se sumaron después de la primera versión del
// esquema (promociones, sku) si la base se creó antes de que existieran.
// Es idempotente: si ya están, no hace nada. Si el usuario de MySQL no
// tiene permiso de ALTER, falla en silencio y hay que correr a mano los
// scripts de backend/migrations/.
function ensure_product_columns(PDO $pdo): void
{
    $columns = [
        'sku' => "VARCHAR(60) NULL DEFAULT NULL AFTER slug",
        'descuento_porcentaje' => "TINYINT UNSIGNED NOT NULL DEFAULT 0 AFTER promo",
        'tipo_promocion' => "VARCHAR(50) NOT NULL DEFAULT 'NONE' AFTER descuento_porcentaje",
        'descuento_segunda_unidad' => "TINYINT UNSIGNED NOT NULL DEFAULT 0 AFTER tipo_promocion",
    ];
    try {
        $existing = $pdo->query('SHOW COLUMNS FROM products')->fetchAll(PDO::FETCH_COLUMN);
        foreach ($columns as $name => $definition) {
            if (!in_array($name, $existing, true)) {
                // $name y $definition son constantes de este archivo, no
                // vienen del usuario: es seguro armarlas en el SQL.
                $pdo->exec("ALTER TABLE products ADD COLUMN `$name` $definition");
            }
        }
    } catch (PDOException $e) {
        // Sin permiso de ALTER u otro problema: lo dejamos anotado en el
        // log; si la columna de verdad falta, el INSERT/UPDATE avisa.
        error_log('[intenso-backend] ensure_product_columns: ' . $e->getMessage());
    }
}

// Lee una columna que guarda JSON como texto. Devuelve siempre un array
// (vacío si la columna está en NULL, vacía o con un JSON roto), para que
// un dato mal cargado a mano en phpMyAdmin no rompa toda la tienda.
function decode_json_column($raw): array
{
    if ($raw === null || $raw === '') {
        return [];
    }
    $data = json_decode((string) $raw, true);
    return is_array($data) ? $data : [];
}

// Lista de insignias limpia: solo textos, sin vacíos ni repetidos.
function normalize_insignias($insignias): array
{
    $out = [];
    foreach ((array) $insignias as $badge) {
        if (!is_scalar($badge)) {
            continue;
        }
        $badge = mb_substr(trim((string) $badge), 0, 60);
        if ($badge !== '' && !in_array($badge, $out, true)) {
            $out[] = $badge;
        }
    }
    return $out;
}

// Normaliza las variantes al formato:
//   { "Talle": [ { "nombre": "S", "descripcion": "65x25 cm", "precio": 25000 }, ... ] }
// - Opciones como texto plano (formato viejo) -> { nombre, descripcion: "", precio: null }.
// - precio vacío, 0 o inválido -> null (hereda el precio base del producto).
// - Grupos sin nombre u opciones sin nombre se descartan; nombres repetidos
//   dentro de un grupo también.
// Devuelve un stdClass/array listo para json_encode, o un string con el error.
function normalize_variantes($variantes)
{
    $out = [];
    foreach ((array) $variantes as $grupo => $opciones) {
        $grupo = trim((string) $grupo);
        if ($grupo === '') {
            continue;
        }
        if (is_string($opciones)) {
            $opciones = explode(',', $opciones);
        }
        if (!is_array($opciones)) {
            return "Las opciones de \"$grupo\" tienen que ser una lista.";
        }
        $lista = [];
        $vistos = [];
        foreach ($opciones as $opt) {
            if (is_object($opt)) {
                $opt = (array) $opt;
            }
            if (is_array($opt)) {
                $nombre = trim((string) ($opt['nombre'] ?? ''));
                $descripcion = trim((string) ($opt['descripcion'] ?? ''));
                $rawPrecio = $opt['precio'] ?? null;
            } elseif (is_scalar($opt)) {
                $nombre = trim((string) $opt);
                $descripcion = '';
                $rawPrecio = null;
            } else {
                continue;
            }
            if ($nombre === '' || isset($vistos[$nombre])) {
                continue;
            }
            $precio = null;
            if ($rawPrecio !== null && $rawPrecio !== '') {
                if (!is_numeric($rawPrecio) || (float) $rawPrecio < 0) {
                    return "El precio de \"$grupo: $nombre\" no es válido.";
                }
                $precio = (int) round((float) $rawPrecio);
                if ($precio <= 0) {
                    $precio = null;
                }
            }
            $vistos[$nombre] = true;
            $lista[] = [
                'nombre' => mb_substr($nombre, 0, 100),
                'descripcion' => mb_substr($descripcion, 0, 255),
                'precio' => $precio,
            ];
        }
        if ($lista) {
            $out[mb_substr($grupo, 0, 60)] = $lista;
        }
    }
    // Objeto vacío ({}) y no lista vacía ([]) cuando no hay variantes.
    return $out ? $out : new stdClass();
}

// Convierte la fila de la base (con las columnas JSON todavía como texto)
// al formato que espera el sitio: números como números de verdad (no
// como texto, que rompería las cuentas en JavaScript), insignias como
// lista, variantes como objeto y tinte como [colorA, colorB].
function product_row_to_json(array $row): array
{
    // Pasa por normalize_variantes también al leer: así el formato viejo
    // (textos planos) o un JSON tocado a mano salen siempre con la misma
    // forma { grupo: [ { nombre, descripcion, precio } ] }.
    $variantes = normalize_variantes(decode_json_column($row['variantes'] ?? null));
    if (is_string($variantes)) {
        $variantes = new stdClass();
    }

    return [
        'id' => (int) $row['id'],
        'slug' => $row['slug'],
        'sku' => $row['sku'] ?? null,
        'nombre' => $row['nombre'],
        'categoria' => $row['categoria'],
        'precio' => (int) $row['precio'],
        'imagen' => $row['imagen'],
        'insignias' => normalize_insignias(decode_json_column($row['insignias'] ?? null)),
        'variantes' => $variantes,
        'descripcion' => (string) ($row['descripcion'] ?? ''),
        'instrucciones' => (string) ($row['instrucciones'] ?? ''),
        'promo' => $row['promo'],
        // ?? por si la base todavía no tiene las columnas de promociones.
        'descuentoPorcentaje' => max(0, min(100, (int) ($row['descuento_porcentaje'] ?? 0))),
        'tipoPromocion' => normalize_promo_type($row['tipo_promocion'] ?? 'NONE'),
        'descuentoSegundaUnidad' => max(0, min(100, (int) ($row['descuento_segunda_unidad'] ?? 0))),
        'tinte' => ($row['tinte_inicio'] && $row['tinte_fin'])
            ? [$row['tinte_inicio'], $row['tinte_fin']]
            : null,
        'destacado' => (bool) $row['destacado'],
        'ordenDestacado' => $row['orden_destacado'] !== null ? (int) $row['orden_destacado'] : null,
        'activo' => (bool) $row['activo'],
        'sinStock' => (bool) $row['sin_stock'],
    ];
}

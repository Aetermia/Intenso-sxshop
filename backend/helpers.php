<?php
// Funciones chicas que usan varios endpoints.

declare(strict_types=1);

function slugify(string $text): string
{
    $text = iconv('UTF-8', 'ASCII//TRANSLIT', $text) ?: $text;
    $text = strtolower($text);
    $text = preg_replace('/[^a-z0-9]+/', '-', $text) ?? '';
    return trim($text, '-');
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

// Agrega las columnas de promociones si la base se creó antes de que
// existieran. Es idempotente: si ya están, no hace nada. Si el usuario de
// MySQL no tiene permiso de ALTER, falla en silencio y hay que correr
// migrations/001_promociones.sql a mano.
function ensure_promo_columns(PDO $pdo): void
{
    $columns = [
        'descuento_porcentaje' => "INT NOT NULL DEFAULT 0 AFTER promo",
        'tipo_promocion' => "VARCHAR(50) NOT NULL DEFAULT 'NONE' AFTER descuento_porcentaje",
        'descuento_segunda_unidad' => "INT NOT NULL DEFAULT 0 AFTER tipo_promocion",
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
        // Sin permiso de ALTER u otro problema: el resto del endpoint
        // sigue funcionando con los valores por defecto.
    }
}

// Convierte la fila de la base (con las columnas JSON todavía como texto)
// al formato que espera el sitio: id numérico, insignias/variantes como
// array u objeto reales, tinte como [colorA, colorB].
function product_row_to_json(array $row): array
{
    return [
        'id' => (int) $row['id'],
        'slug' => $row['slug'],
        'nombre' => $row['nombre'],
        'categoria' => $row['categoria'],
        'precio' => (int) $row['precio'],
        'imagen' => $row['imagen'],
        'insignias' => $row['insignias'] !== null ? json_decode($row['insignias'], true) : [],
        'variantes' => $row['variantes'] !== null ? json_decode($row['variantes'], true) : new stdClass(),
        'descripcion' => $row['descripcion'],
        'instrucciones' => $row['instrucciones'],
        'promo' => $row['promo'],
        // ?? por si la base todavía no tiene las columnas de promociones.
        'descuentoPorcentaje' => (int) ($row['descuento_porcentaje'] ?? 0),
        'tipoPromocion' => normalize_promo_type($row['tipo_promocion'] ?? 'NONE'),
        'descuentoSegundaUnidad' => (int) ($row['descuento_segunda_unidad'] ?? 0),
        'tinte' => ($row['tinte_inicio'] || $row['tinte_fin'])
            ? [$row['tinte_inicio'], $row['tinte_fin']]
            : null,
        'destacado' => (bool) $row['destacado'],
        'ordenDestacado' => $row['orden_destacado'] !== null ? (int) $row['orden_destacado'] : null,
        'activo' => (bool) $row['activo'],
        'sinStock' => (bool) $row['sin_stock'],
    ];
}

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
        'tinte' => ($row['tinte_inicio'] || $row['tinte_fin'])
            ? [$row['tinte_inicio'], $row['tinte_fin']]
            : null,
        'destacado' => (bool) $row['destacado'],
        'ordenDestacado' => $row['orden_destacado'] !== null ? (int) $row['orden_destacado'] : null,
        'activo' => (bool) $row['activo'],
        'sinStock' => (bool) $row['sin_stock'],
    ];
}

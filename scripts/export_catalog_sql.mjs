// Genera backend/seed_catalogo.sql a partir de src/data/catalog.js, para
// cargar el catálogo que hoy está escrito en el código dentro de MySQL.
//
// Uso:  node scripts/export_catalog_sql.mjs
//
// El SQL resultante se importa en phpMyAdmin DESPUÉS de schema.sql. Usa
// INSERT IGNORE con el slug como clave única: se puede importar más de
// una vez sin duplicar productos ni pisar cambios hechos desde el panel.
import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { CATALOG } from '../src/data/catalog.js';
import { normalizeVariantes } from '../src/utils/variants.js';

const OUT = fileURLToPath(new URL('../backend/seed_catalogo.sql', import.meta.url));

// Texto SQL: comillas simples duplicadas. Las barras invertidas también se
// duplican, que es lo que espera MySQL/MariaDB con su configuración normal.
function q(value) {
  if (value === null || value === undefined || value === '') return 'NULL';
  return "'" + String(value).replace(/\\/g, '\\\\').replace(/'/g, "''") + "'";
}

function int(value) {
  const n = Math.round(Number(value) || 0);
  return Number.isFinite(n) && n > 0 ? n : 0;
}

// Variantes al formato de la base: { grupo: [{ nombre, descripcion, precio }] }.
// Las "medidas" del formato viejo quedan como descripción de cada opción.
function variantesJson(product) {
  const out = {};
  for (const g of normalizeVariantes(product)) {
    out[g.grupo] = g.opciones.map((o) => ({
      nombre: o.nombre,
      descripcion: o.descripcion || '',
      precio: o.precio || null,
    }));
  }
  return JSON.stringify(out);
}

const columns = [
  'slug', 'sku', 'nombre', 'categoria', 'precio', 'imagen', 'insignias', 'variantes',
  'descripcion', 'instrucciones', 'promo', 'descuento_porcentaje', 'tipo_promocion',
  'descuento_segunda_unidad', 'tinte_inicio', 'tinte_fin', 'destacado', 'activo', 'sin_stock',
];

const seen = new Set();
const rows = CATALOG.map((p) => {
  if (seen.has(p.id)) throw new Error(`id repetido en catalog.js: ${p.id}`);
  seen.add(p.id);
  const tipo = ['2X1', '2DA_UNIDAD_DESCUENTO'].includes(p.tipoPromocion) ? p.tipoPromocion : 'NONE';
  const values = [
    q(p.id),
    q(p.sku),
    q(p.nombre),
    q(p.categoria),
    int(p.precio),
    q(p.imagen),
    q(JSON.stringify(p.insignias || [])),
    q(variantesJson(p)),
    q(p.descripcion),
    q(p.instrucciones),
    q(p.promo),
    Math.min(100, int(p.descuentoPorcentaje)),
    q(tipo),
    tipo === '2DA_UNIDAD_DESCUENTO' ? Math.min(100, int(p.descuentoSegundaUnidad)) : 0,
    q(p.tinte?.[0]),
    q(p.tinte?.[1]),
    p.destacado ? 1 : 0,
    p.activo === false ? 0 : 1,
    p.sinStock ? 1 : 0,
  ];
  return `INSERT IGNORE INTO products (${columns.join(', ')}) VALUES\n  (${values.join(', ')});`;
});

const sinPrecio = CATALOG.filter((p) => !int(p.precio)).length;

const header = `-- =====================================================================
-- Intenso Tandil - catálogo inicial (${CATALOG.length} productos)
-- =====================================================================
-- ARCHIVO GENERADO: no lo edites a mano. Sale de src/data/catalog.js con
--   node scripts/export_catalog_sql.mjs
--
-- Importalo en phpMyAdmin DESPUÉS de schema.sql (pestaña "Importar").
-- Se puede importar más de una vez: INSERT IGNORE saltea los productos
-- cuyo slug ya existe, así que no duplica ni pisa lo editado en el panel.
--
-- Las fotos apuntan a /products/..., que se suben junto con el sitio
-- (carpeta dist/products), no a backend/uploads.
${sinPrecio ? `--
-- OJO: ${sinPrecio} de ${CATALOG.length} productos están con precio 0 en catalog.js.
-- Se cargan igual; el precio real se completa después desde el panel.
` : ''}-- =====================================================================

SET NAMES utf8mb4;

`;

writeFileSync(OUT, header + rows.join('\n') + '\n');
console.log(`OK: ${CATALOG.length} productos -> backend/seed_catalogo.sql (${sinPrecio} con precio 0)`);

-- =====================================================================
-- Intenso Tandil - esquema completo de la base de datos
-- =====================================================================
-- Cómo usarlo: phpMyAdmin (panel Ferozo de DonWeb) > elegir la base del
-- proyecto en la columna izquierda > pestaña "Importar" > subir este
-- archivo > Continuar. (También sirve pegarlo en la pestaña "SQL".)
--
-- - Se puede importar más de una vez sin romper nada: usa
--   CREATE TABLE IF NOT EXISTS y no borra ni pisa datos.
-- - No lleva CREATE DATABASE ni USE: en hosting compartido la base ya
--   existe y se elige desde phpMyAdmin.
-- - Compatible con MySQL 5.6+ y MariaDB 10.0+. A propósito NO usa el tipo
--   JSON, CHECK ni columnas generadas: las listas/objetos se guardan como
--   texto JSON en LONGTEXT y los arma/valida el PHP (backend/lib/products.php).
-- - Si la base ya la habías creado con una versión anterior de este
--   archivo, corré además lo que haya en backend/migrations/.
-- =====================================================================

SET NAMES utf8mb4;

-- ---------------------------------------------------------------------
-- Usuarios que pueden entrar al panel (/#admin).
-- Se crean con backend/tools/create_admin.html, nunca a mano: la
-- contraseña se guarda hasheada (password_hash de PHP).
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS admin_users (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  email VARCHAR(190) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  failed_attempts INT UNSIGNED NOT NULL DEFAULT 0,
  locked_until DATETIME NULL DEFAULT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_admin_users_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- Sesiones abiertas del panel. Se guarda el hash (sha256) del token,
-- nunca el token en texto plano.
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS admin_sessions (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  admin_id INT UNSIGNED NOT NULL,
  token_hash CHAR(64) NOT NULL,
  expires_at DATETIME NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_admin_sessions_token_hash (token_hash),
  KEY idx_admin_sessions_admin_id (admin_id),
  KEY idx_admin_sessions_expires_at (expires_at),
  CONSTRAINT fk_admin_sessions_admin
    FOREIGN KEY (admin_id) REFERENCES admin_users (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- Un registro por intento de login (exitoso o no), para frenar fuerza
-- bruta por IP sin importar si el mail existe o no.
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS login_attempts (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  ip_address VARCHAR(64) NOT NULL,
  attempted_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_login_attempts_ip_time (ip_address, attempted_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- Productos. Columna de la base -> campo que usa el sitio (React):
--
--   id                        -> id (numérico)
--   slug                      -> slug (texto para URLs, se arma del nombre)
--   sku                       -> sku (código del proveedor, solo interno)
--   nombre, categoria         -> nombre, categoria (id de src/data/config.js)
--   precio                    -> precio (ARS, entero, sin centavos)
--   imagen                    -> imagen (foto principal; URL: /products/x.webp o /backend/uploads/x.webp)
--   imagenes                  -> imagenes (JSON: hasta 3 URLs; la primera es la principal.
--                                NULL = solo la de `imagen`)
--   insignias                 -> insignias  (JSON: ["Nuevo","Top Ventas"])
--   variantes                 -> variantes  (JSON, ver abajo)
--   descripcion, instrucciones-> descripcion, instrucciones
--   promo                     -> promo (etiqueta decorativa, NO cambia precios)
--   descuento_porcentaje      -> descuentoPorcentaje    (0 a 100)
--   tipo_promocion            -> tipoPromocion ('NONE' | '2X1' | '2DA_UNIDAD_DESCUENTO')
--   descuento_segunda_unidad  -> descuentoSegundaUnidad (0 a 100)
--   tinte_inicio, tinte_fin   -> tinte [colorA, colorB] (fondo si no hay foto)
--   destacado, orden_destacado-> destacado, ordenDestacado
--   activo                    -> activo   (0 = oculto en la tienda)
--   sin_stock                 -> sinStock (1 = se ve pero no se puede comprar)
--
-- variantes: grupos -> opciones; cada opción con nombre, descripción o
-- medida opcional y precio propio opcional (null = usa `precio`):
--   {"Talle":[{"nombre":"S","descripcion":"65x25 cm","precio":25000},
--             {"nombre":"M","descripcion":"80x30 cm","precio":null}]}
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS products (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  slug VARCHAR(190) NOT NULL,
  sku VARCHAR(60) NULL DEFAULT NULL,
  nombre VARCHAR(255) NOT NULL,
  categoria VARCHAR(100) NOT NULL,
  precio INT UNSIGNED NOT NULL DEFAULT 0,
  imagen VARCHAR(500) NULL DEFAULT NULL,
  imagenes LONGTEXT NULL,
  insignias LONGTEXT NULL,
  variantes LONGTEXT NULL,
  descripcion TEXT NULL,
  instrucciones TEXT NULL,
  promo VARCHAR(100) NULL DEFAULT NULL,
  descuento_porcentaje TINYINT UNSIGNED NOT NULL DEFAULT 0,
  tipo_promocion VARCHAR(50) NOT NULL DEFAULT 'NONE',
  descuento_segunda_unidad TINYINT UNSIGNED NOT NULL DEFAULT 0,
  tinte_inicio VARCHAR(20) NULL DEFAULT NULL,
  tinte_fin VARCHAR(20) NULL DEFAULT NULL,
  destacado TINYINT(1) UNSIGNED NOT NULL DEFAULT 0,
  orden_destacado INT UNSIGNED NULL DEFAULT NULL,
  activo TINYINT(1) UNSIGNED NOT NULL DEFAULT 1,
  sin_stock TINYINT(1) UNSIGNED NOT NULL DEFAULT 0,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_products_slug (slug),
  KEY idx_products_categoria (categoria),
  KEY idx_products_activo (activo),
  KEY idx_products_destacado (destacado, orden_destacado)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================================
-- SEED DE PRUEBA (opcional)
-- =====================================================================
-- Tres productos de muestra para comprobar que la importación y la tienda
-- funcionan. Para usarlo, seleccioná desde "INSERT" hasta el ";" final,
-- sacale los "-- " del principio de cada línea y ejecutalo en la pestaña
-- SQL. Los precios son de ejemplo: cambialos después desde el panel.
-- (INSERT IGNORE: si ya existen productos con ese slug, no los duplica.)
--
-- Para cargar el catálogo completo usá backend/seed_catalogo.sql en vez
-- de este bloque (no hace falta correr los dos).
-- ---------------------------------------------------------------------
-- INSERT IGNORE INTO products
--   (slug, sku, nombre, categoria, precio, imagen, insignias, variantes,
--    descripcion, instrucciones, promo,
--    descuento_porcentaje, tipo_promocion, descuento_segunda_unidad,
--    tinte_inicio, tinte_fin)
-- VALUES
--   ('mini-vibrador-luxury-negro', NULL, 'Mini Vibrador Luxury Negro',
--    'juguetes-vibradores', 25000, '/products/mini-vibrador-luxury-negro.webp',
--    '["Nuevo"]', '{}',
--    'Un mini vibrador de silicona suave, resistente al agua y recargable, con 7 modos de vibración para variar la intensidad a gusto.',
--    'Recargalo por USB antes del primer uso. Aplicá lubricante a base de agua y empezá en el modo más suave. Limpialo con agua y jabón neutro después de cada uso.',
--    NULL, 20, 'NONE', 0, '#DC015B', '#A80044'),
--   ('plug-anal-fucsia', NULL, 'Plug Anal de Silicona Fucsia',
--    'juguetes-anal-toys', 18000, '/products/plug-anal-fucsia-mediano.webp',
--    '["Nuevo"]',
--    '{"Tamaño":[{"nombre":"Mediano","descripcion":"","precio":null},{"nombre":"Grande","descripcion":"","precio":22000}]}',
--    'Un plug anal de silicona suave, con base curva para mayor comodidad. Disponible en dos tamaños.',
--    'Usalo siempre con abundante lubricante a base de agua. Introducilo de a poco, sin apurar. Limpialo con agua y jabón neutro después de cada uso.',
--    NULL, 0, '2DA_UNIDAD_DESCUENTO', 50, '#DC015B', '#A80044'),
--   ('anillo-vibrador-bala-recargable', NULL, 'Anillo Vibrador con Bala Recargable',
--    'juguetes-anillos', 15000, '/products/anillo-vibrador-bala-recargable.webp',
--    '["Nuevo"]', '{}',
--    'Un anillo de silicona suave con una bala vibradora extraíble que potencia el placer de los dos.',
--    'Colocá el anillo en la base y ajustá la bala vibradora a tu gusto. Usalo con lubricante a base de agua. Se recarga por USB.',
--    'Liquidación', 0, '2X1', 0, '#DC015B', '#A80044');

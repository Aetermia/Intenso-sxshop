-- Esquema de la base de datos de Intenso Tandil.
-- Correr esto una sola vez en phpMyAdmin (o el cliente MySQL que tenga DonWeb)
-- contra la base de datos vacía que crearon para el proyecto.

CREATE TABLE IF NOT EXISTS admin_users (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(190) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  failed_attempts INT UNSIGNED NOT NULL DEFAULT 0,
  locked_until DATETIME NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uq_admin_users_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS admin_sessions (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  admin_id INT UNSIGNED NOT NULL,
  token_hash CHAR(64) NOT NULL,
  expires_at DATETIME NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uq_admin_sessions_token_hash (token_hash),
  KEY idx_admin_sessions_admin_id (admin_id),
  CONSTRAINT fk_admin_sessions_admin
    FOREIGN KEY (admin_id) REFERENCES admin_users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Un registro por intento de login (exitoso o no), usado para frenar fuerza
-- bruta por IP sin importar si el mail existe o no.
CREATE TABLE IF NOT EXISTS login_attempts (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  ip_address VARCHAR(64) NOT NULL,
  attempted_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  KEY idx_login_attempts_ip_time (ip_address, attempted_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS products (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  slug VARCHAR(190) NOT NULL,
  nombre VARCHAR(255) NOT NULL,
  categoria VARCHAR(100) NOT NULL,
  precio INT UNSIGNED NOT NULL DEFAULT 0,
  imagen VARCHAR(500) NULL,
  -- insignias: lista simple de textos, ej: ["Top Ventas", "Envio Discreto"]
  insignias JSON NULL,
  -- variantes: objeto libre, ej: {"Color": ["Negro","Rojo"], "Tamaño": ["500ml","700ml"]}
  -- así cada producto define las opciones que necesita, sin tocar la base.
  variantes JSON NULL,
  descripcion TEXT NULL,
  instrucciones TEXT NULL,
  -- promo: texto libre decorativo (ej: "Liquidación"). NO afecta precios.
  promo VARCHAR(100) NULL,
  -- Descuentos reales (ver src/utils/pricing.js):
  --   descuento_porcentaje: % directo sobre el precio (0 a 100).
  --   tipo_promocion: 'NONE' | '2X1' | '2DA_UNIDAD_DESCUENTO'.
  --   descuento_segunda_unidad: % sobre la 2da unidad de cada par (solo con
  --   tipo_promocion = '2DA_UNIDAD_DESCUENTO').
  descuento_porcentaje INT NOT NULL DEFAULT 0,
  tipo_promocion VARCHAR(50) NOT NULL DEFAULT 'NONE',
  descuento_segunda_unidad INT NOT NULL DEFAULT 0,
  tinte_inicio VARCHAR(20) NULL,
  tinte_fin VARCHAR(20) NULL,
  destacado TINYINT(1) UNSIGNED NOT NULL DEFAULT 0,
  orden_destacado INT UNSIGNED NULL,
  activo TINYINT(1) UNSIGNED NOT NULL DEFAULT 1,
  sin_stock TINYINT(1) UNSIGNED NOT NULL DEFAULT 0,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uq_products_slug (slug),
  KEY idx_products_categoria (categoria),
  KEY idx_products_destacado (destacado, orden_destacado)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

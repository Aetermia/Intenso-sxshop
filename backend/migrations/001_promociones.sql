-- Migración: descuentos y promociones reales en productos.
--
-- Solo hace falta si la tabla `products` ya existía antes de este cambio
-- (las instalaciones nuevas ya traen las columnas desde schema.sql).
-- Correr UNA vez en phpMyAdmin > pestaña SQL. No borra ni modifica datos:
-- los productos existentes quedan con 0 / 'NONE' (sin promoción).
--
-- Nota: products.php también agrega estas columnas solo si faltan, así que
-- si el usuario de MySQL tiene permiso de ALTER, este paso es opcional.
-- Si alguna columna ya existe, MySQL avisa "Duplicate column name": se
-- puede ignorar.

ALTER TABLE products
  ADD COLUMN descuento_porcentaje INT NOT NULL DEFAULT 0 AFTER promo,
  ADD COLUMN tipo_promocion VARCHAR(50) NOT NULL DEFAULT 'NONE' AFTER descuento_porcentaje,
  ADD COLUMN descuento_segunda_unidad INT NOT NULL DEFAULT 0 AFTER tipo_promocion;

-- Migración: columna `sku` y columnas JSON guardadas como texto.
--
-- Solo hace falta si la tabla `products` ya existía de antes (las
-- instalaciones nuevas ya quedan bien con schema.sql).
-- Correr UNA vez en phpMyAdmin > pestaña SQL. No borra ni modifica datos.
--
-- Nota: products.php agrega `sku` solo si falta, así que el primer ALTER
-- es opcional si el usuario de MySQL tiene permiso de ALTER. Si avisa
-- "Duplicate column name 'sku'", ya estaba: seguí con el segundo.

ALTER TABLE products
  ADD COLUMN sku VARCHAR(60) NULL DEFAULT NULL AFTER slug;

-- Mismo contenido, pero como texto: evita depender del tipo JSON (que no
-- existe en MySQL 5.6 ni en MariaDB anteriores a 10.2).
ALTER TABLE products
  MODIFY insignias LONGTEXT NULL,
  MODIFY variantes LONGTEXT NULL;

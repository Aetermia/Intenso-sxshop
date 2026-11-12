-- Migración: hasta 3 fotos por producto (columna `imagenes`).
--
-- Solo hace falta si la tabla `products` ya existía de antes (las
-- instalaciones nuevas ya la traen desde schema.sql).
-- Correr UNA vez en phpMyAdmin > pestaña SQL. No borra ni modifica datos:
-- los productos existentes siguen mostrando su foto de siempre.
--
-- Nota: products.php agrega esta columna sola si falta, así que este paso
-- es opcional si el usuario de MySQL tiene permiso de ALTER. Si avisa
-- "Duplicate column name 'imagenes'", ya estaba.

ALTER TABLE products
  ADD COLUMN imagenes LONGTEXT NULL AFTER imagen;

-- Migración: las fotos del sitio (/products/...) pasaron de PNG a WEBP.
--
-- Solo hace falta si ya habías importado seed_catalogo.sql cuando las
-- fotos todavía eran .png (las instalaciones nuevas ya quedan bien).
-- Correr UNA vez en phpMyAdmin > pestaña SQL, después de subir el sitio
-- nuevo (dist/) con las fotos .webp. Si se corre de nuevo no hace nada.
--
-- No toca las fotos subidas desde el panel (/backend/uploads/...).

UPDATE products
SET imagen = CONCAT(LEFT(imagen, CHAR_LENGTH(imagen) - 4), '.webp')
WHERE imagen LIKE '/products/%.png';

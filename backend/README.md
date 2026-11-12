# Backend de Intenso Tandil

API en PHP + MySQL para que el panel de administración guarde los
productos de verdad en la base de datos, y para que la tienda los lea de
ahí. Pensado para subirse al hosting de DonWeb (panel Ferozo).

## Qué hace, en criollo

Es el "mesero" entre el panel de administración (la página web) y la base
de datos (donde se guardan los productos). El navegador nunca toca la base
de datos directo — todo pasa por acá, que se encarga de:

- Guardar la contraseña de forma segura (encriptada, nunca en texto plano)
- Dejar entrar solo a quien tenga mail + contraseña correctos
- Frenar a cualquiera que intente adivinar una contraseña probando muchas
  seguidas
- Guardar/leer/editar/borrar productos
- Recibir y guardar las fotos que se suban

## Puesta en marcha en DonWeb / Ferozo (una sola vez)

### 1. Crear la base de datos
En el panel Ferozo: **Bases de datos MySQL** > crear una base nueva y un
usuario con todos los permisos sobre ella. Anotá: servidor (host), nombre
de la base, usuario y contraseña; los vas a necesitar en el paso 3.

### 2. Importar las tablas (y el catálogo)
Entrá a **phpMyAdmin** desde Ferozo, elegí la base en la columna izquierda
y usá la pestaña **Importar**:

1. `schema.sql`: crea las 4 tablas (`admin_users`, `admin_sessions`,
   `login_attempts`, `products`). Se puede importar más de una vez sin
   romper nada.
2. `seed_catalogo.sql` (opcional, recomendado): carga los productos que
   hoy están en `src/data/catalog.js`. Tampoco duplica si se repite.
   Si solo querés probar con 3 productos, al final de `schema.sql` hay un
   bloque comentado para eso.

Funciona con MySQL 5.6+ y MariaDB 10.0+ (no usa el tipo `JSON` ni `CHECK`).

Si la base ya existía de una versión anterior de `schema.sql`, corré además
los archivos de `migrations/` en orden.

### 3. Configurar las claves
Hacé una copia de `config.example.php` y renombrala a `config.php` (mismo
lugar, carpeta `backend/`). Completá ahí:
- Los datos de conexión a MySQL del paso 1
- `allowed_origins`: la URL real del sitio (con y sin `www` si abre de las
  dos formas)
- `setup_token`: inventate una clave larga y random, de 16 caracteres o
  más (es para el paso 5; con el valor de ejemplo no deja crear admins)

**Importante:** `config.php` nunca se sube a GitHub (ya está en
`.gitignore`). Solo existe en el servidor.

### 4. Subir los archivos al hosting
Por FTP o el Administrador de Archivos de Ferozo, dentro de `public_html`:

- El **contenido** de `dist/` (lo que genera `npm run build`): `index.html`,
  `assets/`, `products/`, íconos.
- La carpeta `backend/` entera (con el `config.php` ya completado y los
  archivos `.htaccess`, que a veces quedan ocultos en el explorador).

Tiene que quedar `https://tu-dominio.com/` para la tienda y
`https://tu-dominio.com/backend/` para la API. La carpeta
`backend/uploads` necesita permiso de escritura (755).

Si el backend va a vivir en otra carpeta o dominio, definí `VITE_API_URL`
antes de compilar (ver `.env.example` en la raíz) y ajustá `uploads_url`
en `config.php`.

### 5. Crear el primer usuario admin
Desde el navegador, entrá a:

```
https://tu-dominio.com/backend/tools/create_admin.html
```

Completá el formulario (el setup token es el que pusiste en `config.php`,
en el paso 3) y tocá "Crear admin". Repetí este paso (cambiando el mail)
por cada persona que necesite entrar al panel.

**Después de crear a todos los admins que hagan falta, borrá la carpeta
`tools/` del servidor** (en el repositorio queda). Dejarla activa es un
riesgo: quien adivine el `setup_token` podría crear un usuario nuevo.

### 6. Probar que funciona
1. `https://tu-dominio.com/backend/api/products.php` tiene que mostrar
   `{"products":[...]}` (o `{"products":[]}` si no importaste el seed).
2. `https://tu-dominio.com/` tiene que mostrar la tienda con esos productos.
3. `https://tu-dominio.com/#admin`: entrá con el mail y la contraseña del
   paso 5, editá un precio y comprobá que cambia en la tienda.

Si algo falla, la API responde un mensaje claro (por ejemplo "usuario o
contraseña incorrectos" si están mal los datos de MySQL). El detalle
técnico queda en el log de errores de PHP del hosting, nunca en pantalla.

## Probarlo en tu compu

```
php -S localhost:8000        # desde la raíz del repo (necesita backend/config.php)
npm run dev                  # en otra terminal; /backend se reenvía al PHP
```

Sin el PHP levantado, `npm run dev` muestra el catálogo de ejemplo de
`catalog.js` para poder trabajar el diseño igual. El sitio compilado
(`npm run build`) no lo hace: siempre lee la base de datos.

## Los endpoints (para referencia)

| Método | Ruta | Qué hace | ¿Necesita login? |
|---|---|---|---|
| POST | `/api/login.php` | Inicia sesión, devuelve un token | No |
| POST | `/api/logout.php` | Cierra la sesión | Sí |
| GET | `/api/me.php` | Confirma si el token todavía es válido | Sí |
| GET | `/api/products.php` | Lista los productos activos | No |
| GET | `/api/products.php?all=1` | Lista TODOS (incluye inactivos) | Sí |
| GET | `/api/products.php?id=5` | Un producto puntual (si está activo) | No |
| POST | `/api/products.php` | Crear un producto | Sí |
| PUT | `/api/products.php?id=5` | Editar un producto | Sí |
| DELETE | `/api/products.php?id=5` | Borrar un producto | Sí |
| POST | `/api/upload.php` | Subir una foto (campo `imagen`) | Sí |

Para los que "necesitan login", el panel tiene que mandar el token que le
dio `/api/login.php` en cada pedido, en un header:
`Authorization: Bearer <token>`.

## Cómo se conecta con el sitio

Todo pasa por `src/services/api.js`:

- La tienda (`App.jsx` > `useCatalog`) lee `GET /api/products.php`.
- El panel (`/#admin`) inicia sesión con `/api/login.php` y crea, edita,
  congela y elimina productos contra `/api/products.php`; las fotos se
  suben con `/api/upload.php` y en el producto se guarda solo la dirección.

Editar y eliminar se mandan como `POST ...&_method=PUT|DELETE` (hay
hostings que bloquean PUT/DELETE; la API acepta las dos formas), y el token
viaja en `Authorization: Bearer` y también en `X-Auth-Token` (hay hostings
que no le pasan `Authorization` a PHP).

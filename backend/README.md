# Backend de Intenso Tandil

API en PHP + MySQL para que el panel de administración guarde los
productos de verdad (hoy vive en `catalog.js` y se pierde todo al cerrar
la pestaña). Pensado para subirse al hosting de DonWeb.

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

## Puesta en marcha (una sola vez)

### 1. Crear la base de datos en DonWeb
Desde el panel de DonWeb (cPanel), creá una base de datos MySQL nueva y un
usuario con permisos sobre ella. Anotá: host, nombre de la base, usuario y
contraseña — los vas a necesitar en el paso 3.

### 2. Cargar las tablas
Entrá a phpMyAdmin (está dentro del cPanel de DonWeb), elegí la base que
creaste, andá a la pestaña "SQL" y pegá todo el contenido del archivo
`schema.sql`. Ejecutar. Esto crea las tablas vacías, todavía sin productos.

### 3. Configurar las claves
Hacé una copia de `config.example.php` y renombrala a `config.php` (mismo
lugar, carpeta `backend/`). Completá ahí:
- Los datos de conexión a MySQL del paso 1
- `allowed_origins`: la URL real del sitio (y la de Vercel si la siguen
  usando)
- `setup_token`: inventate una clave larga y random (es para el paso 5)

**Importante:** `config.php` nunca se sube a GitHub (ya está en
`.gitignore`). Solo existe en el servidor.

### 4. Subir los archivos al hosting
Subí toda la carpeta `backend/` (con el `config.php` ya completado) a
DonWeb, vía FTP o el Administrador de Archivos del cPanel. Tiene que quedar
accesible en algo como `https://tu-dominio.com/backend/`.

### 5. Crear el primer usuario admin
Desde el navegador, entrá a:

```
https://tu-dominio.com/backend/tools/create_admin.html
```

Completá el formulario (el setup token es el que pusiste en `config.php`,
en el paso 3) y tocá "Crear admin". Repetí este paso (cambiando el mail)
por cada persona que necesite entrar al panel.

**Después de crear a todos los admins que hagan falta, borrá la carpeta
`tools/` entera del servidor.** Dejarla activa es un riesgo: quien sea que
adivine el `setup_token` podría crear un usuario nuevo.

### 6. Probar que funciona
Entrando a `https://tu-dominio.com/backend/api/products.php` desde el
navegador tendría que verse `{"products":[]}` (vacío, porque todavía no
cargamos ningún producto).

## Los endpoints (para referencia)

| Método | Ruta | Qué hace | ¿Necesita login? |
|---|---|---|---|
| POST | `/api/login.php` | Inicia sesión, devuelve un token | No |
| POST | `/api/logout.php` | Cierra la sesión | Sí |
| GET | `/api/me.php` | Confirma si el token todavía es válido | Sí |
| GET | `/api/products.php` | Lista los productos activos | No |
| GET | `/api/products.php?all=1` | Lista TODOS (incluye inactivos) | Sí |
| GET | `/api/products.php?id=5` | Un producto puntual | No |
| POST | `/api/products.php` | Crear un producto | Sí |
| PUT | `/api/products.php?id=5` | Editar un producto | Sí |
| DELETE | `/api/products.php?id=5` | Borrar un producto | Sí |
| POST | `/api/upload.php` | Subir una foto (campo `imagen`) | Sí |

Para los que "necesitan login", el panel tiene que mandar el token que le
dio `/api/login.php` en cada pedido, en un header:
`Authorization: Bearer <token>`.

## Lo que falta para que esto quede 100% andando

Este backend ya funciona de forma independiente (se puede probar con
Postman/Insomnia o `curl`), pero **el panel de React todavía no lo usa**:
hoy sigue guardando todo en la sesión del navegador, como siempre.
Conectar uno con el otro (que `AdminPanel.jsx` llame a esta API en vez de
guardar en memoria, y que la tienda cargue el catálogo desde acá en vez de
`catalog.js`) es el próximo paso, una vez que confirmen que la base de
datos y el login están andando bien en DonWeb.

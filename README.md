# Intenso Tandil — tienda online

Tienda online de Intenso Tandil: catálogo con descuentos y promociones
(2x1, 2da unidad con descuento), variantes con precio propio, carrito que
arma el pedido por WhatsApp y panel de administración (`/#admin`).

- **Frontend:** React 18 + Vite (carpeta `src/`).
- **Backend:** PHP 8 + MySQL/MariaDB (carpeta `backend/`), pensado para
  hosting compartido (DonWeb / Ferozo).

## Desarrollo

```
npm install
npm run dev                  # http://localhost:5173
php -S localhost:8000        # opcional: el backend (necesita backend/config.php)
```

Sin el backend levantado, `npm run dev` muestra el catálogo de ejemplo de
`src/data/catalog.js`. El sitio compilado siempre lee la base de datos.

## Publicar

```
npm run build
```

Se sube a `public_html`:
- el **contenido** de `dist/` (`index.html`, `assets/`, `products/`, íconos);
- la carpeta `backend/` (con su `config.php` y los `.htaccess`).

La puesta en marcha completa (base de datos, `config.php`, primer admin)
está en [`backend/README.md`](backend/README.md).

## Estructura de `src/`

```
src/
├── main.jsx, Root.jsx       arranque y ruteo por hash (#admin, #terminos)
├── App.jsx                  la tienda
├── AdminApp.jsx             el panel (login + AdminPanel)
├── components/              tienda: Header, ProductCard, ProductModal, CartDrawer...
│   └── admin/               panel: AdminGate, AdminPanel, ProductForm,
│                            VariantsEditor, ImagesField, CatalogList
├── context/CartContext.jsx  carrito (se guarda en el navegador)
├── hooks/                   useCatalog, useScrollDirection, useScrollLock,
│                            useFocusTrap, useDismiss, useToast
├── services/api.js          única capa que habla con el backend
├── utils/                   precios y promos, variantes, fotos, mensaje de WhatsApp
├── data/                    configuración de la tienda y catálogo de ejemplo
└── styles/                  estilos globales
```

## Scripts

- `scripts/export_catalog_sql.mjs`: regenera `backend/seed_catalogo.sql`
  desde `src/data/catalog.js`.

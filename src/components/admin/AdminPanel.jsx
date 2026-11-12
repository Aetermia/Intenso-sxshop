import React, { useEffect, useMemo, useRef, useState } from 'react';
import { CATEGORY_TINT, REAL_CATEGORIES } from '../../data/config.js';
import {
  createProduct,
  deleteProduct,
  fetchAllProducts,
  updateProduct,
  uploadImage,
} from '../../services/api.js';
import ProductCard from '../ProductCard.jsx';
import ProductModal from '../ProductModal.jsx';
import Logo from '../Logo.jsx';
import { PROMO_TYPES, formatARS } from '../../utils/pricing.js';
import { normalizeVariantes } from '../../utils/variants.js';
import './AdminPanel.css';

const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

function slugify(text) {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function emptyOption() {
  return { nombre: '', descripcion: '', precio: '' };
}

function emptyVariantGroup() {
  return { label: '', options: [emptyOption()] };
}

// Grupos del formulario -> objeto `variantes` que se guarda:
//   { Talle: [{ nombre: 'S', descripcion: '65x25 cm', precio: 25000 }, ...] }
// Precio vacío o 0 -> null (la opción hereda el precio base del producto).
function variantGroupsToVariantes(groups) {
  const variantes = {};
  groups.forEach((g) => {
    const label = g.label.trim();
    if (!label) return;
    const seen = new Set();
    const options = g.options
      .map((o) => {
        const precio = Math.round(Number(o.precio));
        return {
          nombre: o.nombre.trim(),
          descripcion: o.descripcion.trim(),
          precio: Number.isFinite(precio) && precio > 0 ? precio : null,
        };
      })
      .filter((o) => o.nombre && !seen.has(o.nombre) && seen.add(o.nombre));
    if (options.length) variantes[label] = options;
  });
  return variantes;
}

// Producto (formato viejo o nuevo) -> grupos editables del formulario.
// Las variantes viejas (textos planos + `medidas`) se convierten solas.
function productToVariantGroups(product) {
  return normalizeVariantes(product).map((g) => ({
    label: g.grupo,
    options: g.opciones.map((o) => ({
      nombre: o.nombre,
      descripcion: o.descripcion || '',
      precio: o.precio ? String(o.precio) : '',
    })),
  }));
}

function emptyForm() {
  return {
    nombre: '',
    categoria: REAL_CATEGORIES[0].id,
    // Variantes configurables: cada producto define las que necesite
    // (Color, Talle, Tamaño, Tipo de gema...), no hay una lista fija.
    variantGroups: [],
    precio: '',
    descripcion: '',
    instrucciones: '',
    // imagenPreview: lo que se muestra en el formulario (la foto actual del
    // producto o la vista previa de una recién elegida).
    // imagenFile: archivo nuevo, todavía sin subir (se sube al guardar).
    // imagenActual: la foto que el producto ya tenía guardada al abrirlo.
    imagenPreview: '',
    imagenNombre: '',
    imagenFile: null,
    imagenActual: '',
    promo: '',
    // Descuentos reales (ver src/utils/pricing.js). Independientes de
    // "promo", que es solo un texto decorativo.
    descuentoPorcentaje: '',
    tipoPromocion: PROMO_TYPES.NONE,
    descuentoSegundaUnidad: '',
  };
}

// Pasa los valores del formulario a enteros válidos (0 a 100).
function percentFromInput(value) {
  const n = Math.round(Number(value) || 0);
  return Math.min(100, Math.max(0, n));
}

export default function AdminPanel({ admin, onLogout, onSessionExpired }) {
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState('');
  const [imageError, setImageError] = useState('');
  const [preview, setPreview] = useState(null);
  const fileInputRef = useRef(null);
  const formRef = useRef(null);

  // Catálogo real: se lee y se guarda en la base de datos a través de la
  // API (src/services/api.js). Lo que se cambia acá queda publicado en la
  // tienda al instante.
  const [products, setProducts] = useState([]);
  const [loadStatus, setLoadStatus] = useState('loading'); // 'loading' | 'ready' | 'error'
  const [loadError, setLoadError] = useState('');
  const [saving, setSaving] = useState(false);
  const [busyId, setBusyId] = useState(null); // producto con una acción en curso
  const [editingOriginalId, setEditingOriginalId] = useState(null);
  const [catalogSearch, setCatalogSearch] = useState('');

  // Si el servidor rechaza el token (sesión vencida) se vuelve al login;
  // cualquier otro error devuelve su mensaje para mostrarlo.
  const apiErrorMessage = (err) => {
    if (err?.status === 401) {
      onSessionExpired?.();
      return 'La sesión venció. Ingresá de nuevo.';
    }
    return err?.message || 'Ocurrió un error inesperado.';
  };

  const loadProducts = async () => {
    setLoadStatus('loading');
    try {
      setProducts(await fetchAllProducts());
      setLoadStatus('ready');
    } catch (err) {
      setLoadError(apiErrorMessage(err));
      setLoadStatus('error');
    }
  };

  useEffect(() => {
    loadProducts();
    // Solo al montar el panel.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Menú "Acciones" de cada producto del catálogo: solo uno abierto a la vez,
  // para no mostrar los 5 botones de siempre en todas las tarjetas (con 100
  // productos se vuelve ilegible).
  const [openActionsFor, setOpenActionsFor] = useState(null);
  const actionsMenuRef = useRef(null);

  useEffect(() => {
    if (!openActionsFor) return undefined;
    const onClickOutside = (e) => {
      if (actionsMenuRef.current && !actionsMenuRef.current.contains(e.target)) setOpenActionsFor(null);
    };
    const onKeyDown = (e) => {
      if (e.key === 'Escape') setOpenActionsFor(null);
    };
    document.addEventListener('mousedown', onClickOutside);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('mousedown', onClickOutside);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [openActionsFor]);

  // Aviso temporal: aparece unos segundos y se va solo.
  const [toast, setToast] = useState(null);
  const showToast = (msg) => setToast({ msg, id: Date.now() });

  useEffect(() => {
    if (!toast) return undefined;
    const t = setTimeout(() => setToast(null), 2600);
    return () => clearTimeout(t);
  }, [toast]);

  const existingProducts = products;
  const filteredExistingProducts = useMemo(() => {
    const q = catalogSearch.trim().toLowerCase();
    if (!q) return existingProducts;
    return existingProducts.filter((p) => p.nombre.toLowerCase().includes(q));
  }, [existingProducts, catalogSearch]);
  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));


  const addVariantGroup = () => {
    setForm((f) => ({ ...f, variantGroups: [...f.variantGroups, emptyVariantGroup()] }));
  };

  const updateVariantLabel = (index) => (e) => {
    const value = e.target.value;
    setForm((f) => ({
      ...f,
      variantGroups: f.variantGroups.map((g, i) => (i === index ? { ...g, label: value } : g)),
    }));
  };

  const removeVariantGroup = (index) => {
    setForm((f) => ({ ...f, variantGroups: f.variantGroups.filter((_, i) => i !== index) }));
  };

  const mapGroupOptions = (groupIndex, fn) => {
    setForm((f) => ({
      ...f,
      variantGroups: f.variantGroups.map((g, i) => (i === groupIndex ? { ...g, options: fn(g.options) } : g)),
    }));
  };

  const addVariantOption = (groupIndex) => mapGroupOptions(groupIndex, (opts) => [...opts, emptyOption()]);

  const updateVariantOption = (groupIndex, optIndex, field) => (e) => {
    const value = e.target.value;
    mapGroupOptions(groupIndex, (opts) => opts.map((o, j) => (j === optIndex ? { ...o, [field]: value } : o)));
  };

  const removeVariantOption = (groupIndex, optIndex) =>
    mapGroupOptions(groupIndex, (opts) => opts.filter((_, j) => j !== optIndex));

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setImageError('Subí un archivo de imagen (JPG, PNG, WEBP...).');
      e.target.value = '';
      return;
    }
    if (file.size > MAX_IMAGE_BYTES) {
      setImageError('La imagen pesa mucho. Probá con una de menos de 5 MB.');
      e.target.value = '';
      return;
    }
    setImageError('');
    const reader = new FileReader();
    reader.onload = () => {
      setForm((f) => ({ ...f, imagenPreview: reader.result, imagenNombre: file.name, imagenFile: file }));
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setForm((f) => ({ ...f, imagenPreview: '', imagenNombre: '', imagenFile: null }));
    setImageError('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const previewProduct = useMemo(() => {
    const variantes = variantGroupsToVariantes(form.variantGroups);

    return {
      id: slugify(form.nombre) || 'nuevo-producto',
      nombre: form.nombre.trim() || 'Nombre del producto',
      categoria: form.categoria,
      precio: Number(form.precio) || 0,
      // Al editar, la vista previa muestra las insignias que ya tiene.
      insignias: products.find((p) => p.id === editingOriginalId)?.insignias || [],
      promo: form.promo.trim() || undefined,
      descuentoPorcentaje: percentFromInput(form.descuentoPorcentaje),
      tipoPromocion: form.tipoPromocion,
      descuentoSegundaUnidad:
        form.tipoPromocion === PROMO_TYPES.SEGUNDA_UNIDAD ? percentFromInput(form.descuentoSegundaUnidad) : 0,
      tinte: CATEGORY_TINT[form.categoria] || CATEGORY_TINT.juguetes,
      descripcion: form.descripcion.trim() || 'La descripción que cargues va a aparecer acá.',
      instrucciones: form.instrucciones.trim(),
      variantes,
      imagen: form.imagenPreview || undefined,
    };
  }, [form, products, editingOriginalId]);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (saving) return;
    if (!form.nombre.trim()) return setError('Ponele un nombre al producto.');
    if (!form.precio || Number(form.precio) <= 0) return setError('Cargá un precio válido.');
    if (!form.descripcion.trim()) return setError('Escribí una descripción.');
    const pct = Number(form.descuentoPorcentaje || 0);
    if (!Number.isFinite(pct) || pct < 0 || pct > 100) {
      return setError('El descuento directo tiene que estar entre 0 y 100.');
    }
    for (const g of form.variantGroups) {
      const filled = g.options.filter((o) => o.nombre.trim() || o.descripcion.trim() || String(o.precio).trim());
      if (!g.label.trim() && filled.length) {
        return setError('Ponele nombre a cada grupo de variantes (ej: Talle, Color).');
      }
      if (filled.some((o) => !o.nombre.trim())) {
        return setError(`Cada opción de "${g.label.trim() || 'la variante'}" necesita un nombre.`);
      }
      if (filled.some((o) => String(o.precio).trim() && !(Number(o.precio) >= 0))) {
        return setError(`Revisá los precios de "${g.label.trim()}": tienen que ser números positivos.`);
      }
      const names = filled.map((o) => o.nombre.trim().toLowerCase());
      if (new Set(names).size !== names.length) {
        return setError(`Hay opciones repetidas en "${g.label.trim()}".`);
      }
    }
    if (form.tipoPromocion === PROMO_TYPES.SEGUNDA_UNIDAD) {
      const pct2 = Number(form.descuentoSegundaUnidad || 0);
      if (!Number.isFinite(pct2) || pct2 <= 0 || pct2 > 100) {
        return setError('Indicá el descuento de la 2da unidad (entre 1 y 100).');
      }
    }
    setError('');

    // Lo que se manda a la API (mismos nombres que devuelve products.php).
    // Insignias y stock no se tocan desde este formulario: en una edición
    // el servidor conserva lo que el producto ya tenía.
    const payload = {
      nombre: form.nombre.trim(),
      categoria: form.categoria,
      precio: Math.round(Number(form.precio)),
      descripcion: form.descripcion.trim(),
      instrucciones: form.instrucciones.trim(),
      promo: form.promo.trim(),
      descuentoPorcentaje: previewProduct.descuentoPorcentaje,
      tipoPromocion: previewProduct.tipoPromocion,
      descuentoSegundaUnidad: previewProduct.descuentoSegundaUnidad,
      variantes: previewProduct.variantes,
      tinte: previewProduct.tinte,
    };

    setSaving(true);
    try {
      // La foto se sube primero y en el producto se guarda solo su dirección.
      if (form.imagenFile) {
        payload.imagen = await uploadImage(form.imagenFile);
      } else if (!form.imagenPreview) {
        payload.imagen = ''; // sin foto (o se quitó la que tenía)
      }
      // Si no se tocó la foto, no se manda `imagen`: queda la que estaba.

      if (editingOriginalId) {
        const saved = await updateProduct(editingOriginalId, payload);
        setProducts((list) => list.map((p) => (p.id === saved.id ? saved : p)));
        setEditingOriginalId(null);
        showToast('Producto actualizado');
      } else {
        const saved = await createProduct(payload);
        setProducts((list) => [...list, saved]);
        showToast('Producto publicado');
      }
      setForm(emptyForm());
      if (fileInputRef.current) fileInputRef.current.value = '';
    } catch (err) {
      setError(apiErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  const handleEditExisting = (product) => {
    setForm({
      nombre: product.nombre,
      categoria: product.categoria,
      variantGroups: productToVariantGroups(product),
      precio: String(product.precio),
      descripcion: product.descripcion,
      instrucciones: product.instrucciones || '',
      imagenPreview: product.imagen || '',
      imagenNombre: product.imagen ? 'Imagen actual' : '',
      imagenFile: null,
      imagenActual: product.imagen || '',
      promo: product.promo || '',
      descuentoPorcentaje: product.descuentoPorcentaje ? String(product.descuentoPorcentaje) : '',
      tipoPromocion: Object.values(PROMO_TYPES).includes(product.tipoPromocion)
        ? product.tipoPromocion
        : PROMO_TYPES.NONE,
      descuentoSegundaUnidad: product.descuentoSegundaUnidad ? String(product.descuentoSegundaUnidad) : '',
    });
    setEditingOriginalId(product.id);
    setError('');
    if (fileInputRef.current) fileInputRef.current.value = '';
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleCancelEdit = () => {
    setEditingOriginalId(null);
    setForm(emptyForm());
    setError('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleDeleteExisting = async (product) => {
    if (busyId) return;
    const ok = window.confirm(
      `¿Eliminar "${product.nombre}"?\n\nSe borra de la tienda y no se puede deshacer. ` +
      'Si solo querés que no se pueda comprar por ahora, usá "Congelar (sin stock)".'
    );
    if (!ok) return;
    setBusyId(product.id);
    try {
      await deleteProduct(product.id);
      if (editingOriginalId === product.id) handleCancelEdit();
      setProducts((list) => list.filter((p) => p.id !== product.id));
      showToast('Producto eliminado');
    } catch (err) {
      showToast(apiErrorMessage(err));
    } finally {
      setBusyId(null);
    }
  };

  const handleToggleStock = async (product) => {
    if (busyId) return;
    setBusyId(product.id);
    try {
      // Edición parcial: solo cambia el stock, el resto queda como está.
      const saved = await updateProduct(product.id, { sinStock: !product.sinStock });
      setProducts((list) => list.map((p) => (p.id === saved.id ? saved : p)));
      showToast(saved.sinStock ? 'Producto congelado (sin stock)' : 'Stock reactivado');
    } catch (err) {
      showToast(apiErrorMessage(err));
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="admin">
      <header className="admin__header">
        <div className="container admin__header-row">
          <Logo size="sm" />
          <h1>Panel de administración</h1>
          <div className="admin__header-actions">
            <button
              type="button"
              className="admin__back"
              onClick={() => { window.location.hash = ''; }}
            >
              <span className="admin__back-icon">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m12 19-7-7 7-7" />
                  <path d="M19 12H5" />
                </svg>
              </span>
              Volver a la tienda
            </button>
            <button
              type="button"
              className="admin__back"
              onClick={onLogout}
              title={admin?.email ? `Sesión de ${admin.email}` : undefined}
            >
              Cerrar sesión
            </button>
          </div>
        </div>
      </header>

      <main className="container admin__layout">
        <form className="admin__form" onSubmit={handleAdd} ref={formRef}>
          <h2>{editingOriginalId ? 'Editar producto' : 'Nuevo producto'}</h2>
          {editingOriginalId && (
            <p className="admin__edit-banner">
              Editando <strong>{products.find((p) => p.id === editingOriginalId)?.nombre}</strong>.{' '}
              <button type="button" onClick={handleCancelEdit}>Cancelar</button>
            </p>
          )}

          <label className="admin__field">
            <span>Nombre</span>
            <input type="text" value={form.nombre} onChange={set('nombre')} placeholder="Ej: Vibrador Punto G Curvo" />
          </label>

          <label className="admin__field">
            <span>Filtro (categoría)</span>
            <select value={form.categoria} onChange={set('categoria')}>
              {REAL_CATEGORIES.map((c) =>
                c.subcategories ? (
                  <optgroup key={c.id} label={c.label}>
                    <option value={c.id}>Ver todo en {c.label}</option>
                    {c.subcategories.map((s) => (
                      <option key={s.id} value={s.id}>{s.label}</option>
                    ))}
                  </optgroup>
                ) : (
                  <option key={c.id} value={c.id}>{c.label}</option>
                )
              )}
            </select>
          </label>

          <div className="admin__field">
            <span>Variantes (opcional)</span>
            <p className="admin__field-note">
              Creá un grupo por cada tipo de variante (Talle, Color, Tamaño...) y cargá sus
              opciones. Cada opción puede tener una descripción o medida y un precio propio; si
              dejás el precio vacío, usa el precio base del producto. Dejalo vacío si no tiene.
            </p>
            {form.variantGroups.map((g, i) => (
              <div className="admin__variant-group" key={i}>
                <div className="admin__variant-row">
                  <input
                    type="text"
                    value={g.label}
                    onChange={updateVariantLabel(i)}
                    placeholder="Grupo (ej: Talle, Color)"
                    aria-label={`Nombre del grupo de variantes ${i + 1}`}
                  />
                  <button
                    type="button"
                    className="admin__variant-remove"
                    onClick={() => removeVariantGroup(i)}
                    aria-label={`Eliminar el grupo ${g.label || i + 1}`}
                    title="Eliminar grupo"
                  >
                    ×
                  </button>
                </div>
                <div className="admin__variant-options">
                  <div className="admin__variant-option admin__variant-option--head" aria-hidden="true">
                    <span>Opción</span>
                    <span>Descripción / medida</span>
                    <span>Precio</span>
                    <span />
                  </div>
                  {g.options.map((o, j) => (
                    <div className="admin__variant-option" key={j}>
                      <input
                        type="text"
                        value={o.nombre}
                        onChange={updateVariantOption(i, j, 'nombre')}
                        placeholder="Ej: S, Rojo"
                        aria-label={`Nombre de la opción ${j + 1} de ${g.label || `el grupo ${i + 1}`}`}
                      />
                      <input
                        type="text"
                        value={o.descripcion}
                        onChange={updateVariantOption(i, j, 'descripcion')}
                        placeholder="Opcional (ej: 65x25 cm)"
                        aria-label={`Descripción de la opción ${j + 1} de ${g.label || `el grupo ${i + 1}`}`}
                      />
                      <input
                        type="number"
                        min="0"
                        step="1"
                        value={o.precio}
                        onChange={updateVariantOption(i, j, 'precio')}
                        placeholder={form.precio ? formatARS(form.precio) : 'Precio base'}
                        aria-label={`Precio de la opción ${j + 1} de ${g.label || `el grupo ${i + 1}`}`}
                      />
                      <button
                        type="button"
                        className="admin__variant-remove admin__variant-remove--sm"
                        onClick={() => removeVariantOption(i, j)}
                        aria-label={`Eliminar la opción ${o.nombre || j + 1}`}
                        title="Eliminar opción"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                  <button type="button" className="admin__variant-option-add" onClick={() => addVariantOption(i)}>
                    + Agregar opción
                  </button>
                </div>
              </div>
            ))}
            <button type="button" className="admin__variant-add" onClick={addVariantGroup}>
              + Agregar grupo de variantes
            </button>
          </div>

          <div className="admin__field">
            <span>Imagen del producto (opcional)</span>
            {form.imagenPreview ? (
              <div className="admin__image-preview">
                <img src={form.imagenPreview} alt="Vista previa de la imagen" />
                <div className="admin__image-preview-info">
                  <span>{form.imagenNombre}</span>
                  <button type="button" onClick={handleRemoveImage}>Quitar</button>
                </div>
              </div>
            ) : (
              <label className="admin__image-drop">
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  ref={fileInputRef}
                  onChange={handleImageChange}
                />
                <span>Subir foto (JPG, PNG o WEBP)</span>
              </label>
            )}
            {imageError && <p className="admin__error">{imageError}</p>}
            <p className="admin__field-note">
              JPG, PNG o WEBP de hasta 5 MB. Al guardar el producto la foto se sube al servidor,
              que la achica y la comprime sola para que la tienda cargue rápido.
            </p>
          </div>

          <label className="admin__field">
            <span>Precio (ARS)</span>
            <input type="number" min="0" value={form.precio} onChange={set('precio')} placeholder="25000" />
          </label>

          <label className="admin__field">
            <span>Descuento directo (%)</span>
            <input
              type="number"
              min="0"
              max="100"
              step="1"
              value={form.descuentoPorcentaje}
              onChange={set('descuentoPorcentaje')}
              placeholder="0"
            />
            <span className="admin__field-note">Baja el precio de verdad: en la tienda se ve el precio original tachado y el nuevo destacado, y el carrito cobra el precio con descuento. Dejalo en 0 si no tiene.</span>
          </label>

          <label className="admin__field">
            <span>Tipo de promoción</span>
            <select value={form.tipoPromocion} onChange={set('tipoPromocion')}>
              <option value={PROMO_TYPES.NONE}>Sin promoción</option>
              <option value={PROMO_TYPES.DOS_POR_UNO}>2x1</option>
              <option value={PROMO_TYPES.SEGUNDA_UNIDAD}>2da unidad con descuento</option>
            </select>
            <span className="admin__field-note">Se aplica en el carrito cuando el cliente lleva 2 o más unidades del mismo producto. Si también hay descuento directo, la promo se calcula sobre el precio ya rebajado.</span>
          </label>

          {form.tipoPromocion === PROMO_TYPES.SEGUNDA_UNIDAD && (
            <label className="admin__field">
              <span>Descuento en 2da unidad (%)</span>
              <input
                type="number"
                min="1"
                max="100"
                step="1"
                value={form.descuentoSegundaUnidad}
                onChange={set('descuentoSegundaUnidad')}
                placeholder="50"
              />
            </label>
          )}

          <label className="admin__field">
            <span>Etiqueta de promo (texto libre, opcional)</span>
            <input type="text" value={form.promo} onChange={set('promo')} placeholder="Ej: Liquidación, Edición limitada" />
            <span className="admin__field-note">Solo decorativa: no cambia el precio. Para descuentos reales usá los campos de arriba (sus insignias, como "30% OFF" o "2x1", se agregan solas).</span>
          </label>

          <label className="admin__field">
            <span>Descripción</span>
            <textarea rows="4" value={form.descripcion} onChange={set('descripcion')} placeholder="Descripción del producto..." />
          </label>

          <label className="admin__field">
            <span>Cómo usarlo (opcional)</span>
            <textarea rows="3" value={form.instrucciones} onChange={set('instrucciones')} placeholder="Instrucciones de uso y cuidado..." />
          </label>

          {error && <p className="admin__error">{error}</p>}

          <button type="submit" className="admin__submit" disabled={saving}>
            {saving ? 'Guardando...' : editingOriginalId ? 'Guardar cambios' : 'Publicar producto'}
          </button>
        </form>

        <aside className="admin__preview">
          <h2>Vista previa</h2>
          <div className="admin__preview-card">
            <ProductCard product={previewProduct} onOpen={setPreview} />
          </div>
          <p className="admin__preview-hint">Así se va a ver la tarjeta en el catálogo. Tocá "Ver detalle" para previsualizar la ficha completa.</p>
        </aside>
      </main>

      <section className="container admin__drafts">
        <div className="admin__drafts-head">
          <h2>
            Catálogo actual ({filteredExistingProducts.length}
            {catalogSearch.trim() ? ` de ${existingProducts.length}` : ''})
          </h2>
        </div>
        <p className="admin__drafts-note">
          Esto es lo que está publicado en la tienda. "Editar", "Congelar" y "Eliminar" se
          guardan en la base de datos y se ven en el sitio al instante.
        </p>
        <div className="admin__catalog-search">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
            <circle cx="11" cy="11" r="7" />
            <path d="m21 21-4.3-4.3" />
          </svg>
          <input
            type="search"
            value={catalogSearch}
            onChange={(e) => setCatalogSearch(e.target.value)}
            placeholder="Buscar un producto del catálogo para editarlo, congelarlo o eliminarlo..."
            aria-label="Buscar producto en el catálogo"
          />
        </div>
        {loadStatus === 'loading' && (
          <p className="admin__drafts-empty" role="status">Cargando el catálogo...</p>
        )}
        {loadStatus === 'error' && (
          <p className="admin__error" role="alert">
            {loadError}{' '}
            <button type="button" className="admin__draft-remove" onClick={loadProducts}>Reintentar</button>
          </p>
        )}
        {loadStatus === 'ready' && existingProducts.length === 0 && (
          <p className="admin__drafts-empty">
            Todavía no hay productos cargados. Usá el formulario de arriba para publicar el primero.
          </p>
        )}
        {catalogSearch.trim() && existingProducts.length > 0 && filteredExistingProducts.length === 0 && (
          <p className="admin__drafts-empty">No encontramos ningún producto con ese nombre.</p>
        )}
        <div className="grid admin__drafts-grid">
          {filteredExistingProducts.map((p) => (
            <div className="admin__draft" key={p.id}>
              <ProductCard
                product={p}
                onOpen={setPreview}
              />
              <div
                className="admin__actions"
                ref={p.id === openActionsFor ? actionsMenuRef : null}
              >
                <button
                  type="button"
                  className="admin__actions-toggle"
                  aria-haspopup="true"
                  aria-expanded={openActionsFor === p.id}
                  disabled={busyId === p.id}
                  onClick={() => setOpenActionsFor(openActionsFor === p.id ? null : p.id)}
                >
                  {busyId === p.id ? 'Guardando...' : 'Acciones'}
                  <svg
                    className="admin__actions-chevron"
                    viewBox="0 0 24 24"
                    width="14"
                    height="14"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="m6 9 6 6 6-6" />
                  </svg>
                </button>
                {openActionsFor === p.id && (
                  <div className="admin__actions-menu" role="menu">
                    <button
                      type="button"
                      role="menuitem"
                      onClick={() => { setOpenActionsFor(null); handleEditExisting(p); }}
                    >
                      Editar
                    </button>
                    <button
                      type="button"
                      role="menuitem"
                      onClick={() => { setOpenActionsFor(null); handleToggleStock(p); }}
                    >
                      {p.sinStock ? 'Reactivar stock' : 'Congelar (sin stock)'}
                    </button>
                    <button
                      type="button"
                      role="menuitem"
                      className="admin__actions-menu-remove"
                      onClick={() => { setOpenActionsFor(null); handleDeleteExisting(p); }}
                    >
                      Eliminar
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

      </section>

      {preview && <ProductModal product={preview} onClose={() => setPreview(null)} />}

      {toast && (
        <div className="admin__toast" role="status" aria-live="polite">
          {toast.msg}
        </div>
      )}
    </div>
  );
}

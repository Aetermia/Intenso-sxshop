import React, { useEffect, useMemo, useRef, useState } from 'react';
import { REAL_CATEGORIES } from '../../data/config.js';
import { CATALOG, CATEGORY_TINT } from '../../data/catalog.js';
import ProductCard from '../ProductCard.jsx';
import ProductModal from '../ProductModal.jsx';
import Logo from '../Logo.jsx';
import { PROMO_TYPES } from '../../utils/pricing.js';
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

function splitList(text) {
  return text
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
}

// "Mediano: 9 x 3 cm; Grande: 11 x 3.5 cm" -> { Mediano: '9 x 3 cm', Grande: '11 x 3.5 cm' }
function parseMedidas(text) {
  const out = {};
  text.split(';').forEach((chunk) => {
    const idx = chunk.indexOf(':');
    if (idx === -1) return;
    const opcion = chunk.slice(0, idx).trim();
    const medida = chunk.slice(idx + 1).trim();
    if (opcion && medida) out[opcion] = medida;
  });
  return out;
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
    imagenPreview: '',
    imagenNombre: '',
    promo: '',
    // Descuentos reales (ver src/utils/pricing.js). Independientes de
    // "promo", que es solo un texto decorativo.
    descuentoPorcentaje: '',
    tipoPromocion: PROMO_TYPES.NONE,
    descuentoSegundaUnidad: '',
    activo: true,
  };
}

// Pasa los valores del formulario a enteros válidos (0 a 100).
function percentFromInput(value) {
  const n = Math.round(Number(value) || 0);
  return Math.min(100, Math.max(0, n));
}

async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

function formatDeleteNote(product) {
  return [
    `// Eliminar de src/data/catalog.js:`,
    `// borrá el objeto completo con id: '${product.id}' (${product.nombre}).`,
  ].join('\n');
}

export default function AdminPanel() {
  const [form, setForm] = useState(emptyForm);
  const [drafts, setDrafts] = useState([]);
  const [error, setError] = useState('');
  const [imageError, setImageError] = useState('');
  const [copiedId, setCopiedId] = useState('');
  const [preview, setPreview] = useState(null);
  const fileInputRef = useRef(null);
  const formRef = useRef(null);

  // CRUD sobre el catálogo existente: todavía no hay base de datos, así que
  // los cambios quedan solo en esta sesión del panel. Cuando conectemos
  // Supabase esto va a guardar directo.
  const [editingOriginalId, setEditingOriginalId] = useState(null);
  const [existingEdits, setExistingEdits] = useState({});
  const [deletedIds, setDeletedIds] = useState(() => new Set());
  const [catalogSearch, setCatalogSearch] = useState('');

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

  const existingProducts = useMemo(
    () => CATALOG.filter((p) => !deletedIds.has(p.id)).map((p) => existingEdits[p.id] || p),
    [existingEdits, deletedIds]
  );
  const filteredExistingProducts = useMemo(() => {
    const q = catalogSearch.trim().toLowerCase();
    if (!q) return existingProducts;
    return existingProducts.filter((p) => p.nombre.toLowerCase().includes(q));
  }, [existingProducts, catalogSearch]);
  const pendingDeletes = useMemo(
    () => CATALOG.filter((p) => deletedIds.has(p.id)),
    [deletedIds]
  );
  const inactiveCount = useMemo(
    () => existingProducts.filter((p) => p.activo === false).length,
    [existingProducts]
  );

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const setCheck = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.checked }));

  const addVariantGroup = () => {
    setForm((f) => ({ ...f, variantGroups: [...f.variantGroups, { label: '', values: '', medidas: '' }] }));
  };

  const updateVariantGroup = (index, field) => (e) => {
    const value = e.target.value;
    setForm((f) => ({
      ...f,
      variantGroups: f.variantGroups.map((g, i) => (i === index ? { ...g, [field]: value } : g)),
    }));
  };

  const removeVariantGroup = (index) => {
    setForm((f) => ({ ...f, variantGroups: f.variantGroups.filter((_, i) => i !== index) }));
  };

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
      setForm((f) => ({ ...f, imagenPreview: reader.result, imagenNombre: file.name }));
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setForm((f) => ({ ...f, imagenPreview: '', imagenNombre: '' }));
    setImageError('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const previewProduct = useMemo(() => {
    const variantes = {};
    const medidas = {};
    form.variantGroups.forEach((g) => {
      const label = g.label.trim();
      const values = splitList(g.values);
      if (label && values.length) variantes[label] = values;
      if (label && g.medidas?.trim()) {
        const porOpcion = parseMedidas(g.medidas);
        if (Object.keys(porOpcion).length) medidas[label] = porOpcion;
      }
    });

    return {
      id: slugify(form.nombre) || 'nuevo-producto',
      nombre: form.nombre.trim() || 'Nombre del producto',
      categoria: form.categoria,
      precio: Number(form.precio) || 0,
      insignias: [],
      promo: form.promo.trim() || undefined,
      descuentoPorcentaje: percentFromInput(form.descuentoPorcentaje),
      tipoPromocion: form.tipoPromocion,
      descuentoSegundaUnidad:
        form.tipoPromocion === PROMO_TYPES.SEGUNDA_UNIDAD ? percentFromInput(form.descuentoSegundaUnidad) : 0,
      activo: form.activo,
      tinte: CATEGORY_TINT[form.categoria] || CATEGORY_TINT.juguetes,
      descripcion: form.descripcion.trim() || 'La descripción que cargues va a aparecer acá.',
      instrucciones: form.instrucciones.trim(),
      variantes,
      medidas: Object.keys(medidas).length ? medidas : undefined,
      imagen: form.imagenPreview || undefined,
      imagenNombre: form.imagenNombre || undefined,
    };
  }, [form]);

  const handleAdd = (e) => {
    e.preventDefault();
    if (!form.nombre.trim()) return setError('Ponele un nombre al producto.');
    if (!form.precio || Number(form.precio) <= 0) return setError('Cargá un precio válido.');
    if (!form.descripcion.trim()) return setError('Escribí una descripción.');
    const pct = Number(form.descuentoPorcentaje || 0);
    if (!Number.isFinite(pct) || pct < 0 || pct > 100) {
      return setError('El descuento directo tiene que estar entre 0 y 100.');
    }
    if (form.tipoPromocion === PROMO_TYPES.SEGUNDA_UNIDAD) {
      const pct2 = Number(form.descuentoSegundaUnidad || 0);
      if (!Number.isFinite(pct2) || pct2 <= 0 || pct2 > 100) {
        return setError('Indicá el descuento de la 2da unidad (entre 1 y 100).');
      }
    }
    setError('');
    if (editingOriginalId) {
      const base = existingProducts.find((p) => p.id === editingOriginalId) || {};
      setExistingEdits((e2) => ({
        ...e2,
        // Preservamos lo que el formulario no edita (insignias, stock...)
        [editingOriginalId]: {
          ...base,
          ...previewProduct,
          id: editingOriginalId,
          insignias: base.insignias || [],
        },
      }));
      setEditingOriginalId(null);
      showToast('Producto actualizado');
    } else {
      setDrafts((d) => [...d, previewProduct]);
      showToast('Producto agregado a esta sesión');
    }
    setForm(emptyForm());
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const removeDraft = (id) => {
    setDrafts((d) => d.filter((p) => p.id !== id));
    showToast('Producto quitado de esta sesión');
  };

  const handleEditExisting = (product) => {
    setForm({
      nombre: product.nombre,
      categoria: product.categoria,
      variantGroups: Object.entries(product.variantes || {}).map(([label, values]) => ({
        label,
        values: (values || []).join(', '),
        medidas: Object.entries(product.medidas?.[label] || {})
          .map(([opcion, medida]) => `${opcion}: ${medida}`)
          .join('; '),
      })),
      precio: String(product.precio),
      descripcion: product.descripcion,
      instrucciones: product.instrucciones || '',
      imagenPreview: product.imagen || '',
      imagenNombre: product.imagenNombre || (product.imagen ? 'Imagen actual' : ''),
      promo: product.promo || '',
      descuentoPorcentaje: product.descuentoPorcentaje ? String(product.descuentoPorcentaje) : '',
      tipoPromocion: Object.values(PROMO_TYPES).includes(product.tipoPromocion)
        ? product.tipoPromocion
        : PROMO_TYPES.NONE,
      descuentoSegundaUnidad: product.descuentoSegundaUnidad ? String(product.descuentoSegundaUnidad) : '',
      activo: product.activo !== false,
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

  const handleDeleteExisting = (id) => {
    if (editingOriginalId === id) handleCancelEdit();
    setDeletedIds((prev) => new Set(prev).add(id));
    setExistingEdits((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
    showToast('Producto marcado para eliminar');
  };

  const handleUndoDelete = (id) => {
    setDeletedIds((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
    showToast('Eliminación deshecha');
  };

  const handleToggleStock = (product) => {
    setExistingEdits((prev) => ({
      ...prev,
      [product.id]: { ...product, sinStock: !product.sinStock },
    }));
    showToast(product.sinStock ? 'Stock reactivado' : 'Producto congelado (sin stock)');
  };

  const handleToggleActive = (product) => {
    setExistingEdits((prev) => ({
      ...prev,
      [product.id]: { ...product, activo: product.activo === false },
    }));
    showToast(product.activo === false ? 'Producto reactivado' : 'Producto desactivado');
  };

  const handleCopyDeleteNote = async (product) => {
    const ok = await copyToClipboard(formatDeleteNote(product));
    if (ok) {
      setCopiedId(`del:${product.id}`);
      setTimeout(() => setCopiedId(''), 1800);
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
          </div>
        </div>
      </header>

      <main className="container admin__layout">
        <form className="admin__form" onSubmit={handleAdd} ref={formRef}>
          <h2>{editingOriginalId ? 'Editar producto' : 'Nuevo producto'}</h2>
          {editingOriginalId && (
            <p className="admin__edit-banner">
              Editando <strong>{CATALOG.find((p) => p.id === editingOriginalId)?.nombre}</strong>.{' '}
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
              Agregá una por cada opción que tenga el producto: Color, Talle, Tamaño, Tipo de
              gema... lo que haga falta. Dejalo vacío si no tiene.
            </p>
            {form.variantGroups.map((g, i) => (
              <div className="admin__variant-group" key={i}>
                <div className="admin__variant-row">
                  <input
                    type="text"
                    value={g.label}
                    onChange={updateVariantGroup(i, 'label')}
                    placeholder="Nombre (ej: Tamaño)"
                    aria-label={`Nombre de la variante ${i + 1}`}
                  />
                  <input
                    type="text"
                    value={g.values}
                    onChange={updateVariantGroup(i, 'values')}
                    placeholder="Opciones separadas por coma (ej: 500ml, 700ml)"
                    aria-label={`Opciones de la variante ${i + 1}`}
                  />
                  <button
                    type="button"
                    className="admin__variant-remove"
                    onClick={() => removeVariantGroup(i)}
                    aria-label="Quitar esta variante"
                  >
                    ×
                  </button>
                </div>
                <input
                  type="text"
                  className="admin__variant-medidas"
                  value={g.medidas || ''}
                  onChange={updateVariantGroup(i, 'medidas')}
                  placeholder="Medidas por opción, opcional (ej: Mediano: 9 x 3 cm; Grande: 11 x 3.5 cm)"
                  aria-label={`Medidas por opción de la variante ${i + 1}`}
                />
              </div>
            ))}
            <button type="button" className="admin__variant-add" onClick={addVariantGroup}>
              + Agregar variante
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
                  accept="image/*"
                  ref={fileInputRef}
                  onChange={handleImageChange}
                />
                <span>Subir foto (JPG, PNG, WEBP...)</span>
              </label>
            )}
            {imageError && <p className="admin__error">{imageError}</p>}
            <p className="admin__field-note">
              Todavía no hay storage conectado: la foto queda guardada nomás en esta sesión del
              panel. Más adelante, con Firebase, esto va a subirse solo y quedar como un link.
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

          <div className="admin__checks">
            <label className="admin__check">
              <input type="checkbox" checked={form.activo} onChange={setCheck('activo')} />
              <span>Visible en la tienda (activo)</span>
            </label>
          </div>

          <label className="admin__field">
            <span>Descripción</span>
            <textarea rows="4" value={form.descripcion} onChange={set('descripcion')} placeholder="Descripción del producto..." />
          </label>

          <label className="admin__field">
            <span>Cómo usarlo (opcional)</span>
            <textarea rows="3" value={form.instrucciones} onChange={set('instrucciones')} placeholder="Instrucciones de uso y cuidado..." />
          </label>

          {error && <p className="admin__error">{error}</p>}

          <button type="submit" className="admin__submit">
            {editingOriginalId ? 'Guardar cambios' : 'Agregar a la lista'}
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
            {catalogSearch.trim() ? ` de ${existingProducts.length}` : ''}
            {inactiveCount > 0 ? ` · ${inactiveCount} inactivo${inactiveCount === 1 ? '' : 's'}` : ''})
          </h2>
        </div>
        <p className="admin__drafts-note">
          Esto es lo que ya está publicado. Todavía no hay base de datos conectada: "Editar",
          "Congelar" y "Eliminar" quedan guardados acá, en esta sesión del panel, no se publican
          solos todavía.
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
        {catalogSearch.trim() && filteredExistingProducts.length === 0 && (
          <p className="admin__drafts-empty">No encontramos ningún producto con ese nombre.</p>
        )}
        <div className="grid admin__drafts-grid">
          {filteredExistingProducts.map((p) => (
            <div className="admin__draft" key={p.id}>
              <ProductCard
                product={p}
                onOpen={setPreview}
                priceAside={
                  p.activo === false ? (
                    <div className="admin__draft-badges">
                      <span className="admin__draft-badge admin__draft-badge--off">Inactiva</span>
                    </div>
                  ) : null
                }
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
                  onClick={() => setOpenActionsFor(openActionsFor === p.id ? null : p.id)}
                >
                  Acciones
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
                      onClick={() => { setOpenActionsFor(null); handleToggleActive(p); }}
                    >
                      {p.activo === false ? 'Reactivar' : 'Desactivar'}
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
                      onClick={() => { setOpenActionsFor(null); handleDeleteExisting(p.id); }}
                    >
                      Eliminar
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {pendingDeletes.length > 0 && (
          <div className="admin__pending-deletes">
            <h3>Marcados para eliminar ({pendingDeletes.length})</h3>
            {pendingDeletes.map((p) => (
              <div className="admin__pending-delete-row" key={p.id}>
                <span>{p.nombre}</span>
                <div className="admin__pending-delete-actions">
                  <button onClick={() => handleCopyDeleteNote(p)}>
                    {copiedId === `del:${p.id}` ? 'Copiado ✓' : 'Copiar instrucción'}
                  </button>
                  <button onClick={() => handleUndoDelete(p.id)}>Deshacer</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {drafts.length > 0 && (
        <section className="container admin__drafts">
          <div className="admin__drafts-head">
            <h2>Cargados en esta sesión ({drafts.length})</h2>
          </div>
          <p className="admin__drafts-note">
            Todavía no hay base de datos conectada, así que esto no se publica solo: quedan
            guardados acá nomás. Contame qué productos armaste y los subo yo al catálogo real (o
            esperá a que conectemos Supabase para que se guarde solo).
          </p>
          <div className="grid admin__drafts-grid">
            {drafts.map((p) => (
              <div className="admin__draft" key={p.id}>
                <ProductCard product={p} onOpen={setPreview} />
                <div className="admin__draft-actions">
                  <button className="admin__draft-remove" onClick={() => removeDraft(p.id)}>Quitar</button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {preview && <ProductModal product={preview} onClose={() => setPreview(null)} />}

      {toast && (
        <div className="admin__toast" role="status" aria-live="polite">
          {toast.msg}
        </div>
      )}
    </div>
  );
}

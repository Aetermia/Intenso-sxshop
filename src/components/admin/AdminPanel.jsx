import React, { useMemo, useRef, useState } from 'react';
import { CATEGORIES } from '../../data/config.js';
import { CATALOG, CATEGORY_TINT } from '../../data/catalog.js';
import ProductCard from '../ProductCard.jsx';
import ProductModal from '../ProductModal.jsx';
import Logo from '../Logo.jsx';
import './AdminPanel.css';

const REAL_CATEGORIES = CATEGORIES.filter((c) => c.id !== 'todos' && c.id !== 'mas-pedidos');
const SIZED_CATEGORIES = ['lenceria', 'parejas', 'bdsm'];
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

function emptyForm() {
  return {
    nombre: '',
    categoria: REAL_CATEGORIES[0].id,
    talles: '',
    colores: '',
    precio: '',
    descripcion: '',
    instrucciones: '',
    imagenPreview: '',
    imagenNombre: '',
  };
}

function formatProductCode(product) {
  const lines = ['  {'];
  lines.push(`    id: '${product.id}',`);
  lines.push(`    nombre: '${product.nombre.replace(/'/g, "\\'")}',`);
  lines.push(`    categoria: '${product.categoria}',`);
  lines.push(`    precio: ${product.precio},`);
  lines.push(`    insignias: [],`);
  lines.push(`    tinte: ['${product.tinte[0]}', '${product.tinte[1]}'],`);
  if (product.imagen) {
    lines.push(
      `    // Imagen "${product.imagenNombre || 'sin nombre'}" cargada en el panel: subila a tu`,
      `    // storage (Firebase, etc.) y reemplazá este data URL por esa URL final.`,
      `    imagen: '${product.imagen}',`
    );
  }
  lines.push(`    descripcion:\n      '${product.descripcion.replace(/'/g, "\\'")}',`);
  if (product.instrucciones) {
    lines.push(`    instrucciones:\n      '${product.instrucciones.replace(/'/g, "\\'")}',`);
  }
  const variantKeys = Object.keys(product.variantes || {});
  if (variantKeys.length) {
    lines.push('    variantes: {');
    variantKeys.forEach((k) => {
      const opts = product.variantes[k].map((o) => `'${o}'`).join(', ');
      lines.push(`      ${k}: [${opts}],`);
    });
    lines.push('    },');
  }
  lines.push('  },');
  return lines.join('\n');
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

export default function AdminPanel({ onExit }) {
  const [form, setForm] = useState(emptyForm);
  const [drafts, setDrafts] = useState([]);
  const [error, setError] = useState('');
  const [imageError, setImageError] = useState('');
  const [copiedId, setCopiedId] = useState('');
  const [preview, setPreview] = useState(null);
  const fileInputRef = useRef(null);
  const formRef = useRef(null);

  // CRUD sobre el catálogo existente: todavía no hay base de datos, así que
  // "actualizar" y "eliminar" generan el código para pegar a mano en
  // catalog.js (igual que "crear"). Cuando conectemos Supabase esto va a
  // escribir directo.
  const [editingOriginalId, setEditingOriginalId] = useState(null);
  const [existingEdits, setExistingEdits] = useState({});
  const [deletedIds, setDeletedIds] = useState(() => new Set());

  const existingProducts = useMemo(
    () => CATALOG.filter((p) => !deletedIds.has(p.id)).map((p) => existingEdits[p.id] || p),
    [existingEdits, deletedIds]
  );
  const pendingDeletes = useMemo(
    () => CATALOG.filter((p) => deletedIds.has(p.id)),
    [deletedIds]
  );

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const showTalles = SIZED_CATEGORIES.includes(form.categoria);

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
    if (showTalles && form.talles.trim()) variantes.Talle = splitList(form.talles);
    if (form.colores.trim()) variantes.Color = splitList(form.colores);

    return {
      id: slugify(form.nombre) || 'nuevo-producto',
      nombre: form.nombre.trim() || 'Nombre del producto',
      categoria: form.categoria,
      precio: Number(form.precio) || 0,
      insignias: [],
      tinte: CATEGORY_TINT[form.categoria] || CATEGORY_TINT.juguetes,
      descripcion: form.descripcion.trim() || 'La descripción que cargues va a aparecer acá.',
      instrucciones: form.instrucciones.trim(),
      variantes,
      imagen: form.imagenPreview || undefined,
      imagenNombre: form.imagenNombre || undefined,
    };
  }, [form, showTalles]);

  const handleAdd = (e) => {
    e.preventDefault();
    if (!form.nombre.trim()) return setError('Ponele un nombre al producto.');
    if (!form.precio || Number(form.precio) <= 0) return setError('Cargá un precio válido.');
    if (!form.descripcion.trim()) return setError('Escribí una descripción.');
    setError('');
    if (editingOriginalId) {
      setExistingEdits((e2) => ({ ...e2, [editingOriginalId]: { ...previewProduct, id: editingOriginalId } }));
      setEditingOriginalId(null);
    } else {
      setDrafts((d) => [...d, previewProduct]);
    }
    setForm(emptyForm());
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const removeDraft = (id) => setDrafts((d) => d.filter((p) => p.id !== id));

  const handleEditExisting = (product) => {
    setForm({
      nombre: product.nombre,
      categoria: product.categoria,
      talles: (product.variantes?.Talle || []).join(', '),
      colores: (product.variantes?.Color || []).join(', '),
      precio: String(product.precio),
      descripcion: product.descripcion,
      instrucciones: product.instrucciones || '',
      imagenPreview: product.imagen || '',
      imagenNombre: product.imagenNombre || (product.imagen ? 'Imagen actual' : ''),
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
  };

  const handleUndoDelete = (id) => {
    setDeletedIds((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  };

  const handleCopy = async (product) => {
    const ok = await copyToClipboard(formatProductCode(product));
    if (ok) {
      setCopiedId(product.id);
      setTimeout(() => setCopiedId(''), 1800);
    }
  };

  const handleCopyAll = async () => {
    const ok = await copyToClipboard(drafts.map(formatProductCode).join('\n'));
    if (ok) {
      setCopiedId('__all__');
      setTimeout(() => setCopiedId(''), 1800);
    }
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
            <a href="#" className="admin__link">← Volver a la tienda</a>
            <button className="admin__link" onClick={onExit}>Salir</button>
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
              {REAL_CATEGORIES.map((c) => (
                <option key={c.id} value={c.id}>{c.label}</option>
              ))}
            </select>
          </label>

          {showTalles && (
            <label className="admin__field">
              <span>Subfiltro: talles (separados por coma)</span>
              <input type="text" value={form.talles} onChange={set('talles')} placeholder="S, M, L, XL" />
            </label>
          )}

          <label className="admin__field">
            <span>Subfiltro: color (separados por coma)</span>
            <input type="text" value={form.colores} onChange={set('colores')} placeholder="Negro, Rojo, Rosa" />
          </label>

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
              Todavía no hay storage conectado: la foto queda incrustada en el código que vas a
              copiar. Más adelante, con Firebase, esto va a subirse solo y quedar como un link.
            </p>
          </div>

          <label className="admin__field">
            <span>Precio (ARS)</span>
            <input type="number" min="0" value={form.precio} onChange={set('precio')} placeholder="25000" />
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
          <h2>Catálogo actual ({existingProducts.length})</h2>
        </div>
        <p className="admin__drafts-note">
          Esto es lo que ya está publicado. Todavía no hay base de datos conectada: "Editar" y
          "Eliminar" te arman el código para pegar en <code>src/data/catalog.js</code>, no lo
          cambian solos (eso llega con Supabase).
        </p>
        <div className="grid admin__drafts-grid">
          {existingProducts.map((p) => (
            <div className="admin__draft" key={p.id}>
              {existingEdits[p.id] && <span className="admin__draft-badge">Editado</span>}
              <ProductCard product={p} onOpen={setPreview} />
              <div className="admin__draft-actions">
                <button onClick={() => handleEditExisting(p)}>Editar</button>
                {existingEdits[p.id] && (
                  <button onClick={() => handleCopy(p)}>
                    {copiedId === p.id ? 'Copiado ✓' : 'Copiar código'}
                  </button>
                )}
                <button className="admin__draft-remove" onClick={() => handleDeleteExisting(p.id)}>
                  Eliminar
                </button>
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
            <button className="admin__copy-all" onClick={handleCopyAll}>
              {copiedId === '__all__' ? 'Copiado ✓' : 'Copiar todo el código'}
            </button>
          </div>
          <p className="admin__drafts-note">
            Todavía no hay base de datos conectada, así que esto no se publica solo: copiá el código de cada
            producto y pegalo en <code>src/data/catalog.js</code> (o esperá a que conectemos Supabase para que
            se guarde solo).
          </p>
          <div className="grid admin__drafts-grid">
            {drafts.map((p) => (
              <div className="admin__draft" key={p.id}>
                <ProductCard product={p} onOpen={setPreview} />
                <div className="admin__draft-actions">
                  <button onClick={() => handleCopy(p)}>
                    {copiedId === p.id ? 'Copiado ✓' : 'Copiar código'}
                  </button>
                  <button className="admin__draft-remove" onClick={() => removeDraft(p.id)}>Quitar</button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {preview && <ProductModal product={preview} onClose={() => setPreview(null)} />}
    </div>
  );
}

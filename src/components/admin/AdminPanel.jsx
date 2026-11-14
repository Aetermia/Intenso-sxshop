import React, { useMemo, useRef, useState } from 'react';
import ProductCard from '../ProductCard.jsx';
import ProductModal from '../ProductModal.jsx';
import Logo from '../Logo.jsx';
import ProductForm from './ProductForm.jsx';
import CatalogList from './CatalogList.jsx';
import { emptyForm, formToPayload, formToPreview, productToForm, validateForm } from './productForm.js';
import { useAdminProducts } from './useAdminProducts.js';
import { useToast } from '../../hooks/useToast.js';
import './AdminPanel.css';

// Panel de administración: arma la pantalla y coordina el formulario
// (ProductForm), la vista previa y el listado (CatalogList). Los datos y
// las llamadas a la API están en useAdminProducts.
export default function AdminPanel({ admin, onLogout, onSessionExpired }) {
  const { products, status, loadError, reload, save, toggleStock, remove } = useAdminProducts(onSessionExpired);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [busyId, setBusyId] = useState(null); // producto con una acción en curso
  const [preview, setPreview] = useState(null);
  const [toast, showToast] = useToast();
  const formRef = useRef(null);

  const editing = products.find((p) => p.id === editingId) || null;
  // Al editar, la vista previa muestra las insignias que el producto ya tiene.
  const previewProduct = useMemo(() => formToPreview(form, editing?.insignias), [form, editing]);

  const resetForm = () => {
    setEditingId(null);
    setForm(emptyForm());
    setError('');
  };

  const handleSubmit = async () => {
    const invalid = validateForm(form);
    if (invalid) {
      setError(invalid);
      return;
    }
    setError('');
    setSaving(true);
    try {
      await save(editingId, formToPayload(form), form.images);
      showToast(editingId ? 'Producto actualizado' : 'Producto publicado');
      resetForm();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (product) => {
    setForm(productToForm(product));
    setEditingId(product.id);
    setError('');
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  // Congelar / eliminar: una acción por vez, con aviso del resultado.
  const runAction = async (product, action) => {
    if (busyId) return;
    setBusyId(product.id);
    try {
      showToast(await action());
    } catch (err) {
      showToast(err.message);
    } finally {
      setBusyId(null);
    }
  };

  const handleToggleStock = (product) =>
    runAction(product, async () => {
      const saved = await toggleStock(product);
      return saved.sinStock ? 'Producto congelado (sin stock)' : 'Stock reactivado';
    });

  const handleDelete = (product) => {
    const ok = window.confirm(
      `¿Eliminar "${product.nombre}"?\n\nSe borra de la tienda y no se puede deshacer. ` +
        'Si solo querés que no se pueda comprar por ahora, usá "Congelar (sin stock)".'
    );
    if (!ok) return;
    runAction(product, async () => {
      await remove(product);
      if (editingId === product.id) resetForm();
      return 'Producto eliminado';
    });
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
        <ProductForm
          form={form}
          setForm={setForm}
          editing={editing}
          saving={saving}
          error={error}
          onSubmit={handleSubmit}
          onCancel={resetForm}
          formRef={formRef}
        />

        <aside className="admin__preview">
          <h2>Vista previa</h2>
          <div className="admin__preview-card">
            <ProductCard product={previewProduct} onOpen={setPreview} />
          </div>
          <p className="admin__preview-hint">
            Así se va a ver la tarjeta en el catálogo. Tocá "Ver producto" para previsualizar la ficha completa.
          </p>
        </aside>
      </main>

      <CatalogList
        products={products}
        status={status}
        loadError={loadError}
        onRetry={reload}
        busyId={busyId}
        onEdit={handleEdit}
        onToggleStock={handleToggleStock}
        onDelete={handleDelete}
        onPreview={setPreview}
      />

      {preview && <ProductModal product={preview} onClose={() => setPreview(null)} />}

      {toast && (
        <div className="admin__toast" role="status" aria-live="polite">
          {toast}
        </div>
      )}
    </div>
  );
}

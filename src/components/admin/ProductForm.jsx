import React from 'react';
import { REAL_CATEGORIES } from '../../data/config.js';
import { PROMO_TYPES } from '../../utils/pricing.js';
import VariantsEditor from './VariantsEditor.jsx';
import ImagesField from './ImagesField.jsx';

// Formulario de alta/edición de producto. El estado vive en AdminPanel
// (`form` / `setForm`); la lógica pura está en productForm.js.
//
//   editing  -> producto que se está editando (null = producto nuevo)
//   onSubmit -> se llama al enviar; AdminPanel valida y guarda
export default function ProductForm({ form, setForm, editing, saving, error, onSubmit, onCancel, formRef }) {
  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!saving) onSubmit();
  };

  return (
    <form className="admin__form" onSubmit={handleSubmit} ref={formRef}>
      <h2>{editing ? 'Editar producto' : 'Nuevo producto'}</h2>
      {editing && (
        <p className="admin__edit-banner">
          Editando <strong>{editing.nombre}</strong>.{' '}
          <button type="button" onClick={onCancel}>Cancelar</button>
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

      <VariantsEditor
        groups={form.variantGroups}
        onChange={(variantGroups) => setForm((f) => ({ ...f, variantGroups }))}
        basePrice={form.precio}
      />

      {/* key: al cambiar de producto se limpia el aviso de error de las fotos. */}
      <ImagesField
        key={editing?.id ?? 'nuevo'}
        images={form.images}
        onChange={(update) => setForm((f) => ({ ...f, images: update(f.images) }))}
      />

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
        {saving ? 'Guardando...' : editing ? 'Guardar cambios' : 'Publicar producto'}
      </button>
    </form>
  );
}

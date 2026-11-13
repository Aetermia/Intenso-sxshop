import React from 'react';
import { formatARS } from '../../utils/pricing.js';
import { emptyOption, emptyVariantGroup } from './productForm.js';

// Editor de variantes del producto: grupos (Talle, Color...) con opciones,
// cada una con nombre, descripción/medida y precio propio opcional.
//
//   groups    -> [{ label, options: [{ nombre, descripcion, precio }] }]
//   onChange  -> recibe la lista de grupos nueva
//   basePrice -> precio base del producto (se muestra como sugerencia)
export default function VariantsEditor({ groups, onChange, basePrice }) {
  const updateGroup = (index, changes) =>
    onChange(groups.map((g, i) => (i === index ? { ...g, ...changes } : g)));
  const removeGroup = (index) => onChange(groups.filter((_, i) => i !== index));
  const addGroup = () => onChange([...groups, emptyVariantGroup()]);

  const mapOptions = (groupIndex, fn) => updateGroup(groupIndex, { options: fn(groups[groupIndex].options) });
  const addOption = (groupIndex) => mapOptions(groupIndex, (opts) => [...opts, emptyOption()]);
  const removeOption = (groupIndex, optIndex) => mapOptions(groupIndex, (opts) => opts.filter((_, j) => j !== optIndex));
  const updateOption = (groupIndex, optIndex, field) => (e) => {
    const { value } = e.target;
    mapOptions(groupIndex, (opts) => opts.map((o, j) => (j === optIndex ? { ...o, [field]: value } : o)));
  };

  return (
    <div className="admin__field">
      <span>Variantes (opcional)</span>
      <p className="admin__field-note">
        Creá un grupo por cada tipo de variante (Talle, Color, Tamaño...) y cargá sus
        opciones. Cada opción puede tener una descripción o medida y un precio propio; si
        dejás el precio vacío, usa el precio base del producto. Dejalo vacío si no tiene.
      </p>
      {groups.map((g, i) => (
        <div className="admin__variant-group" key={i}>
          <div className="admin__variant-row">
            <input
              type="text"
              value={g.label}
              onChange={(e) => updateGroup(i, { label: e.target.value })}
              placeholder="Grupo (ej: Talle, Color)"
              aria-label={`Nombre del grupo de variantes ${i + 1}`}
            />
            <button
              type="button"
              className="admin__variant-remove"
              onClick={() => removeGroup(i)}
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
                  onChange={updateOption(i, j, 'nombre')}
                  placeholder="Ej: S, Rojo"
                  aria-label={`Nombre de la opción ${j + 1} de ${g.label || `el grupo ${i + 1}`}`}
                />
                <input
                  type="text"
                  value={o.descripcion}
                  onChange={updateOption(i, j, 'descripcion')}
                  placeholder="Opcional (ej: 65x25 cm)"
                  aria-label={`Descripción de la opción ${j + 1} de ${g.label || `el grupo ${i + 1}`}`}
                />
                <input
                  type="number"
                  min="0"
                  step="1"
                  value={o.precio}
                  onChange={updateOption(i, j, 'precio')}
                  placeholder={basePrice ? formatARS(basePrice) : 'Precio base'}
                  aria-label={`Precio de la opción ${j + 1} de ${g.label || `el grupo ${i + 1}`}`}
                />
                <button
                  type="button"
                  className="admin__variant-remove admin__variant-remove--sm"
                  onClick={() => removeOption(i, j)}
                  aria-label={`Eliminar la opción ${o.nombre || j + 1}`}
                  title="Eliminar opción"
                >
                  ×
                </button>
              </div>
            ))}
            <button type="button" className="admin__variant-option-add" onClick={() => addOption(i)}>
              + Agregar opción
            </button>
          </div>
        </div>
      ))}
      <button type="button" className="admin__variant-add" onClick={addGroup}>
        + Agregar grupo de variantes
      </button>
    </div>
  );
}

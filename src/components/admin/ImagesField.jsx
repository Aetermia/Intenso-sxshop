import React, { useEffect, useState } from 'react';
import { MAX_PRODUCT_IMAGES } from '../../utils/product.js';
import { readImageFiles, validateImageFiles } from './productForm.js';

// Fotos del producto en el formulario (hasta MAX_PRODUCT_IMAGES). La
// primera es la principal. Cada foto: { key, preview, nombre, url, file }
//   url  -> dirección ya guardada en el servidor ('' si es nueva)
//   file -> archivo nuevo, todavía sin subir (se sube al guardar)
export default function ImagesField({ images, onChange }) {
  const [error, setError] = useState('');

  // Formulario vaciado (se guardó o se canceló): el aviso ya no aplica.
  useEffect(() => {
    if (!images.length) setError('');
  }, [images.length]);

  const handleFiles = async (e) => {
    const files = Array.from(e.target.files || []);
    e.target.value = ''; // permite volver a elegir el mismo archivo
    if (!files.length) return;
    const invalid = validateImageFiles(files);
    if (invalid) {
      setError(invalid);
      return;
    }
    const room = MAX_PRODUCT_IMAGES - images.length;
    setError(
      files.length > room
        ? `Un producto puede tener hasta ${MAX_PRODUCT_IMAGES} fotos: se agregaron solo las primeras.`
        : ''
    );
    const nuevas = await readImageFiles(files.slice(0, room));
    onChange((current) => [...current, ...nuevas].slice(0, MAX_PRODUCT_IMAGES));
  };

  const remove = (key) => {
    onChange((current) => current.filter((img) => img.key !== key));
    setError('');
  };

  // Pasa una foto al primer lugar: es la que se ve en la tarjeta.
  const makeMain = (key) =>
    onChange((current) => {
      const picked = current.find((img) => img.key === key);
      return picked ? [picked, ...current.filter((img) => img.key !== key)] : current;
    });

  return (
    <div className="admin__field">
      <span>Fotos del producto (opcional, hasta {MAX_PRODUCT_IMAGES})</span>
      {images.map((img, i) => (
        <div className="admin__image-preview" key={img.key}>
          <img src={img.preview} alt={`Vista previa de la foto ${i + 1}`} />
          <div className="admin__image-preview-info">
            <span>{i === 0 ? 'Principal · ' : ''}{img.nombre}</span>
            <div className="admin__image-preview-actions">
              {i > 0 && (
                <button type="button" onClick={() => makeMain(img.key)}>Hacer principal</button>
              )}
              <button type="button" onClick={() => remove(img.key)}>Quitar</button>
            </div>
          </div>
        </div>
      ))}
      {images.length < MAX_PRODUCT_IMAGES && (
        <label className="admin__image-drop">
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            multiple
            onChange={handleFiles}
          />
          <span>
            {images.length ? 'Agregar otra foto' : 'Subir fotos (JPG, PNG o WEBP)'}
          </span>
        </label>
      )}
      {error && <p className="admin__error">{error}</p>}
      <p className="admin__field-note">
        Hasta {MAX_PRODUCT_IMAGES} fotos JPG, PNG o WEBP de 5 MB cada una. La principal es la que se
        ve en la tarjeta; las demás aparecen al abrir el producto. Al guardar se suben al
        servidor, que las achica y las comprime solas.
      </p>
    </div>
  );
}

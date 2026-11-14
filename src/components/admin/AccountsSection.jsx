import React, { useCallback, useEffect, useState } from 'react';
import { changePassword, createAdmin, deleteAdmin, fetchAdmins } from '../../services/api.js';

const MIN_PASSWORD = 8;

// "Cuentas del panel": quién puede entrar a /#admin. Cualquier cuenta puede
// crear otras (con su mail y una contraseña provisoria), borrar las demás y
// cambiar su propia contraseña. No hay registro libre: una cuenta nueva la
// crea siempre alguien que ya tiene acceso.
export default function AccountsSection({ onSessionExpired, showToast }) {
  const [admins, setAdmins] = useState([]);
  const [status, setStatus] = useState('loading'); // 'loading' | 'ready' | 'error'
  const [loadError, setLoadError] = useState('');
  const [busyId, setBusyId] = useState(null);

  const [nueva, setNueva] = useState({ email: '', password: '' });
  const [createError, setCreateError] = useState('');
  const [creating, setCreating] = useState(false);

  const [pass, setPass] = useState({ actual: '', nueva: '', repetida: '' });
  const [passError, setPassError] = useState('');
  const [changing, setChanging] = useState(false);

  // Si la sesión venció, vuelve al login; si no, devuelve el mensaje.
  const messageFor = useCallback(
    (err) => {
      if (err?.status === 401) {
        onSessionExpired?.();
        return 'La sesión venció. Ingresá de nuevo.';
      }
      return err?.message || 'Ocurrió un error inesperado.';
    },
    [onSessionExpired]
  );

  const load = useCallback(async () => {
    setStatus('loading');
    try {
      setAdmins(await fetchAdmins());
      setStatus('ready');
    } catch (err) {
      setLoadError(messageFor(err));
      setStatus('error');
    }
  }, [messageFor]);

  useEffect(() => {
    load();
  }, [load]);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (creating) return;
    const email = nueva.email.trim();
    if (!email) return setCreateError('Escribí el mail de la cuenta nueva.');
    if (nueva.password.length < MIN_PASSWORD) {
      return setCreateError(`La contraseña provisoria tiene que tener al menos ${MIN_PASSWORD} caracteres.`);
    }
    setCreateError('');
    setCreating(true);
    try {
      const creada = await createAdmin(email, nueva.password);
      setAdmins((list) => [...list, creada]);
      setNueva({ email: '', password: '' });
      showToast(`Cuenta creada para ${creada.email}`);
    } catch (err) {
      setCreateError(messageFor(err));
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (cuenta) => {
    if (busyId) return;
    const ok = window.confirm(
      `¿Borrar la cuenta de ${cuenta.email}?\n\nEsa persona ya no va a poder entrar al panel.`
    );
    if (!ok) return;
    setBusyId(cuenta.id);
    try {
      await deleteAdmin(cuenta.id);
      setAdmins((list) => list.filter((a) => a.id !== cuenta.id));
      showToast('Cuenta borrada');
    } catch (err) {
      showToast(messageFor(err));
    } finally {
      setBusyId(null);
    }
  };

  const handlePassword = async (e) => {
    e.preventDefault();
    if (changing) return;
    if (!pass.actual) return setPassError('Escribí tu contraseña actual.');
    if (pass.nueva.length < MIN_PASSWORD) {
      return setPassError(`La contraseña nueva tiene que tener al menos ${MIN_PASSWORD} caracteres.`);
    }
    if (pass.nueva !== pass.repetida) return setPassError('Las dos contraseñas nuevas no coinciden.');
    setPassError('');
    setChanging(true);
    try {
      await changePassword(pass.actual, pass.nueva);
      setPass({ actual: '', nueva: '', repetida: '' });
      showToast('Contraseña actualizada');
    } catch (err) {
      setPassError(messageFor(err));
    } finally {
      setChanging(false);
    }
  };

  return (
    <section className="container admin__drafts admin__accounts">
      <div className="admin__drafts-head">
        <h2>Cuentas del panel</h2>
      </div>
      <p className="admin__drafts-note">
        Quienes pueden entrar a este panel. Todas las cuentas tienen los mismos permisos. Para
        sumar a alguien, creale una cuenta con su mail y una contraseña provisoria, pasásela por
        un medio privado y pedile que la cambie al entrar.
      </p>

      {status === 'loading' && <p className="admin__drafts-empty" role="status">Cargando las cuentas...</p>}
      {status === 'error' && (
        <p className="admin__error" role="alert">
          {loadError}{' '}
          <button type="button" className="admin__draft-remove" onClick={load}>Reintentar</button>
        </p>
      )}
      {status === 'ready' && (
        <ul className="admin__accounts-list">
          {admins.map((a) => (
            <li key={a.id} className="admin__accounts-row">
              <div className="admin__accounts-who">
                <span className="admin__accounts-email">{a.email}</span>
                {a.esVos && <span className="admin__accounts-you">Vos</span>}
              </div>
              {!a.esVos && (
                <button
                  type="button"
                  className="admin__accounts-delete"
                  onClick={() => handleDelete(a)}
                  disabled={busyId === a.id}
                >
                  {busyId === a.id ? 'Borrando...' : 'Borrar'}
                </button>
              )}
            </li>
          ))}
        </ul>
      )}

      <div className="admin__accounts-forms">
        <form className="admin__form admin__accounts-form" onSubmit={handleCreate}>
          <h3>Nueva cuenta</h3>
          <label className="admin__field">
            <span>Mail</span>
            <input
              id="cuenta-nueva-email"
              type="email"
              autoComplete="off"
              value={nueva.email}
              onChange={(e) => setNueva((n) => ({ ...n, email: e.target.value }))}
              placeholder="persona@ejemplo.com"
            />
          </label>
          <label className="admin__field">
            <span>Contraseña provisoria</span>
            <input
              id="cuenta-nueva-password"
              type="text"
              autoComplete="new-password"
              value={nueva.password}
              onChange={(e) => setNueva((n) => ({ ...n, password: e.target.value }))}
              placeholder={`Al menos ${MIN_PASSWORD} caracteres`}
            />
          </label>
          {createError && <p className="admin__error" role="alert">{createError}</p>}
          <button type="submit" className="admin__submit" disabled={creating}>
            {creating ? 'Creando...' : 'Crear cuenta'}
          </button>
        </form>

        <form className="admin__form admin__accounts-form" onSubmit={handlePassword}>
          <h3>Cambiar mi contraseña</h3>
          <label className="admin__field">
            <span>Contraseña actual</span>
            <input
              id="pass-actual"
              type="password"
              autoComplete="current-password"
              value={pass.actual}
              onChange={(e) => setPass((p) => ({ ...p, actual: e.target.value }))}
            />
          </label>
          <label className="admin__field">
            <span>Contraseña nueva</span>
            <input
              id="pass-nueva"
              type="password"
              autoComplete="new-password"
              value={pass.nueva}
              onChange={(e) => setPass((p) => ({ ...p, nueva: e.target.value }))}
            />
          </label>
          <label className="admin__field">
            <span>Repetir contraseña nueva</span>
            <input
              id="pass-repetida"
              type="password"
              autoComplete="new-password"
              value={pass.repetida}
              onChange={(e) => setPass((p) => ({ ...p, repetida: e.target.value }))}
            />
          </label>
          {passError && <p className="admin__error" role="alert">{passError}</p>}
          <button type="submit" className="admin__submit" disabled={changing}>
            {changing ? 'Guardando...' : 'Cambiar contraseña'}
          </button>
        </form>
      </div>
    </section>
  );
}

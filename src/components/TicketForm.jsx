import { ESTADO_LABELS, ESTADOS } from '../utils/tickets';

export default function TicketForm({ form, editingTicketId, saving, onChange, onSubmit, onCancel }) {
  return (
    <form className="form-stack" onSubmit={onSubmit}>
      <label>
        Título
        <input name="titulo" value={form.titulo} onChange={onChange} required />
      </label>
      <label>
        Descripción
        <textarea name="descripcion" value={form.descripcion} onChange={onChange} rows="5" required />
      </label>
      <label>
        Estado inicial
        <select name="estado" value={form.estado} onChange={onChange}>
          {ESTADOS.map((estado) => (
            <option key={estado} value={estado}>
              {ESTADO_LABELS[estado]}
            </option>
          ))}
        </select>
      </label>
      <div className="button-row">
        <button className="button primary" disabled={saving}>
          {saving ? 'Guardando...' : editingTicketId ? 'Actualizar' : 'Crear'}
        </button>
        {editingTicketId && (
          <button type="button" className="button ghost" onClick={onCancel}>
            Cancelar
          </button>
        )}
      </div>
    </form>
  );
}

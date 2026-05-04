export default function ProjectForm({ form, editingId, saving, onChange, onSubmit, onCancel }) {
  return (
    <form className="form-stack" onSubmit={onSubmit}>
      <label>
        Nombre
        <input name="nombre" value={form.nombre} onChange={onChange} required />
      </label>
      <label>
        Descripción
        <textarea name="descripcion" value={form.descripcion} onChange={onChange} rows="5" />
      </label>
      <div className="button-row">
        <button className="button primary" disabled={saving}>
          {saving ? 'Guardando...' : editingId ? 'Actualizar' : 'Crear'}
        </button>
        {editingId && (
          <button type="button" className="button ghost" onClick={onCancel}>
            Cancelar
          </button>
        )}
      </div>
    </form>
  );
}

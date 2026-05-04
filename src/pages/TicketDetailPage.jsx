import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Alert from '../components/Alert';
import Loading from '../components/Loading';
import StatusBadge from '../components/StatusBadge';
import {
  deleteTicket,
  getTicket,
  updateTicket,
  updateTicketResponsible,
  updateTicketStatus,
} from '../api/tickets';
import { getApiError } from '../api/client';
import {
  canMoveStatus,
  ESTADO_LABELS,
  ESTADOS,
  explainInvalidTransition,
  getResponsible,
  getResponsibleName,
} from '../utils/tickets';

export default function TicketDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [ticket, setTicket] = useState(null);
  const [form, setForm] = useState({ titulo: '', descripcion: '' });
  const [responsableId, setResponsableId] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const loadTicket = async () => {
    try {
      const { data } = await getTicket(id);
      const nextTicket = data.ticket || data;
      setTicket(nextTicket);
      setForm({ titulo: nextTicket.titulo || '', descripcion: nextTicket.descripcion || '' });
    } catch (err) {
      setError(getApiError(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTicket();
  }, [id]);

  const projectId = ticket?.proyectoId || ticket?.projectId || ticket?.ProyectoId;

  const saveTicket = async (event) => {
    event.preventDefault();
    setError('');
    setSuccess('');
    try {
      await updateTicket(id, form);
      setSuccess('Ticket actualizado.');
      await loadTicket();
    } catch (err) {
      setError(getApiError(err));
    }
  };

  const changeStatus = async (nextStatus) => {
    const hasResponsible = Boolean(getResponsible(ticket));
    if (!canMoveStatus(ticket.estado, nextStatus, hasResponsible)) {
      setError(explainInvalidTransition(ticket.estado, nextStatus, hasResponsible));
      return;
    }
    setError('');
    setSuccess('');
    try {
      await updateTicketStatus(id, nextStatus);
      setSuccess('Estado actualizado.');
      await loadTicket();
    } catch (err) {
      setError(getApiError(err));
    }
  };

  const assignResponsible = async (event) => {
    event.preventDefault();
    setError('');
    setSuccess('');
    try {
      await updateTicketResponsible(id, responsableId);
      setResponsableId('');
      setSuccess('Responsable actualizado.');
      await loadTicket();
    } catch (err) {
      setError(getApiError(err));
    }
  };

  const removeTicket = async () => {
    if (!window.confirm('¿Eliminar este ticket?')) return;
    try {
      await deleteTicket(id);
      navigate(projectId ? `/proyectos/${projectId}` : '/dashboard');
    } catch (err) {
      setError(getApiError(err));
    }
  };

  if (loading) return <Loading text="Cargando ticket..." />;

  return (
    <section className="page-grid narrow">
      <div className="page-header">
        <div>
          {projectId && (
            <Link to={`/proyectos/${projectId}`} className="back-link">
              Volver al proyecto
            </Link>
          )}
          <h1>{ticket?.titulo || 'Ticket'}</h1>
          <p>Responsable: {getResponsibleName(ticket)}</p>
        </div>
        <StatusBadge estado={ticket?.estado} />
      </div>

      <Alert>{error}</Alert>
      <Alert type="success">{success}</Alert>

      <section className="panel">
        <h2>Detalle</h2>
        <form className="form-stack" onSubmit={saveTicket}>
          <label>
            Título
            <input
              value={form.titulo}
              onChange={(event) => setForm({ ...form, titulo: event.target.value })}
              required
            />
          </label>
          <label>
            Descripción
            <textarea
              value={form.descripcion}
              onChange={(event) => setForm({ ...form, descripcion: event.target.value })}
              rows="6"
              required
            />
          </label>
          <button className="button primary">Guardar cambios</button>
        </form>
      </section>

      <section className="panel actions-panel">
        <div>
          <h2>Estado</h2>
          <select value={ticket?.estado} onChange={(event) => changeStatus(event.target.value)}>
            {ESTADOS.map((estado) => (
              <option key={estado} value={estado}>
                {ESTADO_LABELS[estado]}
              </option>
            ))}
          </select>
        </div>
        <form onSubmit={assignResponsible} className="inline-form">
          <input
            value={responsableId}
            onChange={(event) => setResponsableId(event.target.value)}
            placeholder="ID responsable"
            required
          />
          <button className="button ghost">Asignar responsable</button>
        </form>
        <button className="button danger" onClick={removeTicket}>
          Eliminar ticket
        </button>
      </section>
    </section>
  );
}

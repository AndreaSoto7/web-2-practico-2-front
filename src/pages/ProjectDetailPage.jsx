import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Alert from '../components/Alert';
import BoardColumn from '../components/BoardColumn';
import Loading from '../components/Loading';
import TicketForm from '../components/TicketForm';
import { addUserToProject, getProject, getProjectBoard } from '../api/projects';
import {
  createTicket,
  deleteTicket,
  listTicketsByProject,
  updateTicket,
  updateTicketResponsible,
  updateTicketStatus,
} from '../api/tickets';
import { getApiError } from '../api/client';
import {
  canMoveStatus,
  ESTADO_COLUMNS,
  extractBoardTickets,
  explainInvalidTransition,
  getResponsible,
  normalizeList,
} from '../utils/tickets';

const emptyTicket = { titulo: '', descripcion: '', estado: 'PENDIENTE' };

export default function ProjectDetailPage() {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [tickets, setTickets] = useState([]);
  const [ticketForm, setTicketForm] = useState(emptyTicket);
  const [editingTicketId, setEditingTicketId] = useState(null);
  const [email, setEmail] = useState('');
  const [responsibleByTicket, setResponsibleByTicket] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const members = useMemo(
    () => normalizeList(project?.usuarios || project?.users || project?.miembros),
    [project],
  );

  const loadData = async () => {
    setError('');
    try {
      const [projectResponse, boardResponse] = await Promise.allSettled([getProject(id), getProjectBoard(id)]);

      if (projectResponse.status === 'fulfilled') {
        setProject(projectResponse.value.data.proyecto || projectResponse.value.data);
      }

      if (boardResponse.status === 'fulfilled') {
        const boardTickets = extractBoardTickets(boardResponse.value.data);
        if (boardTickets.length) {
          setTickets(boardTickets);
        } else {
          const { data } = await listTicketsByProject(id);
          setTickets(normalizeList(data));
        }
      } else {
        const { data } = await listTicketsByProject(id);
        setTickets(normalizeList(data));
      }
    } catch (err) {
      setError(getApiError(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [id]);

  const grouped = useMemo(() => {
    return ESTADO_COLUMNS.reduce((acc, column) => {
      acc[column.key] = tickets.filter((ticket) => ticket.estado === column.key);
      return acc;
    }, {});
  }, [tickets]);

  const handleTicketFormChange = (event) => {
    setTicketForm({ ...ticketForm, [event.target.name]: event.target.value });
  };

  const resetTicketForm = () => {
    setEditingTicketId(null);
    setTicketForm(emptyTicket);
  };

  const handleTicketSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');
    try {
      if (editingTicketId) {
        await updateTicket(editingTicketId, ticketForm);
        setSuccess('Ticket actualizado.');
      } else {
        await createTicket(id, ticketForm);
        setSuccess('Ticket creado.');
      }
      resetTicketForm();
      await loadData();
    } catch (err) {
      setError(getApiError(err));
    } finally {
      setSaving(false);
    }
  };

  const startEditTicket = (ticket) => {
    setEditingTicketId(ticket.id);
    setTicketForm({
      titulo: ticket.titulo || '',
      descripcion: ticket.descripcion || '',
      estado: ticket.estado || 'PENDIENTE',
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteTicket = async (ticketId) => {
    if (!window.confirm('¿Eliminar este ticket?')) return;
    setError('');
    try {
      await deleteTicket(ticketId);
      setSuccess('Ticket eliminado.');
      await loadData();
    } catch (err) {
      setError(getApiError(err));
    }
  };

  const handleStatusChange = async (ticket, nextStatus) => {
    setError('');
    setSuccess('');
    const hasResponsible = Boolean(getResponsible(ticket));
    if (!canMoveStatus(ticket.estado, nextStatus, hasResponsible)) {
      setError(explainInvalidTransition(ticket.estado, nextStatus, hasResponsible));
      return;
    }
    try {
      await updateTicketStatus(ticket.id, nextStatus);
      setSuccess('Estado actualizado.');
      await loadData();
    } catch (err) {
      setError(getApiError(err));
    }
  };

  const handleResponsible = async (ticketId) => {
    const responsableId = responsibleByTicket[ticketId];
    if (!responsableId) {
      setError('Ingresa el ID del responsable.');
      return;
    }
    setError('');
    setSuccess('');
    try {
      await updateTicketResponsible(ticketId, responsableId);
      setSuccess('Responsable asignado.');
      setResponsibleByTicket({ ...responsibleByTicket, [ticketId]: '' });
      await loadData();
    } catch (err) {
      setError(getApiError(err));
    }
  };

  const handleResponsibleChange = (ticketId, value) => {
    setResponsibleByTicket({ ...responsibleByTicket, [ticketId]: value });
  };

  const handleAddUser = async (event) => {
    event.preventDefault();
    setError('');
    setSuccess('');
    try {
      await addUserToProject(id, email);
      setEmail('');
      setSuccess('Usuario agregado al proyecto.');
      await loadData();
    } catch (err) {
      setError(getApiError(err));
    }
  };

  if (loading) return <Loading text="Cargando proyecto..." />;

  return (
    <section className="page-grid">
      <div className="page-header">
        <div>
          <Link to="/dashboard" className="back-link">
            Volver a proyectos
          </Link>
          <h1>{project?.nombre || 'Proyecto'}</h1>
          <p>{project?.descripcion || 'Sin descripción'}</p>
        </div>
      </div>

      <Alert>{error}</Alert>
      <Alert type="success">{success}</Alert>

      <div className="split-layout">
        <section className="panel">
          <h2>{editingTicketId ? 'Editar ticket' : 'Crear ticket'}</h2>
          <TicketForm
            form={ticketForm}
            editingTicketId={editingTicketId}
            saving={saving}
            onChange={handleTicketFormChange}
            onSubmit={handleTicketSubmit}
            onCancel={resetTicketForm}
          />
        </section>

        <section className="panel">
          <h2>Equipo</h2>
          <form className="inline-form" onSubmit={handleAddUser}>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="email@equipo.com"
              required
            />
            <button className="button primary">Agregar</button>
          </form>
          {members.length > 0 && (
            <div className="member-list">
              {members.map((member) => (
                <span key={member.id || member.email}>
                  #{member.id} {member.nombre || member.email}
                </span>
              ))}
            </div>
          )}
        </section>
      </div>

      <section className="board">
        {ESTADO_COLUMNS.map((column) => (
          <BoardColumn
            key={column.key}
            title={column.title}
            tickets={grouped[column.key] || []}
            responsibleByTicket={responsibleByTicket}
            onResponsibleChange={handleResponsibleChange}
            onAssignResponsible={handleResponsible}
            onDelete={handleDeleteTicket}
            onEdit={startEditTicket}
            onStatusChange={handleStatusChange}
          />
        ))}
      </section>
    </section>
  );
}

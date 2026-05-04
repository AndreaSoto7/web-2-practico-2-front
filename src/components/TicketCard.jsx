import { Link } from 'react-router-dom';
import StatusBadge from './StatusBadge';
import {
  ESTADO_LABELS,
  ESTADOS,
  getResponsibleName,
  getTicketDescription,
  getTicketTitle,
} from '../utils/tickets';

export default function TicketCard({
  ticket,
  responsibleValue,
  onResponsibleChange,
  onAssignResponsible,
  onDelete,
  onEdit,
  onStatusChange,
}) {
  return (
    <article className="ticket-card">
      <div className="ticket-top">
        <Link to={`/tickets/${ticket.id}`}>{getTicketTitle(ticket)}</Link>
        <StatusBadge estado={ticket.estado} />
      </div>
      <p>{getTicketDescription(ticket)}</p>
      <div className="ticket-meta">
        <span>{getResponsibleName(ticket)}</span>
        {ticket.createdAt && <span>{new Date(ticket.createdAt).toLocaleDateString()}</span>}
      </div>
      <div className="form-stack compact">
        <label>
          Cambiar estado
          <select value={ticket.estado} onChange={(event) => onStatusChange(ticket, event.target.value)}>
            {ESTADOS.map((estado) => (
              <option key={estado} value={estado}>
                {ESTADO_LABELS[estado]}
              </option>
            ))}
          </select>
        </label>
        <div className="inline-form">
          <input
            value={responsibleValue || ''}
            onChange={(event) => onResponsibleChange(ticket.id, event.target.value)}
            placeholder="ID responsable"
          />
          <button type="button" className="button ghost" onClick={() => onAssignResponsible(ticket.id)}>
            Asignar
          </button>
        </div>
      </div>
      <div className="button-row">
        <button className="button ghost" onClick={() => onEdit(ticket)}>
          Editar
        </button>
        <button className="button danger" onClick={() => onDelete(ticket.id)}>
          Eliminar
        </button>
      </div>
    </article>
  );
}

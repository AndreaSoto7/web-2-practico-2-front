import TicketCard from './TicketCard';

export default function BoardColumn({
  title,
  tickets,
  responsibleByTicket,
  onResponsibleChange,
  onAssignResponsible,
  onDelete,
  onEdit,
  onStatusChange,
}) {
  return (
    <div className="board-column">
      <div className="column-header">
        <h2>{title}</h2>
        <span>{tickets.length}</span>
      </div>
      <div className="ticket-list">
        {tickets.map((ticket) => (
          <TicketCard
            key={ticket.id}
            ticket={ticket}
            responsibleValue={responsibleByTicket[ticket.id]}
            onResponsibleChange={onResponsibleChange}
            onAssignResponsible={onAssignResponsible}
            onDelete={onDelete}
            onEdit={onEdit}
            onStatusChange={onStatusChange}
          />
        ))}
        {tickets.length === 0 && <div className="empty-column">Sin tickets</div>}
      </div>
    </div>
  );
}

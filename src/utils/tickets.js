export const ESTADOS = ['PENDIENTE', 'EN_PROGRESO', 'COMPLETADO'];

export const ESTADO_LABELS = {
  PENDIENTE: 'Pendiente',
  EN_PROGRESO: 'En progreso',
  COMPLETADO: 'Completado',
};

export const ESTADO_COLUMNS = [
  { key: 'PENDIENTE', title: 'Pendientes' },
  { key: 'EN_PROGRESO', title: 'En progreso' },
  { key: 'COMPLETADO', title: 'Completados' },
];

export const normalizeList = (value) => {
  if (Array.isArray(value)) return value;
  if (Array.isArray(value?.data)) return value.data;
  if (Array.isArray(value?.proyectos)) return value.proyectos;
  if (Array.isArray(value?.tickets)) return value.tickets;
  if (Array.isArray(value?.usuarios)) return value.usuarios;
  return [];
};

export const extractBoardTickets = (value) => {
  const directList = normalizeList(value);
  if (directList.length) return directList;

  const buckets = [
    value?.PENDIENTE,
    value?.EN_PROGRESO,
    value?.COMPLETADO,
    value?.pendientes,
    value?.enProgreso,
    value?.en_progreso,
    value?.completados,
  ];

  return buckets.flatMap((bucket) => normalizeList(bucket));
};

export const getResponsible = (ticket) =>
  ticket?.responsable || ticket?.usuarioAsignado || ticket?.asignado || ticket?.usuario || null;

export const getResponsibleName = (ticket) => {
  const responsable = getResponsible(ticket);
  if (!responsable) return 'Sin responsable';
  if (typeof responsable === 'string') return responsable;
  return responsable.nombre || responsable.email || `Usuario #${responsable.id}`;
};

export const getTicketTitle = (ticket) => ticket.titulo || ticket.title || 'Sin titulo';
export const getTicketDescription = (ticket) =>
  ticket.descripcion || ticket.description || 'Sin descripción';

export const canMoveStatus = (from, to, hasResponsible) => {
  if (from === to) return true;
  if (to === 'EN_PROGRESO' && !hasResponsible) return false;

  const allowed = {
    PENDIENTE: ['EN_PROGRESO'],
    EN_PROGRESO: ['PENDIENTE', 'COMPLETADO'],
    COMPLETADO: ['EN_PROGRESO'],
  };

  return allowed[from]?.includes(to) || false;
};

export const explainInvalidTransition = (from, to, hasResponsible) => {
  if (to === 'EN_PROGRESO' && !hasResponsible) {
    return 'No se puede iniciar un ticket sin responsable.';
  }
  return `Movimiento no permitido: ${ESTADO_LABELS[from]} -> ${ESTADO_LABELS[to]}.`;
};

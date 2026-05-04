import api from './client';

export const listTicketsByProject = (projectId) => api.get(`/tickets/proyecto/${projectId}`);
export const createTicket = (projectId, data) => api.post(`/tickets/proyecto/${projectId}`, data);
export const getTicket = (id) => api.get(`/tickets/${id}`);
export const updateTicket = (id, data) => api.put(`/tickets/${id}`, data);
export const updateTicketStatus = (id, estado) => api.patch(`/tickets/${id}/estado`, { estado });
export const updateTicketResponsible = (id, responsableId) =>
  api.patch(`/tickets/${id}/responsable`, { responsableId: Number(responsableId) });
export const deleteTicket = (id) => api.delete(`/tickets/${id}`);

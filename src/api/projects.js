import api from './client';

export const listProjects = () => api.get('/proyectos');
export const createProject = (data) => api.post('/proyectos', data);
export const getProject = (id) => api.get(`/proyectos/${id}`);
export const updateProject = (id, data) => api.put(`/proyectos/${id}`, data);
export const addUserToProject = (id, email) => api.post(`/proyectos/${id}/usuarios`, { email });
export const getProjectBoard = (id) => api.get(`/proyectos/${id}/board`);

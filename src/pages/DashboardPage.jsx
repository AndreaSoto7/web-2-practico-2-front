import { useEffect, useState } from 'react';
import Alert from '../components/Alert';
import Loading from '../components/Loading';
import ProjectCard from '../components/ProjectCard';
import ProjectForm from '../components/ProjectForm';
import { createProject, listProjects, updateProject } from '../api/projects';
import { getApiError } from '../api/client';
import { normalizeList } from '../utils/tickets';

const emptyProject = { nombre: '', descripcion: '' };

export default function DashboardPage() {
  const [projects, setProjects] = useState([]);
  const [form, setForm] = useState(emptyProject);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const loadProjects = async () => {
    setError('');
    try {
      const { data } = await listProjects();
      setProjects(normalizeList(data));
    } catch (err) {
      setError(getApiError(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const handleChange = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  const startEdit = (project) => {
    setEditingId(project.id);
    setForm({ nombre: project.nombre || '', descripcion: project.descripcion || '' });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetForm = () => {
    setEditingId(null);
    setForm(emptyProject);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');
    try {
      if (editingId) {
        await updateProject(editingId, form);
        setSuccess('Proyecto actualizado.');
      } else {
        await createProject(form);
        setSuccess('Proyecto creado.');
      }
      resetForm();
      await loadProjects();
    } catch (err) {
      setError(getApiError(err));
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="page-grid">
      <div className="page-header">
        <div>
          <span className="eyebrow">Dashboard</span>
          <h1>Proyectos</h1>
        </div>
      </div>

      <div className="split-layout">
        <section className="panel">
          <h2>{editingId ? 'Editar proyecto' : 'Crear proyecto'}</h2>
          <Alert>{error}</Alert>
          <Alert type="success">{success}</Alert>
          <ProjectForm
            form={form}
            editingId={editingId}
            saving={saving}
            onChange={handleChange}
            onSubmit={handleSubmit}
            onCancel={resetForm}
          />
        </section>

        <section>
          {loading ? (
            <Loading />
          ) : projects.length === 0 ? (
            <div className="state-box">Todavía no tienes proyectos.</div>
          ) : (
            <div className="project-list">
              {projects.map((project) => (
                <ProjectCard key={project.id} project={project} onEdit={startEdit} />
              ))}
            </div>
          )}
        </section>
      </div>
    </section>
  );
}

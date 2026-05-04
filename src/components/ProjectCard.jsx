import { Link } from 'react-router-dom';

export default function ProjectCard({ project, onEdit }) {
  return (
    <article className="project-card">
      <div>
        <h3>{project.nombre}</h3>
        <p>{project.descripcion || 'Sin descripción'}</p>
      </div>
      <div className="card-meta">
        {project.createdAt && <span>Creado: {new Date(project.createdAt).toLocaleDateString()}</span>}
      </div>
      <div className="button-row">
        <Link className="button primary" to={`/proyectos/${project.id}`}>
          Abrir
        </Link>
        <button className="button ghost" onClick={() => onEdit(project)}>
          Editar
        </button>
      </div>
    </article>
  );
}

import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function AppLayout() {
  const { usuario, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <Link to="/dashboard" className="brand">
          <span className="brand-mark">IT</span>
          <span>Issue Tracker</span>
        </Link>
        <nav className="sidebar-nav">
          <NavLink to="/dashboard">Proyectos</NavLink>
        </nav>
        <div className="sidebar-user">
          <span>{usuario?.nombre || 'Usuario'}</span>
          <small>{usuario?.email}</small>
          <button className="button ghost full" onClick={handleLogout}>
            Cerrar sesión
          </button>
        </div>
      </aside>
      <main className="content-area">
        <Outlet />
      </main>
    </div>
  );
}

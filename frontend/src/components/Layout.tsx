import { Link, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export function Layout() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="container">
      <header style={{ marginBottom: '1.5rem' }}>
        <nav className="actions">
          <Link to="/candidates">Candidats</Link>
          <Link to="/candidates/new">Nouveau</Link>
          <button
            type="button"
            className="secondary"
            onClick={() => {
              logout();
              navigate('/login');
            }}
          >
            Déconnexion
          </button>
        </nav>
      </header>
      <Outlet />
    </div>
  );
}

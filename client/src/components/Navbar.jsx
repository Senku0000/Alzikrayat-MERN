import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * Navbar.jsx
 *
 * Top navigation bar. Mirrors the Project 1 requirement: shows
 * "Hi <firstName>" + Logout when authenticated, or "Please Login"
 * otherwise.
 */
export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/login');
  }

  return (
    <nav className="navbar">
      <div className="container">
        <Link className="navbar-brand" to="/">
          📷 Alzikrayat
        </Link>
        <div className="navbar-links">
          <Link to="/">Home</Link>
          <Link to="/gallery">Gallery</Link>
          {user && <Link to="/upload">Add Photo</Link>}

          {user ? (
            <>
              <span>Hi {user.firstName}</span>
              <button className="btn btn-outline btn-sm" onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            <Link className="btn btn-outline btn-sm" to="/login">
              Please Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}

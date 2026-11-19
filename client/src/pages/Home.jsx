import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * Home.jsx
 *
 * Landing page: hero banner, short description, and clear navigation
 * into the rest of the app, per spec 4.2.
 */
export default function Home() {
  const { user } = useAuth();

  return (
    <div className="container">
      <div className="hero">
        <h1>📷 Alzikrayat</h1>
        <p>
          "Alzikrayat" (Arabic for "Memories") is a place to upload, share, and comment on the
          photos that matter to you — rebuilt on the full MERN stack: MongoDB, Express, React, and
          Node.js.
        </p>
        <Link className="btn btn-primary" to="/gallery" style={{ marginRight: 10 }}>
          Browse Gallery
        </Link>
        {user ? (
          <Link className="btn btn-outline" to="/upload" style={{ color: 'var(--primary)', border: '1px solid var(--primary)' }}>
            Add a Photo
          </Link>
        ) : (
          <Link className="btn btn-outline" to="/login" style={{ color: 'var(--primary)', border: '1px solid var(--primary)' }}>
            Join now
          </Link>
        )}
      </div>

      <div className="card">
        <h3>About Us</h3>
        <p className="muted">
          Alzikrayat is a course project for the Advanced Web Technologies module. This MERN
          edition rebuilds the original hand-written PHP version as a full-stack JavaScript
          application: a React frontend consuming a REST API built with Express.js, backed by a
          MongoDB database modeled with Mongoose schemas.
        </p>
      </div>
    </div>
  );
}

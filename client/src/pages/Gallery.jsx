import { useEffect, useState } from 'react';
import api from '../api/client';
import PhotoCard from '../components/PhotoCard';
import GridToggle from '../components/GridToggle';

/**
 * Gallery.jsx
 *
 * Fetches the photo list from the REST API on mount (useEffect +
 * Axios), with loading/error states, and lets the user switch
 * between a grid and a list display style.
 */
export default function Gallery() {
  const [photos, setPhotos] = useState([]);
  const [view, setView] = useState('grid');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;

    api
      .get('/photos')
      .then((res) => {
        if (isMounted) setPhotos(res.data);
      })
      .catch((err) => {
        if (isMounted) setError(err.response?.data?.message || 'Failed to load photos.');
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
        <h2>Gallery</h2>
        <GridToggle view={view} onChange={setView} />
      </div>

      {loading && <p className="muted">Loading photos...</p>}
      {error && <div className="alert alert-error">{error}</div>}

      {!loading && !error && photos.length === 0 && (
        <p className="muted">No photos yet. Be the first to upload one!</p>
      )}

      <div className={`grid ${view === 'list' ? 'list-view' : ''}`}>
        {photos.map((photo) => (
          <PhotoCard key={photo._id} photo={photo} />
        ))}
      </div>
    </div>
  );
}

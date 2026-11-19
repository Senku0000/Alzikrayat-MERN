import { Link } from 'react-router-dom';

/**
 * PhotoCard.jsx
 *
 * Reusable, prop-configured card showing one photo's thumbnail,
 * title, and uploader name, linking to its detail page.
 */
export default function PhotoCard({ photo }) {
  const ownerName = photo.userId
    ? `${photo.userId.firstName} ${photo.userId.lastName}`
    : 'Unknown';

  return (
    <div className="card photo-card">
      <img src={`/uploads/${photo.fileName}`} alt={photo.title} />
      <div className="photo-card-body">
        <h3 style={{ margin: '0 0 4px', fontSize: '1rem' }}>{photo.title}</h3>
        <p className="muted" style={{ margin: '0 0 10px', fontSize: '0.85rem' }}>
          by {ownerName}
        </p>
        <Link className="btn btn-primary btn-sm" to={`/photos/${photo._id}`}>
          View
        </Link>
      </div>
    </div>
  );
}

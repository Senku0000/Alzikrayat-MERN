import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';
import CommentForm from '../components/CommentForm';

/**
 * PhotoDetail.jsx
 *
 * Dedicated detail route (/photos/:id using useParams, per spec
 * 4.3/Lecture 15). Shows the full-size photo, its metadata, its
 * comment thread, and an owner-only delete action.
 */
export default function PhotoDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [photo, setPhoto] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    Promise.all([api.get(`/photos/${id}`), api.get(`/photos/${id}/comments`)])
      .then(([photoRes, commentsRes]) => {
        if (!isMounted) return;
        setPhoto(photoRes.data);
        setComments(commentsRes.data);
      })
      .catch((err) => {
        if (isMounted) setError(err.response?.data?.message || 'Photo not found.');
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [id]);

  function handleCommentAdded(newComment) {
    // Update the UI immediately, no full page reload
    setComments((prev) => [...prev, newComment]);
  }

  async function handleDelete() {
    if (!window.confirm('Delete this photo permanently?')) return;

    setDeleting(true);
    try {
      await api.delete(`/photos/${id}`, { data: { userId: user._id } });
      navigate('/gallery');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete photo.');
      setDeleting(false);
    }
  }

  if (loading) return <div className="container"><p className="muted">Loading...</p></div>;
  if (error) return <div className="container"><div className="alert alert-error">{error}</div></div>;
  if (!photo) return null;

  const isOwner = user && photo.userId && user._id === photo.userId._id;

  return (
    <div className="container">
      <div className="detail-grid">
        <div>
          <img src={`/uploads/${photo.fileName}`} alt={photo.title} />
        </div>

        <div>
          <h2>{photo.title}</h2>
          <p className="muted">
            by {photo.userId ? `${photo.userId.firstName} ${photo.userId.lastName}` : 'Unknown'}{' '}
            &middot; {new Date(photo.dateTime).toLocaleString()}
          </p>
          <p>{photo.description}</p>

          {isOwner && (
            <button className="btn btn-danger btn-sm" onClick={handleDelete} disabled={deleting}>
              {deleting ? 'Deleting...' : 'Delete Photo'}
            </button>
          )}

          <hr style={{ margin: '20px 0', border: 'none', borderTop: '1px solid var(--border)' }} />

          <h4>Comments ({comments.length})</h4>
          <div style={{ marginBottom: 16 }}>
            {comments.map((c) => (
              <div className="comment-item" key={c._id}>
                <strong>
                  {c.userId ? `${c.userId.firstName} ${c.userId.lastName}` : 'Unknown'}
                </strong>{' '}
                <span className="muted" style={{ fontSize: '0.8rem' }}>
                  {new Date(c.dateTime).toLocaleString()}
                </span>
                <p style={{ margin: '4px 0 0' }}>{c.comment}</p>
              </div>
            ))}
          </div>

          <CommentForm photoId={id} onCommentAdded={handleCommentAdded} />
        </div>
      </div>
    </div>
  );
}

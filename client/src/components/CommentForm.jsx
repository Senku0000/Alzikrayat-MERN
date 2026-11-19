import { useState } from 'react';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';

/**
 * CommentForm.jsx
 *
 * Posts a new comment to /api/photos/:id/comments and calls
 * onCommentAdded(newComment) so the parent can update the UI
 * immediately, without a full page reload.
 */
export default function CommentForm({ photoId, onCommentAdded }) {
  const { user } = useAuth();
  const [text, setText] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    if (!text.trim()) {
      setError('Comment cannot be empty.');
      return;
    }

    setSubmitting(true);
    try {
      const { data } = await api.post(`/photos/${photoId}/comments`, {
        userId: user._id,
        comment: text.trim(),
      });
      onCommentAdded(data);
      setText('');
    } catch (err) {
      setError(err.response?.data?.message || 'Could not post comment.');
    } finally {
      setSubmitting(false);
    }
  }

  if (!user) {
    return (
      <p className="muted" style={{ fontSize: '0.88rem' }}>
        Log in to leave a comment.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      {error && <div className="alert alert-error">{error}</div>}
      <div className="form-group">
        <textarea
          className="form-control"
          placeholder="Add a comment..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          required
        />
      </div>
      <button className="btn btn-primary btn-sm" type="submit" disabled={submitting}>
        {submitting ? 'Posting...' : 'Post Comment'}
      </button>
    </form>
  );
}

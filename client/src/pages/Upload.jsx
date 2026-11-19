import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

/**
 * Upload.jsx
 *
 * Photo upload form (spec 4.3). Restricted to logged-in users;
 * submits multipart/form-data to POST /api/photos.
 */
export default function Upload() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState(null);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Guard: only authenticated users may reach this page
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  function handleFileChange(e) {
    setFile(e.target.files[0] || null);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    if (!title.trim()) {
      setError('Title is required.');
      return;
    }
    if (!file) {
      setError('Please choose an image file.');
      return;
    }
    if (!ALLOWED_TYPES.includes(file.type)) {
      setError('Only JPEG, PNG, GIF, or WEBP images are allowed.');
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('userId', user._id);
    formData.append('photo', file);

    setSubmitting(true);
    try {
      const { data } = await api.post('/photos', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      navigate(`/photos/${data._id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Upload failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="container" style={{ maxWidth: 480 }}>
      <div className="card">
        <h2>Add a Photo</h2>
        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label>Title</label>
            <input
              type="text"
              className="form-control"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={200}
              required
            />
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              className="form-control"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Image file</label>
            <input
              type="file"
              className="form-control"
              accept="image/*"
              onChange={handleFileChange}
              required
            />
          </div>

          <button className="btn btn-primary" type="submit" disabled={submitting}>
            {submitting ? 'Uploading...' : 'Upload'}
          </button>
        </form>
      </div>
    </div>
  );
}

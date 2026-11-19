import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * RegisterForm.jsx
 *
 * Registration form. HTML5 attributes + a JS pre-submit check handle
 * client-side validation; the server (Joi + Mongoose) is always the
 * final authority.
 */
export default function RegisterForm() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    if (form.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setSubmitting(true);
    try {
      await register(form);
      navigate('/gallery');
    } catch (err) {
      const serverErrors = err.response?.data?.errors;
      setError(serverErrors ? serverErrors.join(' ') : err.response?.data?.message || 'Registration failed.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      {error && <div className="alert alert-error">{error}</div>}

      <div className="form-group">
        <label>First name</label>
        <input
          type="text"
          name="firstName"
          className="form-control"
          value={form.firstName}
          onChange={handleChange}
          pattern="[A-Za-z ]{1,50}"
          required
        />
      </div>

      <div className="form-group">
        <label>Last name</label>
        <input
          type="text"
          name="lastName"
          className="form-control"
          value={form.lastName}
          onChange={handleChange}
          pattern="[A-Za-z ]{1,50}"
          required
        />
      </div>

      <div className="form-group">
        <label>Email</label>
        <input
          type="email"
          name="email"
          className="form-control"
          value={form.email}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <label>Password</label>
        <input
          type="password"
          name="password"
          className="form-control"
          value={form.password}
          onChange={handleChange}
          minLength={6}
          required
        />
      </div>

      <button className="btn btn-primary" type="submit" disabled={submitting}>
        {submitting ? 'Creating account...' : 'Create account'}
      </button>
    </form>
  );
}

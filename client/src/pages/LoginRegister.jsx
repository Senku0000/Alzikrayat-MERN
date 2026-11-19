import { useState } from 'react';
import LoginForm from '../components/LoginForm';
import RegisterForm from '../components/RegisterForm';

/**
 * LoginRegister.jsx
 *
 * Combined login/register view, mirroring the Project 1 tabbed UI.
 */
export default function LoginRegister() {
  const [tab, setTab] = useState('login');

  return (
    <div className="container" style={{ maxWidth: 480 }}>
      <div className="card">
        <div className="tabs">
          <button className={tab === 'login' ? 'active' : ''} onClick={() => setTab('login')}>
            Login
          </button>
          <button className={tab === 'register' ? 'active' : ''} onClick={() => setTab('register')}>
            Register
          </button>
        </div>

        {tab === 'login' ? <LoginForm /> : <RegisterForm />}
      </div>
    </div>
  );
}

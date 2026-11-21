import React, { useState, useContext } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import './../scss/auth.scss';

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useContext(AuthContext);
  const history = useHistory();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      // Fetch users from the REAL database
      const res = await fetch('http://localhost:3001/users');
      const users = await res.json();
      
      const user = users.find(u => u.email === email && u.password === password);

      if (!user) {
        setError('Invalid email or password!');
        return;
      }

      login(user);
      history.push('/');
    } catch (err) {
      setError('Server error. Is json-server running?');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Welcome Back</h2>
        <p className="auth-subtitle">Sign in to continue</p>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="input-group">
            <label>Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="input-group">
            <label>Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          <button type="submit" className="btn-primary">Sign In</button>
        </form>
        <p className="auth-redirect">No account? <Link to="/register">Register</Link></p>
      </div>
    </div>
  );
};
export default SignIn;
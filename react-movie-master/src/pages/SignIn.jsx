// src/pages/SignIn.jsx
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

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    // Fetch users from our fake database (localStorage)
    const users = JSON.parse(localStorage.getItem('moviemaster_users') || '[]');
    const user = users.find(u => u.email === email);

    // Check if user exists and password matches
    if (!user || user.password !== password) {
      setError('Invalid email or password!'); // This fixes the wrong password issue
      return;
    }

    // Success! Log them in
    login(user);

    // Redirect to main page
    history.push('/'); // This fixes the "does nothing" issue
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Welcome Back</h2>
        <p className="auth-subtitle">Sign in to continue to Movie Master</p>
        
        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="input-group">
            <label>Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your email" required />
          </div>
          <div className="input-group">
            <label>Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter your password" required />
          </div>
          <button type="submit" className="btn-primary">Sign In</button>
        </form>
        <p className="auth-redirect">Don't have an account? <Link to="/register">Register here</Link></p>
      </div>
    </div>
  );
};

export default SignIn;
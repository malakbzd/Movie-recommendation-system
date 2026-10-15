// src/pages/Register.jsx
import React, { useState, useContext } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import './../scss/auth.scss';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  
  // We only need login if we want to auto-login. We'll remove it from the submit logic.
  const { login } = useContext(AuthContext);
  const history = useHistory();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    // 1. Check if passwords match
    if (password !== confirmPassword) {
      setError('Passwords do not match!');
      return;
    }

    // 2. Check if user already exists
    const users = JSON.parse(localStorage.getItem('moviemaster_users') || '[]');
    if (users.find(u => u.email === email)) {
      setError('An account with this email already exists!');
      return;
    }

    // 3. Save new user to "database"
    const newUser = { name, email, password, favorites: [] };
    users.push(newUser);
    localStorage.setItem('moviemaster_users', JSON.stringify(users));

    // 4. Redirect them to the Sign In page instead of auto-logging them in
    alert('Registration successful! Please sign in.');
    history.push('/signin'); 
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Create an Account</h2>
        <p className="auth-subtitle">Join Movie Master today</p>
        
        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="input-group">
            <label>Full Name</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="John Doe" required />
          </div>
          <div className="input-group">
            <label>Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="john@example.com" required />
          </div>
          <div className="input-group">
            <label>Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Create a password" required />
          </div>
          <div className="input-group">
            <label>Confirm Password</label>
            <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Confirm your password" required />
          </div>
          <button type="submit" className="btn-primary">Register</button>
        </form>
        <p className="auth-redirect">Already have an account? <Link to="/signin">Sign In here</Link></p>
      </div>
    </div>
  );
};

export default Register;
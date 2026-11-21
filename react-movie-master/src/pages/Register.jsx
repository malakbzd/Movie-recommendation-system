import React, { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import './../scss/auth.scss';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const history = useHistory();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) return setError('Passwords do not match!');

    try {
      const res = await fetch('http://localhost:3001/users');
      const users = await res.json();
      
      if (users.find(u => u.email === email)) {
        return setError('Email already exists!');
      }

      const newUser = { name, email, password, watchlist: [] };
      
      // POST to the real database
      await fetch('http://localhost:3001/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUser)
      });

      alert('Registration successful! Please sign in.');
      history.push('/signin');
    } catch (err) {
      setError('Server error. Is json-server running?');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Create Account</h2>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="input-group"><label>Name</label><input type="text" value={name} onChange={e => setName(e.target.value)} required /></div>
          <div className="input-group"><label>Email</label><input type="email" value={email} onChange={e => setEmail(e.target.value)} required /></div>
          <div className="input-group"><label>Password</label><input type="password" value={password} onChange={e => setPassword(e.target.value)} required /></div>
          <div className="input-group"><label>Confirm</label><input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required /></div>
          <button type="submit" className="btn-primary">Register</button>
        </form>
        <p className="auth-redirect">Have an account? <Link to="/signin">Sign In</Link></p>
      </div>
    </div>
  );
};
export default Register;
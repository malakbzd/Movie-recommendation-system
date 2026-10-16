// src/pages/Preferences.jsx
import React, { useState, useContext, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import './../scss/auth.scss';

const Preferences = () => {
  const { currentUser, updatePreferences } = useContext(AuthContext);
  const [error, setError] = useState('');
  const history = useHistory();

  // If not logged in, kick them to signin
  useEffect(() => {
    if (!currentUser) {
      history.push('/signin');
    }
  }, [currentUser, history]);

  const handleSave = () => {
    const favorites = currentUser?.favorites || [];
    if (favorites.length < 2) {
      setError("You need to favorite at least 2 movies to continue!");
      return;
    }
    // User already toggled favorites on the Detail page, so we just save and proceed
    history.push('/'); 
  };

  return (
    <div className="auth-container" style={{ minHeight: '100vh', paddingTop: '100px', display: 'block' }}>
      <div className="auth-card" style={{ maxWidth: '800px' }}>
        <h2>Welcome, {currentUser?.name}!</h2>
        <p className="auth-subtitle">
          You need to favorite at least 2 movies so we can recommend better films. 
          Go browse the Home page and click "Add to Favorites" on movies you like!
        </p>
        
        {error && <div className="error-message">{error}</div>}

        <h3 style={{ marginBottom: '20px' }}>Your Favorites ({currentUser?.favorites?.length || 0}/2)</h3>
        
        {currentUser?.favorites?.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '20px', marginBottom: '30px' }}>
            {currentUser.favorites.map(movie => (
              <div key={movie.id} style={{ textAlign: 'center', backgroundColor: '#2b2b2b', padding: '10px', borderRadius: '8px' }}>
                <img 
                  src={`https://image.tmdb.org/t/p/w200${movie.poster}`} 
                  alt={movie.title} 
                  style={{ width: '100%', borderRadius: '4px', marginBottom: '10px' }} 
                />
                <h4 style={{ fontSize: '14px' }}>{movie.title}</h4>
              </div>
            ))}
          </div>
        ) : (
          <p style={{ color: '#a0a0a0', marginBottom: '30px' }}>You haven't favorited any movies yet.</p>
        )}

        <button className="btn-primary" onClick={handleSave} style={{ width: '100%' }}>
          Continue to Site
        </button>
      </div>
    </div>
  );
};

export default Preferences;
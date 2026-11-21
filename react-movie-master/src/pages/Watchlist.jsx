// src/pages/Watchlist.jsx
import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { category } from '../api/tmdbApi';
import * as Config from "../constants/Config";
import apiConfig from '../api/apiConfig';
import './../scss/watchlist.scss';

const Watchlist = () => {
  const { currentUser } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('want'); 

  if (!currentUser) {
    return (
      <div className="container" style={{ paddingTop: '150px', textAlign: 'center' }}>
        <h2>Please Sign In to view your Watchlist.</h2>
      </div>
    );
  }

  const displayedMovies = currentUser.watchlist?.filter(
    m => m && m.id && m.status === activeTab
  ) || [];

  return (
    <div className="container watchlist-container">
      <h1>My Watchlist</h1>

      <div className="watchlist-tabs">
        <button 
          className={`tab-btn ${activeTab === 'want' ? 'active' : ''}`}
          onClick={() => setActiveTab('want')}
        >
          Want to Watch
        </button>
        <button 
          className={`tab-btn ${activeTab === 'watched' ? 'active' : ''}`}
          onClick={() => setActiveTab('watched')}
        >
          Watched
        </button>
      </div>

      {/* CHANGED CLASS NAME HERE */}
      <div className="watchlist-grid">
        {displayedMovies.length === 0 ? (
          <p style={{ color: '#888', fontSize: '1.2rem' }}>No movies in this list yet.</p>
        ) : (
          displayedMovies.map((movie, index) => (
            <Link 
              to={`/${Config.HOME_PAGE}/${category.movie}/${movie.id}`} 
              key={`${movie.id}-${index}`} 
              className="watchlist-card" // CHANGED CLASS NAME HERE
            >
              <img 
                src={movie.poster ? apiConfig.w500Image(movie.poster) : 'https://placehold.co/500x750/1f1f1f/ffffff?text=No+Image'} 
                alt={movie.title || 'Movie'} 
                onError={(e) => { 
                  e.target.onerror = null; 
                  e.target.src = 'https://placehold.co/500x750/1f1f1f/ffffff?text=No+Image'; 
                }}
              />
              <h3>{movie.title || 'Unknown Title'}</h3>
            </Link>
          ))
        )}
      </div>
    </div>
  );
};

export default Watchlist;
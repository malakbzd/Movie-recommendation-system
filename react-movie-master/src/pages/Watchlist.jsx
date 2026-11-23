// src/pages/Watchlist.jsx
import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { category } from '../api/tmdbApi';
import * as Config from "../constants/Config";
import apiConfig from '../api/apiConfig';
import { useRecommendations } from '../hooks/useRecommendations';
import './../scss/watchlist.scss';

const Watchlist = () => {
  const { currentUser } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('want');

  const watchlist = currentUser?.watchlist || [];
  const watchedMovies = watchlist.filter(m => m && m.id && m.status === 'watched');

  const displayedMovies = watchlist.filter(
    m => m && m.id && m.status === activeTab
  );

  const { recommendedMovies, loadingRecs } = useRecommendations(currentUser, 12);

  if (!currentUser) {
    return (
      <div className="container" style={{ paddingTop: '150px', textAlign: 'center' }}>
        <h2>Please Sign In to view your Watchlist.</h2>
      </div>
    );
  }

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

      <div className="watchlist-grid">
        {displayedMovies.length === 0 ? (
          <p style={{ color: '#888', fontSize: '1.2rem' }}>No movies in this list yet.</p>
        ) : (
          displayedMovies.map((movie, index) => (
            <Link 
              to={`/${Config.HOME_PAGE}/${category.movie}/${movie.id}`} 
              key={`${movie.id}-${index}`} 
              className="watchlist-card"
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

      <div className="recommendations-section" style={{ marginTop: '3rem' }}>
        <h2>Recommended For You (Based on Watched)</h2>
        {watchedMovies.length === 0 ? (
          <p style={{ color: '#888', fontSize: '1rem' }}>
            Mark movies as Watched to get personalized recommendations.
          </p>
        ) : loadingRecs ? (
          <p style={{ color: '#888', fontSize: '1rem' }}>Loading recommendations...</p>
        ) : recommendedMovies.length === 0 ? (
          <p style={{ color: '#888', fontSize: '1rem' }}>No new recommendations available right now.</p>
        ) : (
          <div className="watchlist-grid">
            {recommendedMovies.map((movie) => (
              <Link
                to={`/${Config.HOME_PAGE}/${category.movie}/${movie.id}`}
                key={`rec-${movie.id}`}
                className="watchlist-card"
              >
                <img
                  src={movie.poster ? apiConfig.w500Image(movie.poster) : 'https://placehold.co/500x750/1f1f1f/ffffff?text=No+Image'}
                  alt={movie.title}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://placehold.co/500x750/1f1f1f/ffffff?text=No+Image';
                  }}
                />
                <h3>{movie.title}</h3>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Watchlist;
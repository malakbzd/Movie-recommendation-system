// src/pages/Home.jsx
import React, { useContext } from "react";
import { Link } from "react-router-dom";

import { OutlineButton } from "../components/button/Button";
import HeroSlide from "../components/hero-slide/HeroSlide";
import MovieList from "../components/movie-list/MovieList";

import { category } from "../api/tmdbApi";
import { AuthContext } from "../context/AuthContext";
import { useRecommendations } from "../hooks/useRecommendations";
import * as Config from "./../constants/Config";

// Import your exact MovieLens top 10 dataset JSON file
import customGenreData from "../components/movie-grid/top10_movies_by_genre.json";

const Home = () => {
  const { currentUser } = useContext(AuthContext);
  const { recommendedMovies, loadingRecs } = useRecommendations(currentUser, 12);

  // Grab specific genres from your JSON file safely (defaults to empty array if missing)
  const actionMovies = customGenreData["action"] || [];
  const dramaMovies = customGenreData["drama"] || [];
  const animationMovies = customGenreData["animation"] || [];
  const topRatedOverall = customGenreData["drama"] || [];

  return (
    <>
      <HeroSlide />

      <div className="container">
        
        {/* --- WATCHLIST BANNER START --- */}
        <div className="section mb-3" style={{ marginTop: '20px' }}>
          <div style={{ 
            background: 'linear-gradient(45deg, #1f1f1f, #333)', 
            padding: '30px', 
            borderRadius: '10px', 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center' 
          }}>
            <div>
              <h2 style={{ margin: 0 }}>Your Personal Watchlist</h2>
              <p style={{ color: '#aaa', marginTop: '5px' }}>Keep track of what you want to watch and what you've finished.</p>
            </div>
            <Link to={`/${Config.HOME_PAGE}/watchlist`}>
              <OutlineButton>View My Watchlist</OutlineButton>
            </Link>
          </div>
        </div>
        {/* --- WATCHLIST BANNER END --- */}

        {/* --- RECOMMENDED FOR YOU START --- */}
        {currentUser && (loadingRecs || recommendedMovies.length > 0) && (
          <div className="section mb-3">
            <div className="section__header mb-2">
              <h2>Recommended For You (Based on Watched)</h2>
              <Link to={`/${Config.HOME_PAGE}/watchlist`}>
                <OutlineButton className="small">View more</OutlineButton>
              </Link>
            </div>
            {loadingRecs ? (
              <p style={{ color: '#aaa' }}>Loading recommendations...</p>
            ) : (
              <MovieList category={category.movie} type="custom" movies={recommendedMovies} />
            )}
          </div>
        )}
        {/* --- RECOMMENDED FOR YOU END --- */}

        {/* Section 1: Top Rated Movies */}
        <div className="section mb-3">
          <div className="section__header mb-2">
            <h2>Top Rated Movies</h2>
            <Link to={`/${Config.HOME_PAGE}/movie/genre/drama`}>
              <OutlineButton className="small">View more</OutlineButton>
            </Link>
          </div>
          <MovieList category={category.movie} type="custom" movies={topRatedOverall} />
        </div>

        {/* Section 2: Top Rated Action Movies */}
        <div className="section mb-3">
          <div className="section__header mb-2">
            <h2>Top Rated Action Movies</h2>
            <Link to={`/${Config.HOME_PAGE}/movie/genre/action`}>
              <OutlineButton className="small">View more</OutlineButton>
            </Link>
          </div>
          <MovieList category={category.movie} type="custom" movies={actionMovies} />
        </div>

        {/* Section 3: Top Rated Drama Movies */}
        <div className="section mb-3">
          <div className="section__header mb-2">
            <h2>Top Rated Drama Movies</h2>
            <Link to={`/${Config.HOME_PAGE}/movie/genre/drama`}>
              <OutlineButton className="small">View more</OutlineButton>
            </Link>
          </div>
          <MovieList category={category.movie} type="custom" movies={dramaMovies} />
        </div>

        {/* Section 4: Top Rated Animation */}
        <div className="section mb-3">
          <div className="section__header mb-2">
            <h2>Top Rated Animation</h2>
            <Link to={`/${Config.HOME_PAGE}/movie/genre/animation`}>
              <OutlineButton className="small">View more</OutlineButton>
            </Link>
          </div>
          <MovieList category={category.movie} type="custom" movies={animationMovies} />
        </div>
      </div>
    </>
  );
};

export default Home;
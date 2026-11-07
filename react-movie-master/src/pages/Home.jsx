import React from "react";
import { Link } from "react-router-dom";

import { OutlineButton } from "../components/button/Button";
import HeroSlide from "../components/hero-slide/HeroSlide";
import MovieList from "../components/movie-list/MovieList";

import { category } from "../api/tmdbApi";
import * as Config from "./../constants/Config";

// Import your exact MovieLens top 10 dataset JSON file
import customGenreData from "../components/movie-grid/top10_movies_by_genre.json";

const Home = () => {
  // Grab specific genres from your JSON file safely (defaults to empty array if missing)
  const actionMovies = customGenreData["action"] || [];
  const dramaMovies = customGenreData["drama"] || [];
  const animationMovies = customGenreData["animation"] || [];
  const topRatedOverall = customGenreData["drama"] || []; // Or whichever genre represents your top tier

  return (
    <>
      <HeroSlide />

      <div className="container">
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
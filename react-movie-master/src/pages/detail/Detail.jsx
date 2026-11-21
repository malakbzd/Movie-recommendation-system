// src/pages/detail/Detail.jsx
import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router";
import { AuthContext } from "../../context/AuthContext";
import tmdbApi from "./../../api/tmdbApi";
import apiConfig from "../../api/apiConfig";
import "./detail.scss";
import CastList from "./CastList";
import VideoList from "./VideoList";
import MovieList from "./../../components/movie-list/MovieList";

const Detail = () => {
  const { category, id } = useParams();
  const [item, setItem] = useState(null);
  const [hasError, setHasError] = useState(false);
  const { currentUser, updateWatchStatus } = useContext(AuthContext);

  useEffect(() => {
    const getDetail = async () => {
      try {
        setHasError(false);
        const response = await tmdbApi.detail(category, id, { params: {} });
        setItem(response);
        window.scrollTo(0, 0);
      } catch (err) {
        setHasError(true);
      }
    };
    getDetail();
  }, [category, id]);

  // Find if this movie is in the user's watchlist and what status it has
  const watchItem = currentUser?.watchlist?.find((fav) => fav.id === item?.id);
  const currentStatus = watchItem ? watchItem.status : null;

  const handleWatchClick = (status) => {
    if (!currentUser) {
      alert("Please sign in to use your watchlist!");
      return;
    }
    // If clicking the same status, remove it. Otherwise, set new status.
    updateWatchStatus(item, currentStatus === status ? 'remove' : status);
  };

  if (hasError) return <div className="container text-center mt-5"><h2>Movie details could not be loaded.</h2></div>;

  return (
    <>
      {item && (
        <>
          <div className="banner" style={{ backgroundImage: `url(${apiConfig.originalImage(item.backdrop_path || item.poster_path)})` }}></div>
          <div className="mb-3 movie-content container">
            <div className="movie-content__poster">
              <div className="movie-content__poster__img" style={{ backgroundImage: `url(${apiConfig.originalImage(item.poster_path || item.backdrop_path)})` }}></div>
            </div>
            <div className="movie-content__info">
              <div className="title-wrapper">
                <h1 className="title">{item.title || item.name}</h1>
                
                {/* WATCHLIST BUTTONS */}
                <div className="watch-buttons">
                  <button 
                    className={`btn-watch ${currentStatus === 'want' ? 'active want' : ''}`}
                    onClick={() => handleWatchClick('want')}
                  >
                    {currentStatus === 'want' ? '✓ In Watchlist' : '+ Want to Watch'}
                  </button>
                  <button 
                    className={`btn-watch ${currentStatus === 'watched' ? 'active watched' : ''}`}
                    onClick={() => handleWatchClick('watched')}
                  >
                    {currentStatus === 'watched' ? '✓ Watched' : 'Mark as Watched'}
                  </button>
                </div>

              </div>
              <div className="genres">
                {item.genres && item.genres.slice(0, 5).map((genre, index) => (
                  <span key={index} className="genres__item">{genre.name}</span>
                ))}
              </div>
              <p className="overview">{item.overview}</p>
              <div className="cast">
                <div className="section__header"><h2>Casts</h2></div>
                <CastList id={item.id} />
              </div>
            </div>
          </div>
          <div className="container">
            <div className="section mb-3"><VideoList id={item.id} /></div>
            <div className="section mb-3">
              <div className="section__header mb-2"><h2>Similar</h2></div>
              <MovieList category={category} type="similar" id={item.id} />
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Detail;
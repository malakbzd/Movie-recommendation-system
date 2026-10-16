// src/pages/detail/Detail.jsx
import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router";
import { AuthContext } from "../../context/AuthContext"; // Import AuthContext

import tmdbApi from "./../../api/tmdbApi";
import apiConfig from "../../api/apiConfig";

import "./detail.scss";
import CastList from "./CastList";
import VideoList from "./VideoList";
import MovieList from "./../../components/movie-list/MovieList";

const Detail = () => {
  const { category, id } = useParams();
  const [item, setItem] = useState(null);
  
  // Get user data and toggle function
  const { currentUser, toggleFavorite } = useContext(AuthContext);

  useEffect(() => {
    const getDetail = async () => {
      const response = await tmdbApi.detail(category, id, { params: {} });
      setItem(response);
      window.scrollTo(0, 0);
    };
    getDetail();
  }, [category, id]);

  // Check if this specific movie is already in the user's favorites
  const isFavorited = currentUser?.favorites?.some((fav) => fav.id === item?.id);

  return (
    <>
      {item && (
        <>
          <div
            className="banner"
            style={{
              backgroundImage: `url(${apiConfig.originalImage(
                item.backdrop_path || item.poster_path
              )})`,
            }}
          ></div>

          <div className="mb-3 movie-content container">
            <div className="movie-content__poster">
              <div
                className="movie-content__poster__img"
                style={{
                  backgroundImage: `url(${apiConfig.originalImage(
                    item.backdrop_path || item.poster_path
                  )})`,
                }}
              ></div>
            </div>

            <div className="movie-content__info">
              <div className="title-wrapper">
                <h1 className="title">{item.title || item.name}</h1>
                {/* NEW FAVORITE BUTTON */}
                <button 
                  className={`btn-favorite ${isFavorited ? 'active' : ''}`}
                  onClick={() => toggleFavorite(item)}
                >
                  {isFavorited ? '❤️ Favorited' : '🤍 Add to Favorites'}
                </button>
              </div>

              <div className="genres">
                {item.genres &&
                  item.genres.slice(0, 5).map((genre, index) => (
                    <span key={index} className="genres__item">
                      {genre.name}
                    </span>
                  ))}
              </div>
              <p className="overview">{item.overview}</p>
              <div className="cast">
                <div className="section__header">
                  <h2>Casts</h2>
                </div>
                <CastList id={item.id} />
              </div>
            </div>
          </div>

          <div className="container">
            <div className="section mb-3">
              <VideoList id={item.id} />
            </div>
            <div className="section mb-3">
              <div className="section__header mb-2">
                <h2>Similar</h2>
              </div>
              <MovieList category={category} type="similar" id={item.id} />
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Detail;
import React from "react";
import "./movie-card.scss";
import { Link } from "react-router-dom";
import Button from "../button/Button";
import { category } from "../../api/tmdbApi";
import apiConfig from "../../api/apiConfig";
import * as Config from "./../../constants/Config";

const MovieCard = (props) => {
  const item = props.item;

  // PRINT TO CONSOLE TO SEE WHICH MOVIE HAS A BAD ID
  const handleClick = () => {
    console.log("Clicked movie item:", item);
  };

  const catString = typeof props.category === 'string' 
    ? props.category 
    : (category[props.category] || 'movie');

  const link = `/${Config.HOME_PAGE}/${catString}/${item.id}`;

  const bg = (item.poster_path || item.backdrop_path)
    ? apiConfig.w500Image(item.poster_path || item.backdrop_path)
    : "https://via.placeholder.com/500x750?text=No+Image+Available";

  return (
    <Link to={link} onClick={handleClick}>
      <div className="movie-card" style={{ backgroundImage: `url(${bg})` }}>
        <Button>
          <i className="bx bx-play"></i>
        </Button>
      </div>
      <h3>{item.title || item.name}</h3>
    </Link>
  );
};

export default MovieCard;
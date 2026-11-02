import React, { useCallback, useEffect, useState } from "react";
import "./movie-grid.scss";
import { useHistory, useParams } from "react-router";
import MovieCard from "./../movie-card/MovieCard";
import tmdbApi, { category, movieType, tvType } from "../../api/tmdbApi";
import Button, { OutlineButton } from "../button/Button";
import Input from "../input/Input";
import * as Config from "./../../constants/Config";

import customGenreData from "./top10_movies_by_genre.json";

const MovieGrid = (props) => {
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(0);

  const { keyword, genreName } = useParams();

  useEffect(() => {
    const getList = async () => {
      if (genreName) {
        const genreMovies = customGenreData[genreName.toLowerCase()] || [];
        console.log("Raw movies from JSON for genre:", genreName, genreMovies);

        // Fetch posters from TMDB with cleaned titles
        const enrichedMovies = await Promise.all(
          genreMovies.map(async (movie) => {
            try {
              // Remove the year in parentheses (e.g., "Toy Story (1995)" -> "Toy Story")
              const cleanTitle = movie.title ? movie.title.replace(/\s*\(\d{4}\)$/, "").trim() : movie.title;
              
              const response = await tmdbApi.search(props.category, {
                params: { query: cleanTitle },
              });
              
              console.log(`Searching TMDB for: "${cleanTitle}"`, response);
              const match = response.results && response.results[0];
              
              return {
                ...movie,
                id: match ? match.id : movie.id,
                poster_path: match ? match.poster_path : null,
                backdrop_path: match ? match.backdrop_path : null,
              };
            } catch (err) {
              console.error("Error fetching poster for:", movie.title, err);
              return movie;
            }
          })
        );

        console.log("Enriched movies with posters:", enrichedMovies);
        setItems(enrichedMovies);
        setTotalPage(1);
      } else if (keyword === undefined) {
        const params = {};
        let response = null;
        switch (props.category) {
          case category.movie:
            response = await tmdbApi.getMoviesList(movieType.upcoming, { params });
            break;
          default:
            response = await tmdbApi.getTvList(tvType.popular, { params });
        }
        setItems(response.results);
        setTotalPage(response.total_pages);
      } else {
        const params = { query: keyword };
        const response = await tmdbApi.search(props.category, { params });
        setItems(response.results);
        setTotalPage(response.total_pages);
      }
    };
    getList();
  }, [keyword, genreName, props.category]);

  const loadMore = useCallback(async () => {
    // Pagination placeholder
  }, []);

  return (
    <>
      <div className="section mb-3">
        {props.isGenre ? (
          <MovieGenre category={props.category} />
        ) : (
          <MovieSearch category={props.category} keyword={keyword} />
        )}
      </div>
      <div className="movie-grid">
        {items.map((item, index) => (
          <MovieCard key={index} category={props.category} item={item} />
        ))}
      </div>
      {page < totalPage ? (
        <div className="movie-grid__loadmore">
          <OutlineButton className="small" onClick={loadMore}>
            Load more
          </OutlineButton>
        </div>
      ) : (
        ""
      )}
    </>
  );
};

const MovieSearch = (props) => {
  const history = useHistory();
  const [keyword, setKeyword] = useState(props.keyword ? props.keyword : "");

  const goToSearch = useCallback(() => {
    if (keyword.trim().length > 0) {
      history.push(
        `/${Config.HOME_PAGE}/${category[props.category]}/search/${keyword}`
      );
    }
  }, [keyword, props.category, history]);

  useEffect(() => {
    const enterEvent = (e) => {
      e.preventDefault();
      if (e.keyCode === 13) {
        goToSearch();
      }
    };
    document.addEventListener("keyup", enterEvent);
    return () => {
      document.removeEventListener("keyup", enterEvent);
    };
  }, [goToSearch]);

  return (
    <div className="movie-search">
      <Input
        type="text"
        placeholder="Enter keyword"
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
      />
      <Button className="small" onClick={goToSearch}>
        Search
      </Button>
    </div>
  );
};

const MovieGenre = (props) => {
  const history = useHistory();
  const [genre, setGenre] = useState("");

  const genres = [
    "Action", "Adventure", "Animation", "Children's", "Comedy", "Crime",
    "Documentary", "Drama", "Fantasy", "Film-Noir", "Horror", "Musical",
    "Mystery", "Romance", "Sci-Fi", "Thriller", "War", "Western"
  ];

  const handleGenreChange = (e) => {
    const selectedGenre = e.target.value;
    setGenre(selectedGenre);
    if (selectedGenre) {
      history.push(
        `/${Config.HOME_PAGE}/${category[props.category]}/genre/${selectedGenre.toLowerCase()}`
      );
    }
  };

  return (
    <div className="movie-genre">
      <select value={genre} onChange={handleGenreChange}>
        <option value="">Select a genre</option>
        {genres.map((item) => (
          <option key={item} value={item}>
            {item}
          </option>
        ))}
      </select>
    </div>
  );
};

export default MovieGrid;
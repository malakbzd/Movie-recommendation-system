import React, { useCallback, useEffect, useState } from "react";
import "./movie-grid.scss";
import { useHistory, useParams } from "react-router";
import MovieCard from "./../movie-card/MovieCard";
import tmdbApi, { category } from "../../api/tmdbApi";
import Button, { OutlineButton } from "../button/Button";
import Input from "../input/Input";
import * as Config from "./../../constants/Config";

import customGenreData from "./top10_movies_by_genre.json";

const MovieGrid = (props) => {
  const [items, setItems] = useState([]);
  const [totalPage, setTotalPage] = useState(0);

  const { keyword, genreName } = useParams();

  useEffect(() => {
    const getList = async () => {
      if (genreName) {
        const genreMovies = customGenreData[genreName.toLowerCase()] || [];

        // Fetch valid TMDB IDs and posters with cleaned titles
        const enrichedMovies = await Promise.all(
          genreMovies.map(async (movie) => {
            try {
              const cleanTitle = movie.title ? movie.title.replace(/\s*\(\d{4}\)$/, "").trim() : movie.title;
              
              const response = await tmdbApi.search(props.category, {
                params: { query: cleanTitle },
              });
              
              const match = response.results && response.results[0];
              
              if (match && match.id && match.poster_path) {
                return {
                  ...movie,
                  id: match.id,
                  title: match.title || match.name || cleanTitle,
                  poster_path: match.poster_path,
                  backdrop_path: match.backdrop_path,
                };
              }
              return null;
            } catch (err) {
              return null;
            }
          })
        );

        const validMovies = enrichedMovies.filter(item => item !== null);
        setItems(validMovies);
        setTotalPage(1);
      } else if (keyword === undefined) {
        // --- LOAD YOUR LOCAL DATASET MOVIES BY DEFAULT ---
        const allDatasetMovies = [];
        Object.values(customGenreData).forEach(genreList => {
          if (Array.isArray(genreList)) {
            allDatasetMovies.push(...genreList);
          }
        });

        // Deduplicate movies by title
        const uniqueMovies = Array.from(
          new Map(allDatasetMovies.map(movie => [movie.title, movie])).values()
        );

        const enrichedMovies = await Promise.all(
          uniqueMovies.map(async (movie) => {
            try {
              const cleanTitle = movie.title ? movie.title.replace(/\s*\(\d{4}\)$/, "").trim() : movie.title;
              const response = await tmdbApi.search(props.category, {
                params: { query: cleanTitle },
              });
              const match = response.results && response.results[0];
              
              if (match && match.id && match.poster_path) {
                return {
                  ...movie,
                  id: match.id,
                  title: match.title || match.name || cleanTitle,
                  poster_path: match.poster_path,
                  backdrop_path: match.backdrop_path,
                };
              }
              return null;
            } catch (err) {
              return null;
            }
          })
        );

        const validMovies = enrichedMovies.filter(item => item !== null);
        setItems(validMovies);
        setTotalPage(1);
      } else {
        const params = { query: keyword };
        const response = await tmdbApi.search(props.category, { params });
        const results = response.results || [];
        setItems(results.filter(item => item && item.id && item.poster_path));
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
    </>
  );
};

const MovieSearch = (props) => {
  const history = useHistory();
  const [keyword, setKeyword] = useState(props.keyword ? props.keyword : "");

  const goToSearch = useCallback(() => {
    if (keyword.trim().length > 0) {
      history.push(
        `/${Config.HOME_PAGE}/${category[props.category] || 'movie'}/search/${keyword}`
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
  const { genreName } = useParams();
  const [genre, setGenre] = useState("");

  const genres = [
    "Action", "Adventure", "Animation", "Children's", "Comedy", "Crime",
    "Documentary", "Drama", "Fantasy", "Film-Noir", "Horror", "Musical",
    "Mystery", "Romance", "Sci-Fi", "Thriller", "War", "Western"
  ];

  useEffect(() => {
    if (genreName) {
      const found = genres.find(g => g.toLowerCase() === genreName.toLowerCase());
      if (found) {
        setGenre(found);
      }
    }
  }, [genreName]);

  const handleGenreChange = (e) => {
    const selectedGenre = e.target.value;
    setGenre(selectedGenre);
    if (selectedGenre) {
      history.push(
        `/${Config.HOME_PAGE}/${category[props.category] || 'movie'}/genre/${selectedGenre.toLowerCase()}`
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
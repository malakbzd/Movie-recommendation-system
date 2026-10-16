import React from "react";
import { useParams } from "react-router";
import MovieGrid from "../components/movie-grid/MovieGrid";
import PageHeader from "../components/page-header/PageHeader";
import { category as cate } from "./../api/tmdbApi";

const Catalog = () => {
  const { category } = useParams();

  // Matches your header condition: if it's not a movie, treat it as the genre page
  const isGenre = category !== cate.movie;

  return (
    <>
      <PageHeader>
        {category === cate.movie ? "Movies" : "Movie Genre"}
      </PageHeader>

      <div className="container">
        <div className="section mb-3">
          <MovieGrid category={category} isGenre={isGenre} />
        </div>
      </div>
    </>
  );
};

export default Catalog;
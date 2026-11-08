
import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import MovieCard from "../components/movie-card/MovieCard";
import "./favorites.scss";

const Favorites = () => {
    const { currentUser } = useContext(AuthContext);

    const favorites = currentUser?.favorites || [];

    return (
        <div className="favorites-page container">
            <div className="favorites-header">
               
            </div>

            {!currentUser ? (
                <div className="favorites-empty">
                    <h2>Please sign in to see your favorites.</h2>
                </div>
            ) : favorites.length === 0 ? (
                <div className="favorites-empty">
                    <h2>No favorite movies yet!</h2>
                    <p>Explore movies and add them to your favorites.</p>
                </div>
            ) : (
                <div className="favorites-grid">
                  {favorites.map((movie) => (
    <div key={movie.id} className="favorites-item">
        <MovieCard
            category="movie"
            item={{
                ...movie,
                poster_path:
                    movie.poster_path ||
                    movie.poster ||
                    movie.backdrop_path
            }}
        />
    </div>
))}
                </div>
            )}
        </div>
    );
};

export default Favorites;

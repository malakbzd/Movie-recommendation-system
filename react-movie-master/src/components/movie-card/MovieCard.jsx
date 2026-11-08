import React from 'react';
import './movie-card.scss';
import { Link } from 'react-router-dom';
import Button from '../button/Button';
import { category } from '../../api/tmdbApi';
import apiConfig from '../../api/apiConfig';
import * as Config from '../../constants/Config';

const MovieCard = (props) => {
    const item = props.item;

    // Safely handle whether poster_path is a relative path or a full URL
    const getImageUrl = (path) => {
        if (!path) return '';
        if (path.startsWith('http')) return path;
        return apiConfig.w500Image(path);
    };

    const bg = getImageUrl(item.poster_path || item.backdrop_path);

    const link = `/${Config.HOME_PAGE}/${category[props.category] || 'movie'}/${item.id}`;

    return (
        <Link to={link}>
            <div className="movie-card" style={{ backgroundImage: `url(${bg})` }}>
                <Button>
                    <i className="bx bx-play"></i>
                </Button>
            </div>
            <h3>{item.title || item.name}</h3>
        </Link>
    );
}

export default MovieCard;
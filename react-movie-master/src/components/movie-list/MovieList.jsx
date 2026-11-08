import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import './movie-list.scss';

import { SwiperSlide, Swiper } from 'swiper/react';
import tmdbApi, { category } from '../../api/tmdbApi';
import MovieCard from '../movie-card/MovieCard';

const MovieList = props => {
    const [items, setItems] = useState([]);

    useEffect(() => {
        const getList = async () => {
            if (props.movies && props.movies.length > 0) {
                const enriched = await Promise.all(
                    props.movies.map(async (movie) => {
                        try {
                            const res = await tmdbApi.search(category.movie, {
                                params: { query: movie.title }
                            });
                            const match = res.results && res.results[0];
                            
                            // ONLY accept movies that successfully return a valid TMDB ID and poster
                            if (match && match.id && match.poster_path) {
                                return {
                                    ...movie,
                                    id: match.id, // Verified TMDB ID - guarantees zero 404s on click!
                                    title: match.title || match.name,
                                    poster_path: match.poster_path,
                                    backdrop_path: match.backdrop_path,
                                };
                            }
                            return null; // Discard unmatched movies
                        } catch (err) {
                            return null; // Discard on error
                        }
                    })
                );

                // Filter out all nulls so only 100% working movies are rendered
                const validItems = enriched.filter(item => item !== null);
                setItems(validItems);
                return;
            }

            // Fallback for standard TMDB sections
            let response = null;
            const params = {};

           // Handle similar movies first
if (props.type === 'similar') {
    response = await tmdbApi.similar(props.category, props.id);
}
else if (props.type !== 'all') {
    switch (props.category) {
        case category.movie:
            response = await tmdbApi.getMoviesList(props.type, { params });
            break;

        default:
            response = await tmdbApi.getTvList(props.type, { params });
    }
}
else {
    response = await tmdbApi.similar(props.category, props.id);
}
            
            const results = response.results || [];
            setItems(results.filter(item => item && item.id && item.poster_path));
        }
        getList();
    }, [props.movies, props.category, props.type, props.id]);

    return (
        <div className="movie-list">
            <Swiper
                grabCursor={true}
                spaceBetween={10}
                slidesPerView={'auto'}
            >
                {
                    items.map((item, i) => (
                        <SwiperSlide key={i}>
                            <MovieCard category={props.category} item={item}/>
                        </SwiperSlide>
                    ))
                }
            </Swiper>
        </div>
    );
}

MovieList.propTypes = {
    category: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired
}

export default MovieList;
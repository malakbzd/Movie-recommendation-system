import React, { useState, useEffect, useRef } from 'react';
import SwiperCore, { Autoplay } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import { useHistory } from 'react-router-dom';

import tmdbApi, { category } from '../../api/tmdbApi';
import apiConfig from '../../api/apiConfig';
import Button, { OutlineButton } from '../button/Button';
import Modal, { ModalContent } from '../modal/Modal';
import * as Config from '../../constants/Config';

import './hero-slide.scss';

import customDataset from '../movie-grid/top10_movies_by_genre.json'; 

const HeroSlide = () => {
    SwiperCore.use([Autoplay]);

    const [movieItems, setMovieItems] = useState([]);

    useEffect(() => {
        const getDatasetMovies = async () => {
            try {
                const allDatasetMovies = [];
                Object.values(customDataset).forEach(genreList => {
                    if (Array.isArray(genreList)) {
                        allDatasetMovies.push(...genreList);
                    }
                });

                const sampleMovies = allDatasetMovies.slice(0, 8);

                const enriched = await Promise.all(
                    sampleMovies.map(async (movie) => {
                        try {
                            const cleanTitle = movie.title ? movie.title.replace(/\s*\(\d{4}\)$/, "").trim() : movie.title;
                            const response = await tmdbApi.search(category.movie, {
                                params: { query: cleanTitle }
                            });
                            const match = response.results && response.results[0];

                            if (match && match.id && match.backdrop_path) {
                                return {
                                    ...movie,
                                    id: match.id,
                                    title: match.title || cleanTitle,
                                    overview: match.overview || movie.overview,
                                    backdrop_path: match.backdrop_path,
                                    poster_path: match.poster_path
                                };
                            }
                            return null;
                        } catch (err) {
                            return null;
                        }
                    })
                );

                const validMovies = enriched.filter(item => item !== null);
                setMovieItems(validMovies);
            } catch (error) {
                console.error("Error loading dataset for hero slide:", error);
            }
        };

        getDatasetMovies();
    }, []);

    return (
        <div className="hero-slide">
            <Swiper
                modules={[Autoplay]}
                grabCursor={true}
                spaceBetween={0}
                slidesPerView={1}
            >
                {
                    movieItems.map((item, i) => (
                        <SwiperSlide key={i}>
                            {({ isActive }) => (
                                <HeroSlideItem item={item} className={`${isActive ? 'active' : ''}`} />
                            )}
                        </SwiperSlide>
                    ))
                }
            </Swiper>
            {
                movieItems.map((item, i) => (
                    <TrailerModal key={i} item={item} />
                ))
            }
        </div>
    );
}

const HeroSlideItem = props => {
    let history = useHistory();
    const item = props.item;

    const background = apiConfig.originalImage(item.backdrop_path ? item.backdrop_path : item.poster_path);

    const navigateToDetail = () => {
        // Uses your app's correct HOME_PAGE route prefix
        history.push(`/${Config.HOME_PAGE}/movie/${item.id}`);
    };

    const setModalActive = async () => {
        const modal = document.querySelector(`#modal_${item.id}`);
        const iframeRef = modal.querySelector('iframe');

        try {
            const videos = await tmdbApi.getVideos(category.movie, item.id);
            if (videos.results && videos.results.length > 0) {
                const videSource = 'https://www.youtube.com/embed/' + videos.results[0].key;
                iframeRef.setAttribute('src', videSource);
            } else {
                iframeRef.setAttribute('src', '');
            }
        } catch (err) {
            iframeRef.setAttribute('src', '');
        }

        modal.classList.toggle('active');
    };

    return (
        <div
            className={`hero-slide__item ${props.className}`}
            style={{backgroundImage: `url(${background})`}}
        >
            <div className="hero-slide__item__content container">
                <div className="hero-slide__item__content__info">
                    <h2 className="title">{item.title}</h2>
                    <div className="overview">{item.overview}</div>
                    <div className="btns">
                        <Button onClick={navigateToDetail}>
                            Watch now
                        </Button>
                        <OutlineButton onClick={setModalActive}>
                            Watch trailer
                        </OutlineButton>
                    </div>
                </div>
                <div className="hero-slide__item__content__poster">
                    <img src={apiConfig.w500Image(item.poster_path)} alt={item.title} />
                </div>
            </div>
        </div>
    );
}

const TrailerModal = props => {
    const item = props.item;
    const iframeRef = useRef(null);

    const onClose = () => {
        if (iframeRef.current) {
            iframeRef.current.setAttribute('src', '');
        }
    };

    return (
        <Modal active={false} id={`modal_${item.id}`}>
            <ModalContent onClose={onClose}>
                <iframe ref={iframeRef} width="100%" height="500px" title="trailer"></iframe>
            </ModalContent>
        </Modal>
    );
}

export default HeroSlide;
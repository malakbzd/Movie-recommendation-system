// src/pages/Catalog.jsx
import React from 'react';
import { useParams } from 'react-router';
import PageHeader from '../components/page-header/PageHeader';
import { category as cate } from '../api/tmdbApi';
import MovieGrid from '../components/movie-grid/MovieGrid';

const Catalog = (props) => {
    const { category } = useParams();

    const getPageTitle = () => {
        if (props.isGenre) {
            return 'Browse by Genre';
        }
        return category === cate.movie ? 'Movies' : 'TV Series';
    };

    return (
        <>
            <PageHeader>
                {getPageTitle()}
            </PageHeader>
            <div className="container">
                <div className="section mb-3">
                    {/* Explicitly pass isGenre down to MovieGrid */}
                    <MovieGrid category={category} isGenre={props.isGenre} />
                </div>
            </div>
        </>
    );
};

export default Catalog;
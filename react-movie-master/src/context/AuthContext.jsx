
// src/context/AuthContext.jsx
import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {
        const savedUser = localStorage.getItem('moviemaster_currentUser');

        if (savedUser) {
            setCurrentUser(JSON.parse(savedUser));
        }
    }, []);

    const login = (user) => {
        // Keep existing favorites when the user logs in again
        const users = JSON.parse(
            localStorage.getItem('moviemaster_users') || '[]'
        );

        const savedAccount = users.find(u => u.email === user.email);

        const updatedUser = {
            ...user,
            favorites: user.favorites || savedAccount?.favorites || []
        };

        setCurrentUser(updatedUser);
        localStorage.setItem(
            'moviemaster_currentUser',
            JSON.stringify(updatedUser)
        );
    };

    const logout = () => {
        setCurrentUser(null);
        localStorage.removeItem('moviemaster_currentUser');
    };

    const toggleFavorite = (movie) => {
        if (!currentUser) return;

        let updatedFavorites = [...(currentUser.favorites || [])];

        const exists = updatedFavorites.some(
            fav => fav.id === movie.id
        );

        if (exists) {
            // Remove from favorites
            updatedFavorites = updatedFavorites.filter(
                fav => fav.id !== movie.id
            );
        } else {
            // Add movie with its image paths
            updatedFavorites.push({
                id: movie.id,
                title: movie.title || movie.name,
                poster_path: movie.poster_path || movie.backdrop_path,
                backdrop_path: movie.backdrop_path || movie.poster_path
            });
        }

        const updatedUser = {
            ...currentUser,
            favorites: updatedFavorites
        };

        setCurrentUser(updatedUser);

        localStorage.setItem(
            'moviemaster_currentUser',
            JSON.stringify(updatedUser)
        );

        // Update users stored in localStorage
        const users = JSON.parse(
            localStorage.getItem('moviemaster_users') || '[]'
        );

        const userIndex = users.findIndex(
            u => u.email === currentUser.email
        );

        if (userIndex !== -1) {
            users[userIndex].favorites = updatedFavorites;

            localStorage.setItem(
                'moviemaster_users',
                JSON.stringify(users)
            );
        }
    };

    return (
        <AuthContext.Provider
            value={{ currentUser, login, logout, toggleFavorite }}
        >
            {children}
        </AuthContext.Provider>
    );
};

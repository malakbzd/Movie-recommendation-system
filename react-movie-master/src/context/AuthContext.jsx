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
    setCurrentUser(user);
    localStorage.setItem('moviemaster_currentUser', JSON.stringify(user));
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('moviemaster_currentUser');
  };

  // NEW: Toggle favorite directly from the Detail page
  const toggleFavorite = (movie) => {
    if (!currentUser) return; // Must be logged in

    let updatedFavorites = [...(currentUser.favorites || [])];
    const exists = updatedFavorites.find(fav => fav.id === movie.id);

    if (exists) {
      // Remove if already favorited
      updatedFavorites = updatedFavorites.filter(fav => fav.id !== movie.id);
    } else {
      // Add to favorites
      updatedFavorites.push({ 
        id: movie.id, 
        title: movie.title || movie.name, 
        poster: movie.poster_path || movie.backdrop_path 
      });
    }

    const updatedUser = { ...currentUser, favorites: updatedFavorites };
    setCurrentUser(updatedUser);
    localStorage.setItem('moviemaster_currentUser', JSON.stringify(updatedUser));

    // Update the "database" array
    const users = JSON.parse(localStorage.getItem('moviemaster_users') || '[]');
    const userIndex = users.findIndex(u => u.email === currentUser.email);
    if (userIndex !== -1) {
      users[userIndex].favorites = updatedFavorites;
      localStorage.setItem('moviemaster_users', JSON.stringify(users));
    }
  };

  return (
    <AuthContext.Provider value={{ currentUser, login, logout, toggleFavorite }}>
      {children}
    </AuthContext.Provider>
  );
};
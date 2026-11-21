// src/context/AuthContext.jsx
import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();
const API_URL = 'http://localhost:3001/users';

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);

  // On load, check if the user is already logged in (session memory)
  useEffect(() => {
    const savedUser = localStorage.getItem('moviemaster_session');
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    }
  }, []);

  const login = (user) => {
    setCurrentUser(user);
    // We still use localStorage to remember WHO is logged in, so they don't have to re-type it on refresh
    localStorage.setItem('moviemaster_session', JSON.stringify(user));
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('moviemaster_session');
  };

  // REAL DATABASE UPDATE
  const updateWatchStatus = async (movie, status) => {
    if (!currentUser) return;

    let watchlist = [...(currentUser.watchlist || [])];
    const existingIndex = watchlist.findIndex(item => item.id === movie.id);

    if (existingIndex !== -1) {
      if (status === 'remove') {
        watchlist.splice(existingIndex, 1);
      } else {
        watchlist[existingIndex].status = status; // Update status
      }
    } else if (status !== 'remove') {
      // FIXED: Changed .push() to .unshift() so new movies go to the TOP
      watchlist.unshift({
        id: movie.id,
        title: movie.title || movie.name,
        poster: movie.poster_path || movie.backdrop_path,
        status: status 
      });
    }

    const updatedUser = { ...currentUser, watchlist };
    setCurrentUser(updatedUser);
    localStorage.setItem('moviemaster_session', JSON.stringify(updatedUser));

    // Save to the REAL database (db.json)
    try {
      await fetch(`${API_URL}/${currentUser.id}`, {
        method: 'PATCH', // PATCH updates just the watchlist without deleting the password/email
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ watchlist })
      });
    } catch (error) {
      console.error("Failed to save to database. Is json-server running?", error);
    }
  };

  return (
    <AuthContext.Provider value={{ currentUser, login, logout, updateWatchStatus }}>
      {children}
    </AuthContext.Provider>
  );
};
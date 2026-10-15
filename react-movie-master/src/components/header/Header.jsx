// src/components/header/Header.jsx
import React, { useEffect, useRef, useContext } from "react";
import { Link, useLocation, useHistory } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import "./header.scss";
import logo from "./../../assets/logo.png";
import * as Config from "./../../constants/Config";

const headerNav = [
  { display: "Home", path: `/${Config.HOME_PAGE}` },
  { display: "Movies", path: `/${Config.HOME_PAGE}/movie` },
  { display: "Genre", path: `/${Config.HOME_PAGE}/tv` },
];

const Header = () => {
  const { pathname } = useLocation();
  const headerRef = useRef(null);
  const { currentUser, logout } = useContext(AuthContext);
  const history = useHistory();

  // Check if we are on an auth page
  const isAuthPage = pathname === '/signin' || pathname === '/register';

  const active = headerNav.findIndex((e) => e.path === pathname);

  useEffect(() => {
    const shrinkHeader = () => {
      if (document.body.scrollTop > 100 || document.documentElement.scrollTop > 100) {
        headerRef.current.classList.add("shrink");
      } else {
        headerRef.current.classList.remove("shrink");
      }
    };
    window.addEventListener("scroll", shrinkHeader);
    return () => window.removeEventListener("scroll", shrinkHeader);
  }, []);

  const handleLogout = () => {
    logout();
    history.push('/signin');
  };

  return (
    <div ref={headerRef} className="header">
      <div className="header__wrap container">
        <div className="logo">
          <img src={logo} alt="logo" />
          <Link to={`/${Config.HOME_PAGE}`}>MovieLens</Link>
        </div>

        {/* ONLY SHOW NAV AND AUTH BUTTONS IF NOT ON AUTH PAGE */}
        {!isAuthPage && (
          <>
            <ul className="header__nav">
              {headerNav.map((e, i) => (
                <li key={i} className={`${i === active ? "active" : ""}`}>
                  <Link to={e.path}>{e.display}</Link>
                </li>
              ))}
            </ul>

            <div className="header__auth">
              {currentUser ? (
                <>
                  <span style={{ fontSize: '1.4rem', fontWeight: 'bold' }}>Hi, {currentUser.name}</span>
                  <button onClick={handleLogout} className="header__auth-btn primary" style={{ border: 'none', cursor: 'pointer' }}>
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/signin" className="header__auth-btn">Sign In</Link>
                  <Link to="/register" className="header__auth-btn primary">Register</Link>
                </>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Header;
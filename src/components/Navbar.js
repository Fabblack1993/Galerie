import React from "react";
import { Link } from "react-router-dom";

const Navbar = ({ toggleDarkMode, darkMode, language, changeLanguage }) => {
  // Traductions des textes
  const translations = {
    fr: {
      brand: "Gal'Artiste",
      gallery: "Galerie",
      upload: "Uploader",
      profile: "Profil",
    },
    en: {
      brand: "Gal'Artiste",
      gallery: "Gallery",
      upload: "Upload",
      profile: "Profile",
    },
  };

  const t = translations[language]; // Texte en fonction de la langue

  return (
    <nav className={`navbar navbar-expand-lg ${darkMode ? "navbar-dark bg-dark" : "navbar-light bg-light"}`}>
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">{t.brand}</Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/gallery">{t.gallery}</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/upload-work">{t.upload}</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/user-profile">{t.profile}</Link>
            </li>
          </ul>
          <div className="d-flex align-items-center">
            {/* Bouton pour basculer le mode sombre */}
            <button onClick={toggleDarkMode} className="btn btn-secondary me-2">
              {darkMode ? "☀️" : "🌙 "}
            </button>

            {/* Sélecteur pour la langue */}
            <select
              value={language}
              onChange={(e) => changeLanguage(e.target.value)}
              className="form-select"
            >
              <option value="fr">🇫🇷 Français</option>
              <option value="en">🇬🇧 English</option>
            </select>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

            
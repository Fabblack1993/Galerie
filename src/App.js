import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";

import Home from "./pages/Home";
import UserProfile from "./pages/UserProfile";
import UploadWork from "./pages/UploadWork";
import Gallery from "./pages/Gallery";
import Signup from "./pages/SignUp";
import Confirm from "./pages/Confirm";
import Profile from "./pages/Profile";
import Footer from "./components/Footer";
import UserWall from "./pages/UserWall";
import UserShop from "./pages/UserShop";

const App = () => {
  const [darkMode, setDarkMode] = useState(false); // État pour le mode sombre
  const [language, setLanguage] = useState("fr"); // État pour la langue
  const userId = 123;

  // Fonction pour basculer entre mode sombre et mode clair
  const toggleDarkMode = () => setDarkMode((prevMode) => !prevMode);

  // Fonction pour changer la langue
  const changeLanguage = (lang) => setLanguage(lang);

  return (
    <Router>
      <div className={`app-container ${darkMode ? "dark-mode" : ""}`}>
        {/* Navbar avec les props */}
        <Navbar
          toggleDarkMode={toggleDarkMode}
          darkMode={darkMode}
          language={language}
          changeLanguage={changeLanguage}
        />

        {/* Routes avec les props globales */}
        <Routes>
          <Route path="/" element={<Home darkMode={darkMode} language={language} />} />
          <Route path="/user-profile" element={<UserProfile darkMode={darkMode} language={language} />} />
          <Route path="/upload-work" element={<UploadWork darkMode={darkMode} language={language} />} />
          <Route path="/gallery" element={<Gallery darkMode={darkMode} language={language} />} />
          <Route path="/signup" element={<Signup darkMode={darkMode} language={language} />} />
          <Route path="/confirm" element={<Confirm darkMode={darkMode} language={language} />} />
          <Route path="/profile" element={<Profile darkMode={darkMode} language={language} />} />
          <Route path="/profile/wall" element={<UserWall userId={userId} language={language} />} />
          <Route path="/profile/shop" element={<UserShop userId={userId} language={language} />} />
        
        </Routes>

        {/* Footer */}
        <Footer />
      </div>
    </Router>
  );
};

export default App;

import React, { useState, useEffect } from "react";
import "./UserProfile.css"; // Le fichier CSS spécifique à ce composant
import { Link } from "react-router-dom";


const UserProfile = ({ language }) => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    bio: "",
    profilePicture: "",
  });

  const [userWorks, setUserWorks] = useState([]);
  const [loading, setLoading] = useState(true); // Pour indiquer le chargement

  // Traductions
  const translations = {
    fr: {
      profileTitle: "Mon Profil",
      galleryTitle: "Mes Œuvres",
      loadingMessage: "Chargement des données...",
      noWorksMessage: "Vous n'avez pas encore ajouté d'œuvre.",
      usernameLabel: "Nom d'utilisateur",
      emailLabel: "Email",
      bioLabel: "Bio",
      
    },
    en: {
      profileTitle: "My Profile",
      galleryTitle: "My Works",
      loadingMessage: "Loading data...",
      noWorksMessage: "You haven't added any works yet.",
      usernameLabel: "Username",
      emailLabel: "Email",
      bioLabel: "Bio",
    },
  };

  const t = translations[language]; // Récupère les traductions selon la langue

  useEffect(() => {
    // Récupérer les données utilisateur depuis l'API backend
    fetch("http://localhost:5000/api/user-profile") // URL complète de l'API
      .then((res) => {
        if (!res.ok) {
          throw new Error(t.loadingMessage);
        }
        return res.json();
      })
      .then((data) => {
        // Mise à jour de l'état avec les données de l'API
        setFormData({
          username: data.username,
          email: data.email,
          bio: data.bio,
          profilePicture: data.profilePicture,
        });
        setUserWorks(data.works);
        setLoading(false); // Indique que le chargement est terminé
      })
      .catch((error) => {
        console.error("Erreur lors de la récupération des données :", error);
        setLoading(false); // Arrête le chargement même en cas d'échec
      });
  }, [t.loadingMessage]);

  if (loading) {
    return <p>{t.loadingMessage}</p>
      // Message temporaire pendant le chargement
  }

  return (
    <div className="profile-container">
      <h1 className="text-center text-4xl font-bold">{t.profileTitle}</h1>

      <div className="profile-picture-container">
        <img
          src={formData.profilePicture}
          alt="Profile"
          className="profile-picture"
        />
        <p className="text-lg font-semibold">{t.usernameLabel}: {formData.username}</p>
        <p>{t.emailLabel}: {formData.email}</p>
        <p>{t.bioLabel}: {formData.bio}</p>
       
       

      </div>
      <div className="profile-container">
      <h1>Mon Profil</h1>
      {/* Lien vers le mur */}
      <Link to="/profile/wall" className="btn btn-primary">
        Voir le mur
      </Link>
      <br />
      {/* Lien vers la boutique */}
      <Link to="/profile/shop" className="btn btn-primary">
        Voir la boutique
      </Link>
    </div>

      <div className="user-works mt-5">
        <h2 className="text-xl font-bold">{t.galleryTitle}</h2>
        {userWorks.length === 0 ? (
          <p>{t.noWorksMessage}</p>
        ) : (
          <div className="works-gallery">
            {userWorks.map((work) => (
              <div key={work.id} className="work-item">
                <img src={work.image} alt={work.title} className="work-image" />
                <p>{work.title}</p>
              </div>
              
            ))}
          </div>
          
        )}
      </div>
    </div>
  );
};

export default UserProfile;

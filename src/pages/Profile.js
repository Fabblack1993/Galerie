import React, { useState } from "react";
import profilePicture from "../assets/vibrant-background-with-clean-simple-designs-white-blue-orange-navy-teal_136558-1249.jpg";
import art1 from "../assets/Art1.jpg";
import art2 from "../assets/Art2.jpg";
import { useNavigate } from "react-router-dom";
import "./profile.css";

const Profile = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "Fabienne",
    email: "fabienne@example.com",
    bio: "Artiste passionnée par les couleurs et les formes.",
    profilePicture: profilePicture,
  });

  const [message, setMessage] = useState("");
  const [userWorks, setUserWorks] = useState([
    { id: 1, title: "Mon premier tableau", image: art1 },
    { id: 2, title: "Sculpture moderne", image: art2 },
  ]);

  // Gestion des champs du formulaire
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Enregistrement des données avec redirection
  const handleSubmit = (e) => {
    e.preventDefault();
    setMessage("Les modifications ont été enregistrées avec succès !");
    setTimeout(() => {
      setMessage("");
      navigate("/user-profile");
    }, 2000);
  };

  // Changer la photo de profil
  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setFormData({ ...formData, profilePicture: imageUrl });
    }
  };

  // Ajouter une œuvre
  const handleAddWork = (e) => {
    const file = e.target.files[0];
    const title = prompt("Entrez le titre de l'œuvre :");
    if (file && title) {
      const imageUrl = URL.createObjectURL(file);
      const newWork = { id: Date.now(), title, image: imageUrl };
      setUserWorks([...userWorks, newWork]);
    }
  };

  return (
    <div className="profile-container">
      <h1 className="text-center text-4xl font-bold">Mon Profil</h1>

      {/* Photo de profil */}
      <div className="profile-picture-container">
        <img
          src={formData.profilePicture}
          alt="profil"
          className="profile-picture"
        />
        <div className="button-container"> {/* Nouvelle div pour placer le bouton en bas */}
          <input
            type="file"
            accept="image/*"
            id="upload-profile-picture"
            style={{ display: "none" }}
            onChange={handleProfilePictureChange}
          />
          <label htmlFor="upload-profile-picture" className="btn btn-secondary mt-3">
            Changer de photo
          </label>
        </div>
      </div>

      {/* Formulaire */}
      <form onSubmit={handleSubmit} className="mt-5">
        <div className="form-group mb-3">
          <label htmlFor="username">Nom d'utilisateur</label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            className="form-control"
          />
        </div>
        <div className="form-group mb-3">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="form-control"
            disabled
          />
        </div>
        <div className="form-group mb-3">
          <label htmlFor="bio">Bio</label>
          <textarea
            id="bio"
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            className="form-control"
          ></textarea>
        </div>
        <button type="submit" className="btn btn-primary">Enregistrer</button>
      </form>

      {message && <p className="text-success text-center mt-4">{message}</p>}

      {/* Section Mes Œuvres */}
      <div className="user-works mt-5">
        <h2 className="text-xl font-bold">Mes Œuvres</h2>
        {userWorks.length === 0 ? (
          <p className="text-gray-600">Vous n'avez pas encore ajouté d'œuvre.</p>
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
        <input
          type="file"
          accept="image/*"
          id="add-work"
          style={{ display: "none" }}
          onChange={handleAddWork}
        />
        <label htmlFor="add-work" className="btn btn-light mt-3">
          Ajouter une œuvre
        </label>
      </div>
    </div>
  );
};

export default Profile;

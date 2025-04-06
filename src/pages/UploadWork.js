import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const UploadWork = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
  });
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const currentUserId = 123; // Simule un utilisateur connecté
  const navigate = useNavigate(); // Pour rediriger l'utilisateur après soumission réussie

  // Gestion des champs de formulaire
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Gestion du fichier
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      const allowedTypes = ["image/jpeg", "image/png", "image/gif"];
      if (!allowedTypes.includes(selectedFile.type)) {
        setMessage("Seuls les fichiers JPEG, PNG ou GIF sont autorisés.");
        return;
      }
      if (selectedFile.size > 2 * 1024 * 1024) {
        setMessage("La taille du fichier ne doit pas dépasser 2 Mo.");
        return;
      }
      setMessage(""); // Réinitialise le message si tout est valide
      setFile(selectedFile);
    }
  };

  // Gestion de la soumission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      setMessage("Veuillez sélectionner un fichier.");
      return;
    }

    if (!currentUserId) {
      alert("Vous devez être connecté pour uploader une photo !");
      return;
    }

    const data = new FormData();
    data.append("title", formData.title);
    data.append("description", formData.description);
    data.append("file", file);
    data.append("userId", currentUserId);

    try {
      const response = await fetch("http://localhost:5000/api/upload-work", {
        method: "POST",
        body: data,
      });
      const result = await response.json();

      if (result.success) {
        setMessage("Œuvre ajoutée avec succès !");
        setTimeout(() => {
          navigate("/gallery"); // Redirige vers la galerie après 2 secondes
        }, 2000);
      } else {
        setMessage("Erreur lors de l'ajout de l'œuvre.");
      }
    } catch (error) {
      console.error("Erreur de connexion au serveur :", error);
      setMessage("Erreur de connexion au serveur.");
    }
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Uploader une Œuvre</h1>
      {message && <div className="alert alert-info">{message}</div>}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="title" className="form-label">Titre</label>
          <input
            type="text"
            id="title"
            name="title"
            className="form-control"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="description" className="form-label">Description</label>
          <textarea
            id="description"
            name="description"
            className="form-control"
            value={formData.description}
            onChange={handleChange}
            required
          ></textarea>
        </div>
        <div className="mb-3">
          <label htmlFor="file" className="form-label">Fichier</label>
          <input
            type="file"
            id="file"
            className="form-control"
            onChange={handleFileChange}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">Soumettre</button>
      </form>
    </div>
  );
};

export default UploadWork;

    
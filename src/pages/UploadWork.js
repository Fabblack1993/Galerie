import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const UploadWork = ({ language }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
  });
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const currentUserId = 123;
  const navigate = useNavigate();

  const translations = {
    fr: {
      pageTitle: "Uploader une Œuvre",
      titleLabel: "Titre",
      descriptionLabel: "Description",
      fileLabel: "Fichier",
      submitButton: "Soumettre",
      successMessage: "Œuvre ajoutée avec succès !",
      errorMessage: "Erreur lors de l'ajout de l'œuvre.",
      fileRequired: "Veuillez sélectionner un fichier.",
      notLoggedIn: "Vous devez être connecté pour uploader une photo !",
      wrongType: "Seuls les fichiers JPEG, PNG ou GIF sont autorisés.",
      tooLarge: "La taille du fichier ne doit pas dépasser 2 Mo.",
      serverError: "Erreur de connexion au serveur.",
    },
    en: {
      pageTitle: "Upload a Work",
      titleLabel: "Title",
      descriptionLabel: "Description",
      fileLabel: "File",
      submitButton: "Submit",
      successMessage: "Work successfully added!",
      errorMessage: "Error while uploading the work.",
      fileRequired: "Please select a file.",
      notLoggedIn: "You must be logged in to upload a photo!",
      wrongType: "Only JPEG, PNG or GIF files are allowed.",
      tooLarge: "File size must not exceed 2MB.",
      serverError: "Server connection error.",
    },
  };

  const t = translations[language];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      const allowedTypes = ["image/jpeg", "image/png", "image/gif"];
      if (!allowedTypes.includes(selectedFile.type)) {
        setMessage(t.wrongType);
        return;
      }
      if (selectedFile.size > 2 * 1024 * 1024) {
        setMessage(t.tooLarge);
        return;
      }
      setMessage("");
      setFile(selectedFile);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      setMessage(t.fileRequired);
      return;
    }

    if (!currentUserId) {
      alert(t.notLoggedIn);
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
        setMessage(t.successMessage);
        setTimeout(() => {
          navigate("/gallery");
        }, 2000);
      } else {
        setMessage(t.errorMessage);
      }
    } catch (error) {
      console.error("Erreur de connexion au serveur :", error);
      setMessage(t.serverError);
    }
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">{t.pageTitle}</h1>
      {message && <div className="alert alert-info">{message}</div>}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="title" className="form-label">{t.titleLabel}</label>
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
          <label htmlFor="description" className="form-label">{t.descriptionLabel}</label>
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
          <label htmlFor="file" className="form-label">{t.fileLabel}</label>
          <input
            type="file"
            id="file"
            className="form-control"
            onChange={handleFileChange}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">{t.submitButton}</button>
      </form>
    </div>
  );
};

export default UploadWork;

    
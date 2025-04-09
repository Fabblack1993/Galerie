import React, { useState } from "react";

const Upload = ({ language }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);

  const translations = {
    fr: {
      pageTitle: "Uploader une œuvre",
      titleLabel: "Titre",
      descriptionLabel: "Description",
      imageLabel: "Image",
      submitButton: "Soumettre",
    },
    en: {
      pageTitle: "Upload a Work",
      titleLabel: "Title",
      descriptionLabel: "Description",
      imageLabel: "Image",
      submitButton: "Submit",
    },
  };

  const t = translations[language];

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({ title, description, image });
  };

  return (
    <div className="container mt-5">
      <h1 className="mb-4">{t.pageTitle}</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="title" className="form-label">{t.titleLabel}</label>
          <input
            type="text"
            id="title"
            className="form-control"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="description" className="form-label">{t.descriptionLabel}</label>
          <textarea
            id="description"
            className="form-control"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          ></textarea>
        </div>
        <div className="mb-3">
          <label htmlFor="image" className="form-label">{t.imageLabel}</label>
          <input
            type="file"
            id="image"
            className="form-control"
            onChange={(e) => setImage(e.target.files[0])}
          />
        </div>
        <button type="submit" className="btn btn-primary">{t.submitButton}</button>
      </form>
    </div>
  );
};

export default Upload;

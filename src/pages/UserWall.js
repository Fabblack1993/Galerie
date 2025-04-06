import React, { useState, useEffect } from "react";
import "./UserWall.css"

const UserWall = ({ userId, language }) => {
  const [posts, setPosts] = useState([]);
  const [newPostContent, setNewPostContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // Gérer les erreurs

  const translations = {
    fr: {
      wallTitle: "Mur de Publications",
      loadingMessage: "Chargement des publications...",
      noPostsMessage: "Aucune publication trouvée.",
      placeholder: "Écrivez quelque chose...",
      publishButton: "Publier",
      errorMessage: "Une erreur est survenue lors de la publication.",
    },
    en: {
      wallTitle: "User Wall",
      loadingMessage: "Loading posts...",
      noPostsMessage: "No posts found.",
      placeholder: "Write something...",
      publishButton: "Publish",
      errorMessage: "An error occurred while posting.",
    },
  };

  const t = translations[language];

  // Charger les publications existantes
  useEffect(() => {
    fetch(`http://localhost:5000/api/user-wall/${userId}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch posts");
        return res.json();
      })
      .then((data) => {
        setPosts(data.posts);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Erreur lors du chargement des publications :", error);
        setLoading(false);
        setError(t.errorMessage);
      });
  }, [userId, t.errorMessage]);

  // Gérer la soumission d'une nouvelle publication
  const handlePostSubmit = () => {
    if (!newPostContent.trim()) return; // Empêche la publication de contenu vide

    setError(null); // Réinitialise les erreurs
    fetch("http://localhost:5000/api/user-wall", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, content: newPostContent }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to post content");
        return res.json();
      })
      .then((data) => {
        setPosts((prevPosts) => [data.post, ...prevPosts]); // Ajoute la nouvelle publication
        setNewPostContent(""); // Vide le champ texte
      })
      .catch((error) => {
        console.error("Erreur lors de l'ajout de la publication :", error);
        setError(t.errorMessage); // Affiche une erreur
      });
  };

  if (loading) {
    return <p>{t.loadingMessage}</p>;
  }

  return (
    <div className="user-wall">
      <h2>{t.wallTitle}</h2>

      {/* Afficher une erreur si nécessaire */}
      {error && <p className="error-message" style={{ color: "red" }}>{error}</p>}

      {/* Formulaire pour ajouter une publication */}
      <div className="add-post">
        <textarea
          placeholder={t.placeholder}
          value={newPostContent}
          onChange={(e) => setNewPostContent(e.target.value)}
          className="form-control mb-3"
        />
        <button onClick={handlePostSubmit} className="btn btn-primary">
          {t.publishButton}
        </button>
      </div>

      {/* Afficher les publications */}
      {posts.length === 0 ? (
        <p>{t.noPostsMessage}</p>
      ) : (
        posts.map((post) => (
          <div key={post.id} className="post-item">
            <p>{post.content}</p>
            <small>{new Date(post.timestamp).toLocaleString()}</small>
          </div>
        ))
      )}
    </div>
  );
};

export default UserWall;

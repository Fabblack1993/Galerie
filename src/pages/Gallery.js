import React, { useState, useEffect } from "react";
import "./Gallery.css";


import Modal from "react-modal"; // Import du modal pour le plein écran
import { FaFacebook, FaTwitter, FaThumbsUp } from "react-icons/fa"; // Import des icônes

const Gallery = ({ language }) => {
  const [artworks, setArtworks] = useState([]);
  const [comments, setComments] = useState({});
  const [likes, setLikes] = useState({});
  const currentUserId = 123; // Simule un utilisateur connecté
  const limit = 6; // Limite par page
  const [page, setPage] = useState(1); // Page actuelle
  const [totalPages, setTotalPages] = useState(0); // Nombre total de pages
  const [searchQuery, setSearchQuery] = useState(""); // Recherche
  const [sortOption, setSortOption] = useState("date"); // Tri par défaut
  const [newComments, setNewComments] = useState({});

  

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedArtwork, setSelectedArtwork] = useState(null); // Œuv
  // // Fonction pour partager sur Facebook
const shareOnFacebook = (workId) => {
  const url = `http://localhost:3000/gallery?workId=${workId}`;
  window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, "_blank");
};

// Fonction pour partager sur Twitter
const shareOnTwitter = (workId) => {
  const url = `http://localhost:3000/gallery?workId=${workId}`;
  const text = "Découvrez cette incroyable œuvre d'art !";
  window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`, "_blank");
};

  // Traductions pour les textes
  const translations = {
    fr: {
      galleryTitle: "Galerie",
      searchPlaceholder: "Rechercher une œuvre par titre, artiste ou catégorie...",
      sortByDate: "Trier par : Date",
      sortByLikes: "Trier par : Popularité (Likes)",
      like: "J'aime",
      shareOnFacebook: "Partager sur Facebook",
      shareOnTwitter: "Partager sur Twitter",
      description: "Description",
      likes: "J'aime",
      comments: "Commentaires",
      close: "Fermer",
      previous: "Précédent",
      next: "Suivant",
      page: "Page",
      of: "sur",
      Add: "Ajouter",
    },
    en: {
      galleryTitle: "Gallery",
      searchPlaceholder: "Search for an artwork by title, artist, or category...",
      sortByDate: "Sort by: Date",
      sortByLikes: "Sort by: Popularity (Likes)",
      like: "Like",
      shareOnFacebook: "Share on Facebook",
      shareOnTwitter: "Share on Twitter",
      description: "Description",
      likes: "Likes",
      comments: "Comments",
      close: "Close",
      previous: "Previous",
      next: "Next",
      page: "Page",
      of: "of",
      Add:"Add",
    },
  };

  const t = translations[language]; // Shortcut for current translations

  useEffect(() => {
    fetch(`http://localhost:5000/api/gallery?page=${page}&limit=${limit}&search=${searchQuery}&sort=${sortOption}`)
      .then((res) => res.json())
      .then((data) => {
        setArtworks(data.works);
        setTotalPages(Math.ceil(data.total / limit));
      })
      .catch((error) => console.error("Erreur lors de la récupération :", error));
  }, [page, searchQuery, sortOption]);

  const fetchComments = (workId) => {
    fetch(`http://localhost:5000/api/get-comments/${workId}`)
      .then((res) => res.json())
      .then((data) => {
        setComments((prevComments) => ({
          ...prevComments,
          [workId]: data.comments,
        }));
      });
  };

  const fetchLikes = (workId) => {
    fetch(`http://localhost:5000/api/get-likes/${workId}`)
      .then((res) => res.json())
      .then((data) => {
        setLikes((prevLikes) => ({
          ...prevLikes,
          [workId]: data.totalLikes,
        }));
      });
  };

  const handleLike = (workId) => {
    fetch("http://localhost:5000/api/like-work", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ workId, userId: currentUserId }),
    }).then(() => {
      fetchLikes(workId);
    });
  };
  const handleComment = (workId, commentText, parentId = null) => {
    if (!commentText || !workId) return; // Vérifie que le commentaire et l'œuvre existent
    fetch("http://localhost:5000/api/add-comment", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ workId, userId: currentUserId, comment: commentText, parentId }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setComments((prevComments) => ({
            ...prevComments,
            [workId]: [
              ...(prevComments[workId] || []),
              {
                userName: "Utilisateur actuel",
                avatarUrl: "https://via.placeholder.com/40",
                comment: commentText,
                timestamp: new Date().toISOString(),
                parentId: parentId,
              },
            ],
          }));
          setNewComments((prev) => ({ ...prev, [workId]: "" })); // Vider le champ texte
          setReplyTo(null); // Réinitialise le mode "réponse"
        } else {
          console.error("Erreur lors de l'ajout du commentaire :", data.error);
        }
      })
      .catch((error) => console.error("Erreur réseau :", error));
  };
  

  const openModal = (art) => {
    setSelectedArtwork(art);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedArtwork(null);
  };
  const renderComments = (comments, parentId = null) =>
    comments
      .filter((comment) => comment.parentId === parentId)
      .map((comment, index) => (
        <li key={index} className="d-flex align-items-start mb-3">
          <img
            src={comment.avatarUrl || "https://via.placeholder.com/40"}
            alt={comment.userName}
            className="rounded-circle me-2"
            style={{ width: "40px", height: "40px" }}
          />
          <div>
            <strong>{comment.userName}</strong>
            <p>{comment.comment}</p>
            <button
              className="btn btn-link p-0"
              onClick={() => setReplyTo({ workId: selectedArtwork.id, parentId: comment.id })}
            >
              {t.reply}
            </button>
            <ul>{renderComments(comments, comment.id)}</ul>
          </div>
        </li>
         ));
  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">{t.galleryTitle}</h1>

      {/* Barre de recherche et filtres */}
      <div className="mb-4">
        <input
          type="text"
          placeholder={t.searchPlaceholder}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="form-control mb-2"
        />
        <select
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
          className="form-control"
        >
          <option value="date">{t.sortByDate}</option>
          <option value="likes">{t.sortByLikes}</option>
        </select>
      </div>

      <div className="row mt-4">
        {artworks.map((art) => (
          <div key={art.id} className="col-md-6 mb-4">
            <div
              className="card"
              onClick={() => openModal(art)}
              style={{ cursor: "pointer" }}
            >
              <img src={art.filePath} className="card-img-top" alt={art.title} />
              <div className="card-body">
                <h5 className="card-title">{art.title}</h5>
                <p className="card-text">{art.description}</p>
              
        
                
                <button onClick={() => handleLike(art.id)} className="btn btn-primary">
                
                  <FaThumbsUp /> {t.like} ({likes[art.id] || 0})
                </button>
           
                <div className="comments-section mt-3">
  <h6>{t.comments}:</h6>
  <ul>
    {comments[art.id]?.map((comment, index) => (
      <li key={index}>
        <strong>{comment.userName}:</strong> {comment.comment}
      </li>
    ))}
  </ul>
  <textarea
    placeholder="Ajouter un commentaire..."
    className="form-control mb-2"
    value={newComments?.[art.id] || ""}
    onChange={(e) =>
      setNewComments((prev) => ({
        ...prev,
        [art.id]: e.target.value,
      }))
    }
  ></textarea>
  <button
    onClick={() => handleComment(art.id, newComments?.[art.id])}
    className="btn btn-success"
  >
    Ajouter
  </button>
</div>
 


                <div className="social-share mt-3">
                  <button
                    onClick={() => shareOnFacebook(art.id)}
                    className="btn btn-info me-2"
                    title={t.shareOnFacebook}
                  >
                    <FaFacebook /> {t.shareOnFacebook}
                  </button>
                  <button
                    onClick={() => shareOnTwitter(art.id)}
                    className="btn btn-info"
                    title={t.shareOnTwitter}
                  >
                    <FaTwitter /> {t.shareOnTwitter}
                  </button>
                </div>
                
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal plein écran */}
      
      {selectedArtwork && (
        <Modal
    isOpen={isModalOpen}
    onRequestClose={closeModal}
    contentLabel={selectedArtwork.title}
    style={{
      overlay: {
        backgroundColor: "rgba(0, 0, 0, 0.75)",
        zIndex: 1000,
      },
      content: {
        top: "50%",
        left: "50%",
        right: "auto",
        bottom: "auto",
        transform: "translate(-50%, -50%)",
        padding: "20px",
        background: "#fff",
        border: "none",
        maxWidth: "90%",
        maxHeight: "90vh",
        overflow: "auto",
      },
    }}
  >
    <div>
      <h2>{selectedArtwork.title}</h2>
      <img
        src={selectedArtwork.filePath}
        alt={selectedArtwork.title}
        style={{ width: "100%", height: "auto", display: "block", margin: "auto" }}
      />
      <button onClick={closeModal} style={{ marginTop: "10px" }}>
        Fermer
      </button>
    </div>
  </Modal>
)}


      {/* Pagination */}
      <div className="d-flex justify-content-center mt-4">
        <button
          className="btn btn-primary me-2"
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          disabled={page === 1}
        >
          {t.previous}
        </button>
        <span>
          {t.page} {page} {t.of} {totalPages}
        </span>
        <button
          className="btn btn-primary ms-2"
          onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={page === totalPages}
        >
          {t.next}
        </button>
      
    </div>
    </div>
  );
};

export default Gallery;

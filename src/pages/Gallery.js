import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import { FaFacebook, FaTwitter, FaThumbsUp } from "react-icons/fa";
import "./Gallery.css";

const Gallery = ({ language }) => {
  const [artworks, setArtworks] = useState([]);
  const [comments, setComments] = useState({});
  const [likes, setLikes] = useState({});
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState("date");
  const [newComments, setNewComments] = useState({});
  const [replyTo, setReplyTo] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedArtwork, setSelectedArtwork] = useState(null);

  const limit = 6;

  // Utilisateur connecté (simulé ici)
  const currentUser = {
    id: 123,
    name: "John Doe",
    avatar: "https://via.placeholder.com/40"
  };

  const translations = {
    fr: {
      galleryTitle: "Galerie",
      searchPlaceholder: "Rechercher une œuvre...",
      sortByDate: "Trier par : Date",
      sortByLikes: "Trier par : Likes",
      like: "J'aime",
      shareOnFacebook: "Partager sur Facebook",
      shareOnTwitter: "Partager sur Twitter",
      comments: "Commentaires",
      add: "Ajouter",
      close: "Fermer",
      previous: "Précédent",
      next: "Suivant",
      page: "Page",
      of: "sur"
    },
    en: {
      galleryTitle: "Gallery",
      searchPlaceholder: "Search artworks...",
      sortByDate: "Sort by: Date",
      sortByLikes: "Sort by: Likes",
      like: "Like",
      shareOnFacebook: "Share on Facebook",
      shareOnTwitter: "Share on Twitter",
      comments: "Comments",
      add: "Add",
      close: "Close",
      previous: "Previous",
      next: "Next",
      page: "Page",
      of: "of"
    }
  };

  const t = translations[language];

  useEffect(() => {
    fetch(`http://localhost:5000/api/gallery?page=${page}&limit=${limit}&search=${searchQuery}&sort=${sortOption}`)
      .then((res) => res.json())
      .then((data) => {
        setArtworks(data.works);
        setTotalPages(Math.ceil(data.total / limit));
      })
      .catch((err) => console.error("Erreur chargement galerie :", err));
  }, [page, searchQuery, sortOption]);

  const fetchComments = (workId) => {
    fetch(`http://localhost:5000/api/get-comments/${workId}`)
      .then((res) => res.json())
      .then((data) => {
        setComments((prev) => ({ ...prev, [workId]: data.comments }));
      });
  };

  const fetchLikes = (workId) => {
    fetch(`http://localhost:5000/api/get-likes/${workId}`)
      .then((res) => res.json())
      .then((data) => {
        setLikes((prev) => ({ ...prev, [workId]: data.totalLikes }));
      });
  };

  const handleLike = (workId) => {
    fetch("http://localhost:5000/api/like-work", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ workId, userId: currentUser.id })
    }).then(() => fetchLikes(workId));
  };

  const handleComment = (workId, commentText, parentId = null) => {
    if (!commentText.trim()) return;

    fetch("http://localhost:5000/api/add-comment", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        workId,
        userId: currentUser.id,
        comment: commentText,
        parentId
      })
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setComments((prev) => ({
            ...prev,
            [workId]: [
              ...(prev[workId] || []),
              {
                id: data.newCommentId,
                userName: currentUser.name,
                avatarUrl: currentUser.avatar,
                comment: commentText,
                parentId: parentId
              }
            ]
          }));
          setNewComments((prev) => ({ ...prev, [workId]: "" }));
          setReplyTo(null);
        }
      });
  };

  const openModal = (art) => {
    setSelectedArtwork(art);
    setIsModalOpen(true);
    fetchComments(art.id);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedArtwork(null);
    setReplyTo(null);
  };

  const renderComments = (comments, parentId = null) => {
    if (!comments) return null;

    return comments
      .filter((c) => c.parentId === parentId)
      .map((c, i) => (
        <li key={i} className="d-flex mb-3">
          <img
            src={c.avatarUrl}
            alt={c.userName}
            className="rounded-circle me-2"
            style={{ width: 40, height: 40 }}
          />
          <div>
            <strong>{c.userName}</strong>
            <p>{c.comment}</p>
            <button className="btn btn-link p-0" onClick={() => setReplyTo(c.id)}>
              Répondre
            </button>
            {comments.some((x) => x.parentId === c.id) && (
              <ul>{renderComments(comments, c.id)}</ul>
            )}
          </div>
        </li>
      ));
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">{t.galleryTitle}</h1>

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

      <div className="row">
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
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleLike(art.id);
                  }}
                  className="btn btn-primary"
                >
                  <FaThumbsUp /> {t.like} ({likes[art.id] || 0})
                </button>

                <div className="social-share mt-3">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      window.open(
                        `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                          `http://localhost:3000/gallery?workId=${art.id}`
                        )}`,
                        "_blank"
                      );
                    }}
                    className="btn btn-info me-2"
                  >
                    <FaFacebook /> {t.shareOnFacebook}
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      window.open(
                        `https://twitter.com/intent/tweet?url=${encodeURIComponent(
                          `http://localhost:3000/gallery?workId=${art.id}`
                        )}&text=Découvrez cette œuvre !`,
                        "_blank"
                      );
                    }}
                    className="btn btn-info"
                  >
                    <FaTwitter /> {t.shareOnTwitter}
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedArtwork && (
        <Modal
          isOpen={isModalOpen}
          onRequestClose={closeModal}
          contentLabel={selectedArtwork.title}
          style={{
            overlay: {
              backgroundColor: "rgba(0, 0, 0, 0.75)",
              zIndex: 1000
            },
            content: {
              maxWidth: "90%",
              maxHeight: "90vh",
              overflow: "auto",
              margin: "auto",
              padding: 20
            }
          }}
        >
          <h2>{selectedArtwork.title}</h2>
          <img
            src={selectedArtwork.filePath}
            alt={selectedArtwork.title}
            style={{ width: "100%", height: "auto" }}
          />
          <div className="comments-section mt-4">
            <h6>{t.comments}:</h6>
            <ul>{renderComments(comments[selectedArtwork.id])}</ul>

            {replyTo && (
              <div className="reply-section">
                <textarea
                  className="form-control mb-2"
                  placeholder="Votre réponse..."
                  value={newComments[replyTo] || ""}
                  onChange={(e) =>
                    setNewComments((prev) => ({
                      ...prev,
                      [replyTo]: e.target.value
                    }))
                  }
                />
                <button
                  className="btn btn-success me-2"
                  onClick={() =>
                    handleComment(selectedArtwork.id, newComments[replyTo], replyTo)
                  }
                >
                  Envoyer
                </button>
                <button className="btn btn-secondary" onClick={() => setReplyTo(null)}>
                  Annuler
                </button>
              </div>
            )}

            <textarea
              className="form-control mb-2"
              placeholder="Ajouter un commentaire..."
              value={newComments[selectedArtwork.id] || ""}
              onChange={(e) =>
                setNewComments((prev) => ({
                  ...prev,
                  [selectedArtwork.id]: e.target.value
                }))
              }
            />
            <button
              className="btn btn-success"
              onClick={() =>
                handleComment(selectedArtwork.id, newComments[selectedArtwork.id])
              }
            >
              {t.add}
            </button>
          </div>
          <button onClick={closeModal} className="btn btn-secondary mt-3">
            {t.close}
          </button>
        </Modal>
      )}

      <div className="d-flex justify-content-center mt-4">
        <button
          className="btn btn-primary me-2"
          onClick={() => setPage((p) => Math.max(p - 1, 1))}
          disabled={page === 1}
        >
          {t.previous}
        </button>
        <span>
          {t.page} {page} {t.of} {totalPages}
        </span>
        <button
          className="btn btn-primary ms-2"
          onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
          disabled={page === totalPages}
        >
          {t.next}
        </button>
      </div>
    </div>
  );
};

export default Gallery;

import React, { useState } from "react";
import { motion } from "framer-motion";
import "./SignUp.css";

const Signup = () => {
  // État pour gérer les champs du formulaire
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  // État pour afficher des messages (succès ou erreur)
  const [message, setMessage] = useState("");

  // Fonction pour gérer les changements dans les champs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Fonction pour soumettre le formulaire
  const validateForm = async (e) => {
    e.preventDefault();
    const { username, email, password } = formData;

    if (!username || !email || !password) {
      alert("Veuillez remplir tous les champs.");
      return;
    }

    try {
      // Envoi des données au backend
      const response = await fetch("http://localhost:5000/api/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await response.json();

      if (data.success) {
        setMessage("Inscription réussie ! Veuillez vérifier votre e-mail pour confirmer votre compte.");
      } else {
        setMessage("Une erreur s'est produite. Veuillez réessayer.");
      }
    } catch (error) {
      console.error("Erreur lors de l'inscription :", error);
      setMessage("Impossible de se connecter au serveur.");
    }
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center text-4xl font-bold mb-4">Créer un Compte</h1>
      <form onSubmit={validateForm}>
        <motion.div
          className="form-group"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <label htmlFor="username">Nom d'utilisateur</label>
          <input
            type="text"
            className="form-control"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            placeholder="Votre nom d'utilisateur"
          />
        </motion.div>
        <motion.div
          className="form-group"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <label htmlFor="email">Adresse e-mail</label>
          <input
            type="email"
            className="form-control"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Votre adresse e-mail"
          />
        </motion.div>
        <motion.div
          className="form-group"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9 }}
        >
          <label htmlFor="password">Mot de passe</label>
          <input
            type="password"
            className="form-control"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Votre mot de passe"
          />
        </motion.div>
        <motion.button
          type="submit"
          className="btn btn-primary"
          whileHover={{ scale: 1.1 }}
          transition={{ duration: 0.3 }}
        >
          Inscription
        </motion.button>
      </form>
      {/* Affiche un message de retour pour l'utilisateur */}
      {message && <p className="text-center mt-4">{message}</p>}
    </div>
  );
};

export default Signup;



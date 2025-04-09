import React, { useState } from "react";
import { motion } from "framer-motion";
import "./SignUp.css";

const translations = {
  fr: {
    title: "Créer un Compte",
    username: "Nom d'utilisateur",
    email: "Adresse e-mail",
    password: "Mot de passe",
    placeholderUsername: "Votre nom d'utilisateur",
    placeholderEmail: "Votre adresse e-mail",
    placeholderPassword: "Votre mot de passe",
    submit: "Inscription",
    emptyFields: "Veuillez remplir tous les champs.",
    success: "Inscription réussie ! Veuillez vérifier votre e-mail.",
    error: "Une erreur s'est produite. Veuillez réessayer.",
    serverError: "Impossible de se connecter au serveur.",
  },
  en: {
    title: "Create an Account",
    username: "Username",
    email: "Email address",
    password: "Password",
    placeholderUsername: "Your username",
    placeholderEmail: "Your email address",
    placeholderPassword: "Your password",
    submit: "Sign Up",
    emptyFields: "Please fill in all fields.",
    success: "Registration successful! Please check your email.",
    error: "An error occurred. Please try again.",
    serverError: "Unable to connect to the server.",
  },
};

const Signup = ({ language }) => {
  const t = translations[language];

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validateForm = async (e) => {
    e.preventDefault();
    const { username, email, password } = formData;

    if (!username || !email || !password) {
      alert(t.emptyFields);
      return;
    }

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await response.json();

      if (data.success) {
        setMessage(t.success);
      } else {
        setMessage(data.message || t.error);
      }
    } catch (error) {
      console.error("Signup error:", error);
      setMessage(t.serverError);
    }
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center text-4xl font-bold mb-4">{t.title}</h1>
      <form onSubmit={validateForm}>
        <motion.div className="form-group" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <label htmlFor="username">{t.username}</label>
          <input
            type="text"
            className="form-control"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            placeholder={t.placeholderUsername}
          />
        </motion.div>

        <motion.div className="form-group" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
          <label htmlFor="email">{t.email}</label>
          <input
            type="email"
            className="form-control"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder={t.placeholderEmail}
          />
        </motion.div>

        <motion.div className="form-group" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9 }}>
          <label htmlFor="password">{t.password}</label>
          <input
            type="password"
            className="form-control"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder={t.placeholderPassword}
          />
        </motion.div>

        <motion.button
          type="submit"
          className="btn btn-primary"
          whileHover={{ scale: 1.1 }}
          transition={{ duration: 0.3 }}
        >
          {t.submit}
        </motion.button>
      </form>

      {message && <p className="text-center mt-4">{message}</p>}
    </div>
  );
};

export default Signup;





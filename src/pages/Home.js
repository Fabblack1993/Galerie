import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import myImage from "../assets/423702.webp";
import oImage from "../assets/opportunité.jpg";
import coImage from "../assets/communauté.jpg";
import creImage from "../assets/créativité.jpeg";
import art1 from "../assets/Art1.jpg";
import art2 from "../assets/Art2.jpg";
import art3 from "../assets/Art3.JPG";
import "../App.css"; // Assure-toi que ce fichier CSS existe

const Home = ({ language }) => {
  // Traductions pour les textes
  const translations = {
    fr: {
      welcome: "Bienvenue sur Gal'Artiste",
      explore: "Explorez, créez et partagez vos œuvres. Rejoignez une communauté d'artistes passionnés.",
      gallery: "Découvrir la Galerie",
      whyChoose: "Pourquoi nous choisir ?",
      creativity: "Libérez votre créativité",
      creativityDesc: "Publiez vos œuvres et inspirez une audience mondiale.",
      community: "Rejoignez une communauté",
      communityDesc: "Connectez-vous avec des artistes du monde entier.",
      opportunities: "Créez des opportunités",
      opportunitiesDesc: "Exposez vos talents et ouvrez des portes vers le succès.",
      popularWorks: "Œuvres populaires",
      painting: "Peinture Éblouissante",
      paintingDesc: "Une œuvre riche en couleurs et émotions.",
      sculpture: "Sculpture Intrigante",
      sculptureDesc: "Un chef-d'œuvre de détails captivants.",
      illustration: "Illustration Créative",
      illustrationDesc: "L'imagination sous forme visuelle.",
      joinToday: "Rejoignez-nous dès aujourd'hui",
      joinDesc: "Découvrez un monde où l'art prend vie. Inscrivez-vous gratuitement et commencez à partager votre talent.",
      createAccount: "Créer un Compte",
    },
    en: {
      welcome: "Welcome to Gal'Artiste",
      explore: "Explore, create, and share your works. Join a community of passionate artists.",
      gallery: "Discover the Gallery",
      whyChoose: "Why Choose Us?",
      creativity: "Unleash Your Creativity",
      creativityDesc: "Publish your works and inspire a global audience.",
      community: "Join a Community",
      communityDesc: "Connect with artists from around the world.",
      opportunities: "Create Opportunities",
      opportunitiesDesc: "Showcase your talents and open doors to success.",
      popularWorks: "Popular Works",
      painting: "Dazzling Painting",
      paintingDesc: "A work rich in color and emotion.",
      sculpture: "Intriguing Sculpture",
      sculptureDesc: "A masterpiece with captivating details.",
      illustration: "Creative Illustration",
      illustrationDesc: "Imagination brought to life visually.",
      joinToday: "Join Us Today",
      joinDesc: "Discover a world where art comes to life. Sign up for free and start sharing your talent.",
      createAccount: "Create an Account",
    },
  };

  const t = translations[language]; // Shortcut for translations in the current language

  return (
    <div>
      {/* Section Parallax */}
      <section
        className="parallax"
        style={{
          backgroundImage: `url(${myImage})`,
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
        }}
      >
        <motion.h1
          className="text-5xl font-bold mb-4"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          {t.welcome}
        </motion.h1>
        <p className="text-lg mb-8">{t.explore}</p>
        <Link to="/gallery">
          <motion.button
            className="btn btn-primary py-2 px-6 text-lg rounded-lg"
            whileHover={{ scale: 1.1 }}
          >
            {t.gallery}
          </motion.button>
        </Link>
      </section>

      {/* Section Avantages */}
      <section className="container py-10">
        <h2 className="text-4xl font-bold text-center mb-6">{t.whyChoose}</h2>
        <section className="row">
          <div className="col-md-4 text-center mb-4">
            <div className="image-container">
              <img src={creImage} alt={t.creativity} />
            </div>
            <h3 className="text-lg font-bold">{t.creativity}</h3>
            <p>{t.creativityDesc}</p>
          </div>
          <div className="col-md-4 text-center mb-4">
            <div className="image-container">
              <img src={coImage} alt={t.community} />
            </div>
            <h3 className="text-lg font-bold">{t.community}</h3>
            <p>{t.communityDesc}</p>
          </div>
          <div className="col-md-4 text-center mb-4">
            <div className="image-container">
              <img src={oImage} alt={t.opportunities} />
            </div>
            <h3 className="text-lg font-bold">{t.opportunities}</h3>
            <p>{t.opportunitiesDesc}</p>
          </div>
        </section>
      </section>

      {/* Section Œuvres populaires */}
      <section className="container py-10">
        <h2 className="text-4xl font-bold text-center mb-6">{t.popularWorks}</h2>
        <div className="row justify-content-center">
          <div className="col-md-3 text-center">
            <div className="image-container">
              <img src={art1} alt={t.painting} />
            </div>
            <h3 className="text-lg font-bold mt-4">{t.painting}</h3>
            <p className="text-gray-600">{t.paintingDesc}</p>
          </div>
          <div className="col-md-3 text-center">
            <div className="image-container">
              <img src={art2} alt={t.sculpture} />
            </div>
            <h3 className="text-lg font-bold mt-4">{t.sculpture}</h3>
            <p className="text-gray-600">{t.sculptureDesc}</p>
          </div>
          <div className="col-md-3 text-center">
            <div className="image-container">
              <img src={art3} alt={t.illustration} />
            </div>
            <h3 className="text-lg font-bold mt-4">{t.illustration}</h3>
            <p className="text-gray-600">{t.illustrationDesc}</p>
          </div>
        </div>
      </section>

      {/* Section Appel à l'action */}
      <section className="bg-dark text-white text-center py-10">
        <h2 className="text-4xl font-bold mb-4">{t.joinToday}</h2>
        <p className="text-lg mb-4">{t.joinDesc}</p>
        <Link to="/signup">
          <button className="btn btn-light py-2 px-6 text-lg rounded-lg">
            {t.createAccount}
          </button>
        </Link>
      </section>
    </div>
  );
};

export default Home;

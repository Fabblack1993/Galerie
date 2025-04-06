const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const Stripe = require("stripe");
const stripe = Stripe("sk_test_51RAT6WQUlwIrrCbQLXZxp9tT46DIIOCOuOzL46xMuWFM1ym9z5Oei30ygt33OKyadOPcAGovcEcjbntW94iBea9t00K7sWaL5F");

const app = express();
app.use(cors());
app.use(express.json()); // Pour traiter les données JSON envoyées par le client
app.use("/assets", express.static("assets"));
app.use("/uploads", express.static("uploads"));
let userWall = []; // Stockage des publications
let userShop = []; // Stockage des produits

// Simule une base de données pour les utilisateurs et les œuvres
let orders = []; // Stockage des commandes

// Ajouter une commande
app.post("/api/checkout", async (req, res) => {
  const { userId, products } = req.body;

  if (!userId || !products || products.length === 0) {
    return res.status(400).json({
      success: false,
      message: "Les données utilisateur ou produits sont invalides.",
    });
  }

  try {
    const lineItems = products.map((product) => ({
      price_data: {
        currency: "usd",
        product_data: {
          name: product.title,
        },
        unit_amount: product.price * 100,
      },
      quantity: 1,
    }));

    // Journal des données
    console.log("Données envoyées à Stripe :", lineItems);

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: "http://localhost:3000/success",
      cancel_url: "http://localhost:3000/cancel",
    });

    return res.json({
      success: true,
      url: session.url,
    });
  } catch (error) {
    console.error("Erreur Stripe :", error.message);
    return res.status(500).json({
      success: false,
      message: "Une erreur est survenue lors de la création de la session.",
    });
  }
});

  

const users = [
  { id: 1, username: "Fabienne", email: "fabienne@example.com" },
];
const allWorks = [];

// Configuration de Multer pour l'upload des fichiers
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = "uploads";
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath); // Crée le dossier s'il n'existe pas
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const upload = multer({
  storage: storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // Limite à 2 Mo
  fileFilter: (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/gif"];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Type de fichier non autorisé"));
    }
  },
});

// Route pour uploader une œuvre
app.post("/api/upload-work", upload.single("file"), (req, res) => {
  const { title, description, userId } = req.body; // Inclut userId
  const file = req.file;

  if (!file) {
    return res.status(400).json({ error: "Aucun fichier uploadé" });
  }

  const newWork = {
    id: Date.now(),
    title,
    description,
   filePath: `http://localhost:5000/uploads/${file.filename}`,
    userId: parseInt(userId), // Associe l'œuvre à son propriétaire
  };

  allWorks.push(newWork);

  res.json({
    success: true,
    message: "Œuvre enregistrée avec succès",
    data: newWork,
  });
});

app.get("/api/user-profile", (req, res) => {
  res.json({
    username: "Fabienne",
    email: "fabienne@example.com",
    bio: "Artiste passionnée par les couleurs et les formes.",
    profilePicture: "http://localhost:5000/assets/Art1.jpg", // Photo de profil
    works: [
      { id: 1, title: "Mon premier tableau", image: "http://localhost:5000/assets/Art1.jpg" },
      { id: 2, title: "Sculpture moderne", image: "http://localhost:5000/assets/Art2.jpg" },
    ],
  });
});

// Middleware d'inscription avec envoi de mail
app.post("/api/signup", async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // Configuration Nodemailer
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: "ndougafabienne77@gmail.com", // Remplace par ton email
        pass: "xxfn bvqs iocd brnb ", // Remplace par ton mot de passe
      },
    });

    const confirmationLink = `http://localhost:3000/confirm?email=${email}`;

    // Envoi du mail
    await transporter.sendMail({
      from: '"Plateforme Artistique" <ndougafabienne77@gmail.com>',
      to: email,
      subject: "Confirmez votre inscription",
      html: `<h1>Bienvenue ${username} !</h1>
             <p>Merci de vous inscrire sur notre plateforme. Cliquez sur le lien suivant pour confirmer votre compte :</p>
             <a href="${confirmationLink}">Confirmez votre compte</a>`,
    });

    users.push({ id: Date.now(), username, email }); // Simule l'ajout dans une base de données
    res.status(200).json({ success: true, message: "E-mail de confirmation envoyé !" });
  } catch (error) {
    console.error("Erreur lors de l'envoi de l'e-mail :", error);
    res.status(500).json({ success: false, message: "Erreur interne du serveur." });
  }
});

// Confirmation de compte
app.get("/api/confirm", async (req, res) => {
  const { email } = req.query;

  try {
    console.log(`E-mail confirmé pour : ${email}`);
    res.status(200).json({ success: true, message: "Compte confirmé !" });
  } catch (error) {
    console.error("Erreur de confirmation :", error);
    res.status(500).json({ success: false, message: "Erreur interne." });
  }
});

// Exemple d'API pour notifier un utilisateur
app.post("/api/notify", (req, res) => {
  const { userId, message } = req.body;
  // Envoie la notification à l'utilisateur
  sendNotificationToUser(userId, message);
  res.status(200).send("Notification envoyée");
});

// Route pour récupérer toutes les œuvres
app.get("/api/gallery", (req, res) => {
  const { page = 1, limit = 6, search = "", sort = "date" } = req.query;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;

  // Filtrage par recherche (titre, artiste, catégorie)
  let filteredWorks = allWorks.filter((work) =>
    work.title.toLowerCase().includes(search.toLowerCase()) ||
    work.artist?.toLowerCase().includes(search.toLowerCase()) ||
    work.category?.toLowerCase().includes(search.toLowerCase())
  );

  // Tri par popularité, date ou autre critère
  if (sort === "likes") {
    filteredWorks = filteredWorks.sort((a, b) => b.likes - a.likes);
  } else if (sort === "date") {
    filteredWorks = filteredWorks.sort((a, b) => new Date(b.date) - new Date(a.date));
  }

  const paginatedWorks = filteredWorks.slice(startIndex, endIndex); // Appliquer la pagination

  res.json({
    total: filteredWorks.length,
    page: parseInt(page),
    limit: parseInt(limit),
    works: paginatedWorks,
  });
});




// Route pour supprimer une œuvre
app.delete("/api/delete-work/:id", (req, res) => {
  const { id } = req.params;
  const { userId } = req.body;

  const workIndex = allWorks.findIndex((work) => work.id === parseInt(id));
  if (workIndex === -1) {
    return res.status(404).json({ error: "Œuvre non trouvée" });
  }

  // Vérifie si l'utilisateur est le propriétaire
  if (allWorks[workIndex].userId !== parseInt(userId)) {
    return res.status(403).json({ error: "Action non autorisée" });
  }

  allWorks.splice(workIndex, 1);
  res.json({ success: true, message: "Œuvre supprimée" });
});

// Route pour modifier une œuvre
app.put("/api/edit-work/:id", (req, res) => {
  const { id } = req.params;
  const { title, description, userId } = req.body;

  const work = allWorks.find((work) => work.id === parseInt(id));
  if (!work) {
    return res.status(404).json({ error: "Œuvre non trouvée" });
  }

  // Vérifie si l'utilisateur est le propriétaire
  if (work.userId !== parseInt(userId)) {
    return res.status(403).json({ error: "Action non autorisée" });
  }

  // Met à jour l'œuvre
  work.title = title;
  work.description = description;
  res.json({ success: true, message: "Œuvre modifiée", data: work });
});
// Simule une base de données pour stocker les commentaires
// Simule une base de données pour stocker les commentaires
const comments = [];

// Route pour ajouter un commentaire
// Supposons que vous avez un tableau global pour les commentaires :
let allComments = []; // ou vous utilisez une vraie base de données

app.post("/api/add-comment", (req, res) => {
  const { workId, userId, comment } = req.body;
  // Normalement, vous récupérez aussi le nom et l'avatar de l'utilisateur depuis la base de données
  const userName = "Utilisateur actuel";  // Exemple, à adapter
  const avatarUrl = "https://via.placeholder.com/40"; // Exemple d'avatar

  const newComment = {
    userName,
    avatarUrl,
    comment,
    timestamp: new Date().toISOString(),
    likes: 0,
    workId, // Pour associer le commentaire à l'œuvre correspondante
  };

  allComments.push(newComment);
  res.json({ success: true, comment: newComment });
});

// Route pour récupérer les commentaires d'une œuvre
app.get("/api/get-comments/:workId", (req, res) => {
  const { workId } = req.params;
  const workComments = comments.filter((c) => c.workId === parseInt(workId));
  res.json({ success: true, comments: workComments });
});

// Simule une base de données pour stocker les likes
const likes = {};

// Route pour liker une œuvre
app.post("/api/like-work", (req, res) => {
  const { workId, userId } = req.body;
  if (!likes[workId]) likes[workId] = new Set(); // Crée un ensemble pour stocker les likes

  likes[workId].add(userId); // Ajoute le like de l'utilisateur
  res.json({ success: true, totalLikes: likes[workId].size });
});

// Route pour récupérer le nombre de likes d'une œuvre
app.get("/api/get-likes/:workId", (req, res) => {
  const { workId } = req.params;
  const totalLikes = likes[workId] ? likes[workId].size : 0;
  res.json({ success: true, totalLikes });
});


// Récupérer les publications d'un utilisateur
app.get("/api/user-wall/:userId", (req, res) => {
  const { userId } = req.params;
  const userPosts = userWall.filter((post) => post.userId == userId);
  res.json({ success: true, posts: userPosts });
});

// Ajouter une publication sur le mur
app.post("/api/user-wall", (req, res) => {
  const { userId, content } = req.body;

  if (!userId || !content) {
    return res.status(400).json({ success: false, message: "Données manquantes" });
  }

  const newPost = {
    id: Date.now(),
    userId,
    content,
    timestamp: new Date(),
  };

  userWall.push(newPost);
  res.json({ success: true, post: newPost });
});

// --- ROUTES BOUTIQUE (UserShop) ---

// Récupérer les produits d'un utilisateur
app.get("/api/user-shop/:userId", (req, res) => {
  const { userId } = req.params;
  const userProducts = userShop.filter((product) => product.userId == userId);
  res.json({ success: true, products: userProducts });
});

// Ajouter un produit à la boutique
app.post("/api/user-shop", (req, res) => {
  const { userId, title, price, image } = req.body;

  if (!userId || !title || !price || !image) {
    return res.status(400).json({ success: false, message: "Données manquantes" });
  }

  const newProduct = {
    id: Date.now(),
    userId,
    title,
    price,
    image,
  };

  userShop.push(newProduct);
  res.json({ success: true, product: newProduct });
});
// Route pour récupérer les commentaires d'une œuvre

// Démarrage du serveur
const PORT = 5000;
app.listen(PORT, () => console.log(`Serveur démarré sur http://localhost:${PORT}`));

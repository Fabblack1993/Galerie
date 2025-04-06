import React, { useState, useEffect } from "react";
import "./UserShop.css";

const UserShop = ({ userId, language }) => {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [newProduct, setNewProduct] = useState({
    title: "",
    price: "",
    image: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const translations = {
    fr: {
      shopTitle: "Boutique de l'artiste",
      loadingMessage: "Chargement des articles...",
      noProductsMessage: "Aucun article disponible.",
      addToCart: "Ajouter au panier",
      cartTitle: "Votre Panier",
      checkoutButton: "Finaliser l'achat",
      emptyCartMessage: "Votre panier est vide.",
      buyButton: "Acheter",
      addTitle: "Titre du produit",
      addPrice: "Prix",
      addImage: "Lien de l'image",
      addButton: "Ajouter à la boutique",
      errorMessage: "Une erreur est survenue lors de l'ajout du produit.",
    },
    en: {
      shopTitle: "Artist's Shop",
      loadingMessage: "Loading items...",
      noProductsMessage: "No items available.",
      addToCart: "Add to Cart",
      cartTitle: "Your Cart",
      checkoutButton: "Proceed to Checkout",
      emptyCartMessage: "Your cart is empty.",
      buyButton: "Buy",
      addTitle: "Product title",
      addPrice: "Price",
      addImage: "Image URL",
      addButton: "Add to shop",
      errorMessage: "An error occurred while adding the product.",
    },
  };

  const t = translations[language];

  useEffect(() => {
    fetch(`http://localhost:5000/api/user-shop/${userId}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch products");
        return res.json();
      })
      .then((data) => {
        console.log("Produits récupérés :", data.products); // Vérifie les produits récupérés
        setProducts(data.products);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Erreur lors du chargement des articles :", error);
        setLoading(false);
        setError(t.errorMessage);
      });
  }, [userId, t.errorMessage]);

  const addToCart = (product) => {
    setCart((prevCart) => [...prevCart, product]);
  };

  const handleCheckout = () => {
    if (cart.length === 0) {
      alert(t.emptyCartMessage);
      return;
    }
  
    console.log("Produits dans le panier :", cart); // Vérifie les données du panier
  
    fetch("http://localhost:5000/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, products: cart }), // Envoi des données au backend
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Problème lors de la requête vers le backend");
        }
        return res.json();
      })
      .then((data) => {
        console.log("Réponse du backend :", data); // Vérifie la réponse du backend
        if (data.success) {
          window.location.href = data.url; // Redirige vers Stripe si tout est OK
        } else {
          console.error("Erreur backend :", data.message);
          alert("Une erreur est survenue lors de la commande.");
        }
      })
      .catch((error) => {
        console.error("Erreur lors de la tentative d'achat :", error);
        alert("Erreur de connexion au serveur.");
      });
  };

  const handleProductSubmit = () => {
    if (!newProduct.title.trim() || !newProduct.price.trim() || !newProduct.image.trim()) {
      console.error("Tous les champs sont requis");
      return;
    }

    setError(null);
    fetch("http://localhost:5000/api/user-shop", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, ...newProduct }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to add product");
        return res.json();
      })
      .then((data) => {
        setProducts((prevProducts) => [data.product, ...prevProducts]);
        setNewProduct({ title: "", price: "", image: "" });
      })
      .catch((error) => {
        console.error("Erreur lors de l'ajout du produit :", error);
        setError(t.errorMessage);
      });
  };

  if (loading) {
    return <p>{t.loadingMessage}</p>;
  }

  return (
    <div className="user-shop">
      <h2>{t.shopTitle}</h2>

      {error && <p className="error-message" style={{ color: "red" }}>{error}</p>}

      <div className="add-product">
        <input
          type="text"
          placeholder={t.addTitle}
          value={newProduct.title}
          onChange={(e) => setNewProduct((prev) => ({ ...prev, title: e.target.value }))}
          className="form-control mb-2"
        />
        <input
          type="text"
          placeholder={t.addPrice}
          value={newProduct.price}
          onChange={(e) => setNewProduct((prev) => ({ ...prev, price: e.target.value }))}
          className="form-control mb-2"
        />
        <input
          type="text"
          placeholder={t.addImage}
          value={newProduct.image}
          onChange={(e) => setNewProduct((prev) => ({ ...prev, image: e.target.value }))}
          className="form-control mb-2"
        />
        <button onClick={handleProductSubmit} className="btn btn-success">
          {t.addButton}
        </button>
      </div>

      {products.length === 0 ? (
        <p>{t.noProductsMessage}</p>
      ) : (
        <div className="product-list">
          {products.map((product) => (
            <div key={product.id} className="product-item">
              <img 
                src={product.image || "http://localhost:5000/uploads/default-image.png"} 
                alt={product.title} 
                className="product-image" 
              />
              <h3>{product.title}</h3>
              <p>${product.price}</p>
              <button onClick={() => addToCart(product)} className="btn btn-primary">
                {t.addToCart}
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="cart">
        <h3>{t.cartTitle}</h3>
        {cart.length === 0 ? (
          <p>{t.emptyCartMessage}</p>
        ) : (
          <div className="cart-items">
            {cart.map((item, index) => (
              <div key={index} className="cart-item">
                <p>{item.title} - ${item.price}</p>
              </div>
            ))}
          </div>
        )}
        {cart.length > 0 && (
          <button onClick={handleCheckout} className="btn btn-success">
            {t.checkoutButton}
          </button>
        )}
      </div>
    </div>
  );
};

export default UserShop;

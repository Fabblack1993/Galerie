import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Confirm = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const email = queryParams.get("email");

    const confirmEmail = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/confirm?email=${email}`);
        const data = await response.json();

        if (data.success) {
          setTimeout(() => navigate("/profile"), 3000); // Redirige après 3 secondes
        }
      } catch (error) {
        console.error("Erreur lors de la confirmation :", error);
      }
    };

    confirmEmail();
  }, [navigate]);

  return (
    <div className="text-center">
      <h1 className="text-4xl font-bold">Confirmation réussie !</h1>
      <p>Redirection vers votre profil...</p>
    </div>
  );
};

export default Confirm; // L'exportation ajoutée ici

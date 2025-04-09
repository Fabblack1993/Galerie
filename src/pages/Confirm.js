import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

// Traductions
const translations = {
  fr: {
    loading: "Confirmation de votre compte en cours...",
    successTitle: "Confirmation réussie !",
    successMsg: "Redirection vers votre profil...",
    errorTitle: "Échec de confirmation",
    errorMsg: "Une erreur est survenue. Veuillez réessayer plus tard.",
  },
  en: {
    loading: "Confirming your account...",
    successTitle: "Confirmation successful!",
    successMsg: "Redirecting to your profile...",
    errorTitle: "Confirmation failed",
    errorMsg: "An error occurred. Please try again later.",
  },
};

// Choix de la langue (à rendre dynamique si besoin)
const language = "fr";
const t = translations[language];

const Confirm = () => {
  const navigate = useNavigate();
  const [status, setStatus] = useState("loading"); // "loading", "success", "error"

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const email = queryParams.get("email");

    const confirmEmail = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/confirm?email=${email}`);
        const data = await response.json();

        if (data.success) {
          setStatus("success");
          setTimeout(() => navigate("/profile"), 3000);
        } else {
          setStatus("error");
        }
      } catch (error) {
        console.error("Erreur lors de la confirmation :", error);
        setStatus("error");
      }
    };

    confirmEmail();
  }, [navigate]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center p-4">
      {status === "loading" && (
        <>
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500 border-solid mb-4"></div>
          <p className="text-lg">{t.loading}</p>
        </>
      )}

      {status === "success" && (
        <>
          <h1 className="text-4xl font-bold text-green-600">{t.successTitle}</h1>
          <p className="mt-2 text-gray-700">{t.successMsg}</p>
        </>
      )}

      {status === "error" && (
        <>
          <h1 className="text-4xl font-bold text-red-600">{t.errorTitle}</h1>
          <p className="mt-2 text-gray-700">{t.errorMsg}</p>
        </>
      )}
    </div>
  );
};

export default Confirm;

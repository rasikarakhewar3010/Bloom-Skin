import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const AuthCallback = () => {
  const { setIsLoggedIn } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const verify = async () => {
      try {
        const res = await axios.get("http://localhost:3000/api/auth/check-auth", {
          withCredentials: true,
        });

        if (res.data?.user) {
          localStorage.setItem("isLoggedIn", "true");
          setIsLoggedIn(true);
          navigate("/"); // redirect to home
        } else {
          navigate("/login"); // fallback
        }
      } catch (err) {
        navigate("/login");
      }
    };

    verify();
  }, [navigate, setIsLoggedIn]);

  return <div className="text-center mt-10 text-gray-500">Verifying login...</div>;
};

export default AuthCallback;

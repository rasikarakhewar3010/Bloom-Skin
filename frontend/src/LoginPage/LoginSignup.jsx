import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Eye, EyeOff } from "lucide-react";

const LoginSignup = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [flash, setFlash] = useState({ message: "", type: "" });
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const navigate = useNavigate();
  const { isLoggedIn, setIsLoggedIn, setUser, checkAuth } = useAuth();

  const toggle = () => {
    setIsLogin(!isLogin);
    setForm({ name: "", email: "", password: "" });
    setFlash({ message: "", type: "" });
  };

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value || "",
    }));
  };

  const showFlash = (message, type) => {
    setFlash({ message, type });
    setTimeout(() => setFlash({ message: "", type: "" }), 3000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;

    // Client-side validation with inline errors
    const errors = {};
    if (!isLogin && !form.name?.trim()) errors.name = 'Name is required';
    if (!form.email?.trim()) errors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errors.email = 'Please enter a valid email';
    if (!form.password) errors.password = 'Password is required';
    else if (!isLogin && form.password.length < 6) errors.password = 'Password must be at least 6 characters';

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }
    setFieldErrors({});

    const baseUrl = import.meta.env.VITE_API_URL || "";
    setSubmitting(true);
    const url = isLogin ? `${baseUrl}/api/auth/login` : `${baseUrl}/api/auth/register`;
    const dataToSend = isLogin
      ? { email: form.email, password: form.password }
      : form;

    try {
      const res = await axios.post(url, dataToSend, {
        withCredentials: true,
      });
      showFlash(`${isLogin ? "Login" : "Signup"} Successful`, "success");

      localStorage.setItem("isLoggedIn", "true");
      setIsLoggedIn(true);

      // Store user data if returned
      if (res.data?.user) {
        setUser(res.data.user);
      }

      setTimeout(() => {
        navigate("/");
      }, 1000);
    } catch (err) {
      showFlash(err.response?.data?.error || err.response?.data?.message || err.message, "error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogleLogin = () => {
    // Use full URL for production
    const baseUrl = import.meta.env.VITE_API_URL || "";
    window.open(`${baseUrl}/api/auth/google`, "_self");
  };

  // Check session on mount (e.g., after Google redirect)
  useEffect(() => {
    if (isLoggedIn) {
      navigate("/");
      return;
    }

    // Verify session with server
    checkAuth().then(() => {
      // checkAuth updates isLoggedIn state internally
    });
  }, []);

  // Redirect when login state changes
  useEffect(() => {
    if (isLoggedIn) {
      navigate("/");
    }
  }, [isLoggedIn, navigate]);

  
  return (
    <div className="min-h-screen flex items-center justify-center bg-pink-50 p-4 relative">
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md transition-all duration-300">
        {/* Back to Home link */}
        <Link to="/" className="flex items-center justify-center gap-2 mb-6 group">
          <span className="text-2xl">🌸</span>
          <span className="text-xl font-bold text-pink-500 group-hover:text-pink-600 transition">BloomSkin</span>
        </Link>

        <h2 className="text-3xl font-bold mb-6 text-center text-pink-500">
          {isLogin ? "Welcome Back" : "Create Account"}
        </h2>

        {flash.message && (
          <div
            className={`mb-4 p-3 rounded-md text-sm text-center font-medium ${
              flash.type === "success"
                ? "bg-green-100 text-green-700 border border-green-300"
                : "bg-red-100 text-red-700 border border-red-300"
            }`}
          >
            {flash.message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <input
                id="name"
                type="text"
                name="name"
                placeholder="Enter your full name"
                value={form.name || ""}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-pink-400 ${
                  fieldErrors.name ? 'border-red-400 bg-red-50' : 'border-gray-300'
                }`}
                required
              />
              {fieldErrors.name && <p className="text-xs text-red-500 mt-1">{fieldErrors.name}</p>}
            </div>
          )}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              id="email"
              type="email"
              name="email"
              placeholder="you@example.com"
              value={form.email || ""}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-pink-400 ${
                fieldErrors.email ? 'border-red-400 bg-red-50' : 'border-gray-300'
              }`}
              required
            />
            {fieldErrors.email && <p className="text-xs text-red-500 mt-1">{fieldErrors.email}</p>}
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Enter your password"
                value={form.password || ""}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-pink-400 pr-10 ${
                  fieldErrors.password ? 'border-red-400 bg-red-50' : 'border-gray-300'
                }`}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {fieldErrors.password && <p className="text-xs text-red-500 mt-1">{fieldErrors.password}</p>}
          </div>
          {isLogin && (
            <div className="text-right">
              <Link
                to="/forgot-password"
                className="text-sm text-pink-500 hover:text-pink-600 font-medium transition"
              >
                Forgot Password?
              </Link>
            </div>
          )}
          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-pink-500 text-white py-2 rounded-md hover:bg-pink-600 transition disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
          >
            {submitting ? "Please wait..." : isLogin ? "Login" : "Sign Up"}
          </button>
        </form>

        <div className="my-4 text-center text-gray-400 font-medium">or</div>

        <button
          onClick={handleGoogleLogin}
          className="flex items-center justify-center gap-3 w-full border py-2 rounded-md hover:bg-gray-50 transition"
        >
          <svg width="22" height="22" viewBox="0 0 48 48">
            <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.238-2.657-.611-3.917z"/>
            <path fill="#FF3D00" d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z"/>
            <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238C29.211 35.091 26.715 36 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"/>
            <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303c-.792 2.237-2.231 4.166-4.087 5.571.001-.001.002-.001.003-.002l6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.238-2.657-.611-3.917z"/>
          </svg>
          <span className="text-gray-700">Continue with Google</span>
        </button>

        <p className="mt-6 text-center text-sm text-gray-600">
          {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
          <button
            onClick={toggle}
            className="text-pink-500 font-semibold underline hover:text-pink-600 transition"
          >
            {isLogin ? "Sign Up" : "Login"}
          </button>
        </p>
      </div>
    </div>
  );
};

export default LoginSignup;
import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;

    if (!email.trim()) {
      setMessage({ text: "Please enter your email address.", type: "error" });
      return;
    }

    setSubmitting(true);
    setMessage({ text: "", type: "" });

    const baseUrl = import.meta.env.VITE_API_URL || "";
    try {
      const res = await axios.post(`${baseUrl}/api/auth/forgot-password`, { email: email.trim() }, {
        withCredentials: true,
        timeout: 30000, // 30s timeout so UI never hangs
      });
      setMessage({ text: res.data.message, type: "success" });
      setEmail("");
    } catch (err) {
      const errorMsg = err.code === "ECONNABORTED"
        ? "Request timed out. The server may be busy — please try again in a moment."
        : err.response?.data?.error || "Something went wrong. Please try again.";
      setMessage({
        text: errorMsg,
        type: "error",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-pink-50 p-4">
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md">
        <h2 className="text-3xl font-bold mb-2 text-center text-pink-500">
          Forgot Password
        </h2>
        <p className="text-gray-500 text-sm text-center mb-6">
          Enter your email and we'll send you a link to reset your password.
        </p>

        {message.text && (
          <div
            className={`mb-4 p-3 rounded-md text-sm text-center font-medium ${
              message.type === "success"
                ? "bg-green-100 text-green-700 border border-green-300"
                : "bg-red-100 text-red-700 border border-red-300"
            }`}
          >
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-pink-400"
            required
          />
          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-pink-500 text-white py-2 rounded-md hover:bg-pink-600 transition disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
          >
            {submitting ? "Sending..." : "Send Reset Link"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          Remember your password?{" "}
          <Link
            to="/login"
            className="text-pink-500 font-semibold underline hover:text-pink-600 transition"
          >
            Log In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;

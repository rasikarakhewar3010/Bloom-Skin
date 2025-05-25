import React, { useRef, useState, useEffect } from "react";
import emailjs from "@emailjs/browser";

const ContactUs = () => {
  const form = useRef();
  const [alert, setAlert] = useState({ show: false, success: true, message: "" });
  const [loading, setLoading] = useState(false);
  const [cursor, setCursor] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const move = (e) => setCursor({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);

  const sendEmail = (e) => {
    e.preventDefault();
    setLoading(true);

    emailjs
      .sendForm(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        form.current,
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY
      )
      .then(
        () => {
          setLoading(false);
          setAlert({ show: true, success: true, message: "Message sent successfully!" });
          form.current.reset();
          setTimeout(() => setAlert({ show: false }), 3000);
        },
        (error) => {
          console.error("FAILED...", error);
          setLoading(false);
          setAlert({ show: true, success: false, message: "Failed to send message!" });
          setTimeout(() => setAlert({ show: false }), 3000);
        }
      );
  };

  return (
    <div className="relative min-h-screen bg-white flex items-center justify-center px-4 md:px-6 py-16 overflow-hidden">
      {/* Radial Cursor Background */}
      <div
        className="pointer-events-none fixed top-0 left-0 w-full h-full z-0 transition-all duration-200 ease-out"
        style={{
          background: `radial-gradient(circle at ${cursor.x}px ${cursor.y}px, rgba(251, 111, 146, 0.1) 0%, transparent 70%)`,
        }}
      />

      {/* Alert Notification (z-20 so it doesn’t go over navbar) */}
      {alert.show && (
        <div
          className={`fixed top-20 mx-auto left-0 right-0 w-fit px-6 py-3 rounded-md shadow-lg text-white font-semibold transition-all z-20 ${
            alert.success ? "bg-green-500" : "bg-red-500"
          }`}
        >
          {alert.message}
        </div>
      )}

      {/* Contact Form Card */}
      <div className="relative z-10 bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-6 sm:p-8 md:p-10 w-full max-w-2xl">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-center mb-6 md:mb-8 tracking-tight text-gray-800 drop-shadow-sm">
          Contact Bloom Skin
        </h2>

        <form ref={form} onSubmit={sendEmail} className="space-y-5 sm:space-y-6">
          {/* Name */}
          <div>
            <label className="block text-sm font-semibold mb-2 text-gray-700">Name</label>
            <input
              type="text"
              name="user_name"
              required
              placeholder="Your Name"
              className="w-full p-3 border border-pink-300 rounded-lg focus:ring-2 focus:ring-[#FB6F92] outline-none bg-white/70"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-semibold mb-2 text-gray-700">Email</label>
            <input
              type="email"
              name="user_email"
              required
              placeholder="you@example.com"
              className="w-full p-3 border border-pink-300 rounded-lg focus:ring-2 focus:ring-[#FB6F92] outline-none bg-white/70"
            />
          </div>

          {/* Message */}
          <div>
            <label className="block text-sm font-semibold mb-2 text-gray-700">Message</label>
            <textarea
              name="message"
              rows="5"
              required
              placeholder="Tell us your concern..."
              className="w-full p-3 border border-pink-300 rounded-lg focus:ring-2 focus:ring-[#FB6F92] outline-none bg-white/70"
            ></textarea>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="relative w-full px-8 py-4 rounded-full font-bold tracking-widest text-sm uppercase overflow-hidden transition-all duration-700 ease-in-out shadow-md group border-2 border-[#FB6F92] text-black hover:scale-105 active:scale-95"
          >
            <span className="relative z-20">{loading ? "Sending..." : "Send Message"}</span>
            <span className="absolute inset-0 transition-transform duration-500 ease-in-out origin-left scale-x-0 group-hover:scale-x-100 bg-[#FB6F92] opacity-10 z-10" />
            <span className="absolute inset-0 rounded-full group-hover:blur-xl group-hover:opacity-40 bg-[#FB6F92] transition-all duration-700 ease-out z-0 pointer-events-none" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ContactUs;

import React from 'react';
import { motion } from 'framer-motion';

const BloomSkinDosDonts = () => {
  const dos = [
    {
      text: 'Use natural lighting',
      icon: (
        <svg className="w-5 h-5 text-pink-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="5" />
          <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M17.66 17.66l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M17.66 6.34l1.42-1.42" />
        </svg>
      ),
      tip: 'Daylight provides the most accurate skin tone representation.',
    },
    {
      text: 'Keep hair away from face',
      icon: (
        <svg className="w-5 h-5 text-pink-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <circle cx="12" cy="8" r="4" />
          <path d="M6 20v-2a4 4 0 014-4h4a4 4 0 014 4v2" />
        </svg>
      ),
      tip: 'Pull back hair to expose full facial contours.',
    },
    {
      text: 'No filters or makeup',
      icon: (
        <svg className="w-5 h-5 text-pink-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path d="M4 4h16v16H4z" />
          <path d="M9 9l6 6M15 9l-6 6" />
        </svg>
      ),
      tip: 'Bare skin allows for precise analysis.',
    },
  ];

  const donts = [
    {
      text: 'Avoid blurry images',
      icon: (
        <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path d="M12 12h.01M4.22 4.22l15.56 15.56M1 1l22 22" />
        </svg>
      ),
      tip: 'Sharp focus ensures accurate feature detection.',
    },
    {
      text: 'No side profiles',
      icon: (
        <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <circle cx="12" cy="8" r="4" />
          <path d="M6 20v-2a4 4 0 014-4h4a4 4 0 014 4v2" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      ),
      tip: 'Front-facing shots provide optimal symmetry analysis.',
    },
    {
      text: 'Don’t use screenshots',
      icon: (
        <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <rect x="3" y="3" width="18" height="14" rx="2" ry="2" />
          <line x1="1" y1="1" x2="23" y2="23" />
        </svg>
      ),
      tip: 'Original photos maintain maximum resolution.',
    },
  ];

  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.2 },
    },
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: 'spring', stiffness: 120, damping: 14 },
    },
  };

  return (
    <section className="relative py-24 px-6 lg:px-8 bg-white">
      {/* Gradient Backgrounds */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute left-1/2 top-0 w-[120vw] h-[50vh] -translate-x-1/2 bg-gradient-to-b from-pink-100/20 to-transparent" />
        <div className="absolute top-1/2 left-0 w-full h-[80vh] -translate-y-1/2 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-cyan-100/10 via-transparent to-transparent" />
      </div>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="text-center mb-16 max-w-3xl mx-auto"
      >
        <h2 className="text-4xl font-bold text-gray-900">Photo Submission Guidelines</h2>
        <p className="mt-4 text-lg text-gray-600">
          Follow these instructions to get the most accurate and meaningful results from your skin analysis.
        </p>
      </motion.div>

      {/* Do and Don't Grids */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 max-w-6xl mx-auto">
        {/* Do's */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={container}
          className="bg-white shadow-lg rounded-xl border border-gray-100 p-6 relative"
        >
          <div className="absolute -top-5 -left-5 bg-pink-100/40 p-4 rounded-full">
            <span className="text-pink-500 font-bold text-xl">✓</span>
          </div>
          <h3 className="text-2xl font-semibold text-gray-900 mb-6">Best Practices</h3>
          <ul className="space-y-5">
            {dos.map((item, idx) => (
              <motion.li
                key={idx}
                variants={item}
                className="flex gap-4 items-start"
              >
                <div className="mt-1">{item.icon}</div>
                <div>
                  <p className="font-medium text-gray-800">{item.text}</p>
                  <p className="text-sm text-gray-500">{item.tip}</p>
                </div>
              </motion.li>
            ))}
          </ul>
        </motion.div>

        {/* Don'ts */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={container}
          className="bg-white shadow-lg rounded-xl border border-gray-100 p-6 relative"
        >
          <div className="absolute -top-5 -left-5 bg-red-100/50 p-4 rounded-full">
            <span className="text-red-500 font-bold text-xl">✕</span>
          </div>
          <h3 className="text-2xl font-semibold text-gray-900 mb-6">Things to Avoid</h3>
          <ul className="space-y-5">
            {donts.map((item, idx) => (
              <motion.li
                key={idx}
                variants={item}
                className="flex gap-4 items-start"
              >
                <div className="mt-1">{item.icon}</div>
                <div>
                  <p className="font-medium text-gray-800">{item.text}</p>
                  <p className="text-sm text-gray-500">{item.tip}</p>
                </div>
              </motion.li>
            ))}
          </ul>
        </motion.div>
      </div>

      {/* Ideal Example */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.3 }}
        className="mt-20 max-w-4xl mx-auto bg-gray-50 rounded-xl p-8 border border-gray-200"
      >
        <div className="flex items-center gap-3 mb-4">
          <svg className="w-6 h-6 text-pink-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M15 10l4.553-4.553A1 1 0 0019.553 4H4.447a1 1 0 00-.707 1.707L8 10v4l-2 2v2h12v-2l-2-2v-4z" />
          </svg>
          <h3 className="text-xl font-semibold text-gray-900">Ideal Photo Example</h3>
        </div>
        <p className="text-gray-600 mb-6">
          A well-lit, front-facing photo with neutral expression and clear focus provides the most accurate analysis.
        </p>
        <div className="aspect-video bg-gradient-to-r from-pink-100/30 to-cyan-100/30 rounded-lg flex items-center justify-center border border-dashed border-gray-300">
          <div className="text-center p-6">
            <svg className="w-12 h-12 text-gray-400 mx-auto" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M3 7h18M5 7V5h14v2M12 11a3 3 0 100 6 3 3 0 000-6z" />
              <path d="M4 17h16v2H4z" />
            </svg>
            <p className="mt-2 text-sm text-gray-500">Placeholder – ideal photo display here</p>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default BloomSkinDosDonts;

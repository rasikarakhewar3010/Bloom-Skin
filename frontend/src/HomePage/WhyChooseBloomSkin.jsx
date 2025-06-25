import React from 'react';

// Using more appropriate and distinct icons for clarity
const features = [
  {
    icon: ( // Icon for Speed/Analysis
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    title: "Instant Analysis, Not Weeks of Waiting",
    description: "Get a detailed breakdown of your skin's condition in seconds. No appointments, no guesswork—just immediate, actionable insights right from your screen."
  },
  {
    icon: ( // Icon for Expertise/Science
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547a2 2 0 00-.547 1.806l.443 2.387a6 6 0 00.517 3.86l.158.318a6 6 0 003.86.517l2.387.443a2 2 0 001.806-.547a2 2 0 00.547-1.806l-.443-2.387a6 6 0 00-.517-3.86l-.158-.318a6 6 0 01-.517-3.86l.477-2.387a2 2 0 00.547-1.022z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8a3 3 0 100-6 3 3 0 000 6z" />
      </svg>
    ),
    title: "Accessible Expertise, On Your Terms",
    description: "Our AI is trained on thousands of dermatological images, giving you access to a wealth of knowledge whenever you need it, from the comfort of your home."
  },
  {
    icon: ( // Icon for Security/Privacy
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 20.417l4.5-4.5M12 14a2 2 0 01-2-2V7a2 2 0 012-2h1a2 2 0 012 2v5a2 2 0 01-2 2h-1z" />
      </svg>
    ),
    title: "Secure & Anonymous Scan",
    description: "Your privacy is paramount. Your photo is processed securely and is never linked to your personal identity. You are in complete control."
  },
  {
    icon: ( // Icon for Data/Recommendations
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
    title: "Data-Driven Recommendations",
    description: "Move beyond generic advice. Our system provides personalized suggestions based on what it actually sees, helping you build a smarter, more effective skincare routine."
  }
];

const WhyChooseBloomSkin = () => {
  return (
    <section className="py-20 sm:py-24 bg-gradient-to-b from-pink-50 to-white">
      <div className="container mx-auto px-4">
        
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4 tracking-tight">
            Why Choose Bloom Skin?
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Your path to healthier skin, powered by intelligent technology.
          </p>
        </div>

        {/* Staggered Feature Grid */}
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:gap-12">
          {features.map((feature, index) => (
            <div 
              key={index}
              // This logic creates the staggered effect on large screens
              className={`bg-white p-6 rounded-2xl shadow-md border border-gray-100 
                          transition-all duration-300 ease-in-out 
                          hover:shadow-lg hover:shadow-pink-100 hover:-translate-y-2
                          ${index % 2 !== 0 ? 'lg:transform lg:translate-y-8' : ''}`}
            >
              {/* Styled Icon */}
              <div className="flex items-center justify-center h-12 w-12 rounded-full bg-pink-100 text-pink-500 mb-5">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">{feature.title}</h3>
              <p className="text-sm text-gray-600 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseBloomSkin;
import React, { useState, useEffect } from 'react';

const Hero = () => {
  const [hoveredText, setHoveredText] = useState(null);
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });

  const handleTextHover = (text) => setHoveredText(text);
  const handleTextLeave = () => setHoveredText(null);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setCursorPos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="relative min-h-screen bg-white overflow-hidden flex items-center justify-center px-4 md:px-10">
      {/* Cursor shadow effect */}
      <div
        className="pointer-events-none fixed top-0 left-0 w-full h-full z-20 transition-all duration-200 ease-out"
        style={{
          background: `radial-gradient(circle at ${cursorPos.x}px ${cursorPos.y}px, rgba(251, 111, 146, 0.15) 0%, transparent 80%)`,
        }}

      />

      {/* Grid background */}
      {/* Grid background with blurred top and bottom edges */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div
          className="h-full w-full grid grid-cols-12 grid-rows-6"
          style={{
            maskImage:
              'linear-gradient(to bottom, transparent 0%, black 15%, black 85%, transparent 100%)',
            WebkitMaskImage:
              'linear-gradient(to bottom, transparent 0%, black 15%, black 85%, transparent 100%)',
            opacity: 0.3,
          }}
        >
          {Array.from({ length: 72 }).map((_, i) => (
            <div key={i} className="border border-black/15" />
          ))}
        </div>
      </div>


      {/* Content */}
      <div className="relative z-30 text-center max-w-4xl w-full">
        <p
          className={`uppercase mb-6 text-xs sm:text-sm md:text-base lg:text-lg tracking-widest transition-all duration-700 ease-in-out ${hoveredText === 'subtitle' ? 'text-[#FB6F92]' : 'text-black/60'
            }`}
          onMouseEnter={() => handleTextHover('subtitle')}
          onMouseLeave={handleTextLeave}
        >
          Your journey to clearer, healthier skin starts here.
        </p>

        <h1
          className={`font-bold mb-10 leading-tight text-4xl sm:text-6xl md:text-7xl lg:text-7xl xl:text-8xl transition-all duration-700 ease-in-out ${hoveredText === 'title' ? 'text-[#FB6F92]' : 'text-black'
            }`}
          style={{
            textShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
          }}
          onMouseEnter={() => handleTextHover('title')}
          onMouseLeave={handleTextLeave}
        >
          BLOOM SKIN<br />GUIDE
        </h1>

        <button
          className={`relative px-8 py-4 md:px-12 md:py-5 rounded-full font-semibold tracking-widest text-sm sm:text-base uppercase overflow-hidden transition-all duration-700 ease-in-out shadow-lg group
            ${hoveredText === 'button' ? 'text-[#FB6F92] border-[#FB6F92]' : 'text-black border-black'}
            border-2 hover:scale-105 active:scale-95`}
          onMouseEnter={() => handleTextHover('button')}
          onMouseLeave={handleTextLeave}
        >
          <span className="relative z-10">Get Started</span>
          <span
            className={`absolute inset-0 transition-transform duration-500 ease-in-out origin-left scale-x-0 group-hover:scale-x-100
              ${hoveredText === 'button' ? 'bg-[#FB6F92]' : 'bg-black'} opacity-10 z-0`}
          ></span>
          <span className="absolute inset-0 rounded-full group-hover:blur-xl group-hover:opacity-40 bg-[#FB6F92] transition-all duration-700 ease-out z-0 pointer-events-none"></span>
        </button>
      </div>
    </div>
  );
};

export default Hero;

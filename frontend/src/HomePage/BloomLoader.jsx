import React, { useEffect, useState } from 'react';

const BloomLoader = ({ onComplete }) => {
  const brand = 'Bloom Skin';
  const [visibleLetters, setVisibleLetters] = useState(0);
  const [showPetals, setShowPetals] = useState(false);

  useEffect(() => {
    // Letter animation
    const letterInterval = setInterval(() => {
      setVisibleLetters((prev) => {
        if (prev < brand.length) return prev + 1;
        clearInterval(letterInterval);
        setShowPetals(true);
        return prev;
      });
    }, 120);

    // Complete callback after animations
    const completionTimer = setTimeout(() => {
      onComplete();
    }, 3000);

    return () => {
      clearInterval(letterInterval);
      clearTimeout(completionTimer);
    };
  }, [onComplete]);

  return (
    <div className="fixed inset-0 w-full h-screen bg-white flex items-center justify-center z-50">
      {/* Main brand text with scaling animation */}
      <div className="relative">
        <h1 className="text-5xl md:text-6xl font-bold text-[#ff4f8b] tracking-wider z-10 animate-soft-pulse">
          {brand.split('').map((char, i) => (
            <span
              key={i}
              className={`inline-block transition-all duration-700 ease-[cubic-bezier(0.68,-0.55,0.27,1.55)] ${
                i < visibleLetters
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-6'
              }`}
              style={{
                fontFamily: "'Dancing Script', cursive",
                fontWeight: 700,
                transitionDelay: `${i * 80}ms`
              }}
            >
              {char}
            </span>
          ))}
        </h1>
      </div>

      {/* Petal animation */}
      {showPetals && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className="absolute text-[#ff8fab] opacity-80"
              style={{
                fontSize: `${Math.random() * 24 + 12}px`,
                top: `${Math.random() * 20}%`,
                left: `${Math.random() * 100}%`,
                animation: `petal-fall ${Math.random() * 6 + 4}s linear infinite`,
                animationDelay: `${Math.random() * 2}s`,
                transform: `rotate(${Math.random() * 360}deg)`
              }}
            >
              {i % 2 === 0 ? '❀' : '✿'}
            </div>
          ))}
        </div>
      )}

      {/* CSS animations */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Dancing+Script:wght@700&display=swap');
        
        @keyframes petal-fall {
          0% {
            transform: translateY(-100px) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(360deg);
            opacity: 0;
          }
        }
        
        @keyframes soft-pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.05); }
          100% { transform: scale(1); }
        }
        
        .animate-soft-pulse {
          animation: soft-pulse 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default BloomLoader;
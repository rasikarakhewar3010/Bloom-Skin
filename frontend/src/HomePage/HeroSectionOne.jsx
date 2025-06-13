import React, { useState, useEffect } from 'react';
import { BackgroundLines } from "@/components/ui/background-lines";
import { TextGenerateEffect } from "@/components/ui/text-generate-effect";
import { useNavigate } from 'react-router-dom';


export function HeroSectionOne() {
  const navigate = useNavigate();
  const [displayText, setDisplayText] = useState('');
  const fullText = 'Bloom Skin';
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showCursor, setShowCursor] = useState(true);

  const handleGetStartedClick = () => {
    // You could do other things here first, like an API call
    navigate('/aichat');
  };

  // Typing effect
  useEffect(() => {
    if (currentIndex < fullText.length) {
      const timeout = setTimeout(() => {
        setDisplayText(prev => prev + fullText[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, 200); // Adjust speed here (milliseconds per letter)

      return () => clearTimeout(timeout);
    }
  }, [currentIndex]);

  // Cursor blink effect
  useEffect(() => {
    const interval = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 500); // Cursor blink speed

    return () => clearInterval(interval);
  }, []);

  return (
    <BackgroundLines className="flex items-center justify-center w-full flex-col px-4 h-[93vh] relative -top-5 md:-top-20">
      <div className="w-full flex flex-col items-center justify-center">
        <h1 className="bg-clip-text text-transparent bg-gradient-to-b from-neutral-900 to-neutral-700 dark:from-neutral-600 dark:to-white font-sans relative z-20 font-bold tracking-tight
                      text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl py-2 md:py-10">
          {displayText}
          <span className={`text-[#FB6F92] transition-opacity duration-300 ${showCursor ? 'opacity-100' : 'opacity-0'}
                          text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl`}>
            |
          </span>
        </h1>
      </div>
      <p className="max-w-xl mx-auto text-base sm:text-lg md:text-xl text-neutral-700 dark:text-neutral-400 text-center px-4">
        Unlock the secret to glowing skin with Bloom Skin.
        Experience a transformative journey that nurtures, heals, and rejuvenates your skin with every application.
      </p>
      <div className='z-10 mt-9 md:mt-12'>
        <button className="p-[3px] relative group" onClick={handleGetStartedClick} >
          <div className="absolute inset-0 bg-gradient-to-r from-[#FFC2D1] to-[#FB6F92] rounded-lg" />
          <div className="px-6 py-2 sm:px-8 sm:py-2 bg-neutral-900 rounded-[6px] relative group-hover:bg-transparent 
                         transition duration-200 text-white group-hover:text-black font-medium text-sm sm:text-base">
            Start Your Scan
          </div>
        </button>
      </div>
    </BackgroundLines>
  );
};
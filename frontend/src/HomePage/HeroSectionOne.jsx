import React, { useState, useEffect } from 'react';
import { BackgroundLines } from "@/components/ui/background-lines";
import './HeroSectionOne.css'; // Import your CSS file for styling
import { TextGenerateEffect } from "@/components/ui/text-generate-effect";

export function HeroSectionOne() {
  const [displayText, setDisplayText] = useState('');
  const fullText = 'Bloom Skin';
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showCursor, setShowCursor] = useState(true);

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
    <BackgroundLines className="flex items-center justify-center w-full flex-col px-4 h-[93vh] relative top-[-80px]">
      <div className="bloomskain-container">

        <h1 className="bloomskain-text bg-clip-text text-transparent text-center bg-gradient-to-b from-neutral-900 to-neutral-700 dark:from-neutral-600 dark:to-white  md:text-4xl lg:text-7xl font-sans py-2 md:py-10 relative z-20 font-bold tracking-tight">
          {displayText}
          <span className={`cursor ${showCursor ? 'visible' : ''}`}>|</span>
        </h1>
      </div>
      <p className="max-w-xl mx-auto text-l font-medium md:text-lg text-neutral-700 dark:text-neutral-400 text-center">
        Unlock the secret to glowing skin with Bloom Skin.
        Experience a transformative journey that nurtures, heals, and rejuvenates your skin with every application.
      </p>
      <div className='z-60 m-6'>
        <button className="p-[3px] relative">
          <div className="absolute inset-0 bg-gradient-to-r from-[#FFC2D1] to-[#FB6F92] rounded-lg" />
          <div className="px-8 py-2  bg-neutral-900 rounded-[6px]  relative group transition duration-200 text-white hover:bg-transparent hover:text-black font-medium">
            Start Your Scan
          </div>
        </button>
      </div>

    </BackgroundLines>

  );
};

import React, { useState, useEffect } from 'react';
import { BackgroundLines } from "@/components/ui/background-lines";
import { useNavigate } from 'react-router-dom';

export function HeroSectionOne() {
  const navigate = useNavigate();
  const [displayText, setDisplayText] = useState('');
  const fullText = 'Bloom Skin';
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showCursor, setShowCursor] = useState(true);

  const handleGetStartedClick = () => {
    navigate('/aichat'); // Or your image analysis page
  };

  // Typing effect logic
  useEffect(() => {
    if (currentIndex < fullText.length) {
      const timeout = setTimeout(() => {
        setDisplayText(prev => prev + fullText[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, 200); // Typing speed

      return () => clearTimeout(timeout);
    }
  }, [currentIndex, fullText]);

  // Cursor blink effect logic
  useEffect(() => {
    const interval = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 500); // Cursor blink speed

    return () => clearInterval(interval);
  }, []);

  return (
    // CONTAINER: 
    // - Uses min-h-screen for flexible height that fills the screen but can grow.
    // - 'flex flex-col' with 'items-center justify-center' provides robust centering.
    // - Padding 'px-4' ensures content never touches the screen edges on mobile.
    <BackgroundLines className="flex min-h-screen w-full flex-col items-center justify-center px-4 pb-16 md:pb-24">
      
      {/* CONTENT WRAPPER */}
      <div className="flex w-full flex-col items-center justify-center text-center ">
        
        {/* MAIN HEADING: 
            - Typography is now more granular for smoother scaling across all devices.
            - Starts at 5xl on mobile, and scales up through multiple breakpoints.
            - 'leading-tight' keeps lines close together if the title wraps.
        */}
        <h1 className="bg-clip-text text-transparent bg-gradient-to-b from-neutral-900 to-neutral-700 dark:from-neutral-600 dark:to-white font-sans relative z-20 font-bold tracking-tight leading-tight
                       text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl py-4 md:py-6">
          {displayText}
          {/* CURSOR: 
              - The font sizes must exactly match the h1 to align perfectly.
              - The cursor disappears when typing is complete for a cleaner look.
          */}
          {currentIndex < fullText.length && (
            <span className={`text-[#FB6F92] transition-opacity duration-300 ${showCursor ? 'opacity-100' : 'opacity-0'}
                            text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl`}>
              |
            </span>
          )}
        </h1>

        {/* SUBTITLE:
            - 'max-w-*' classes are now responsive to give the text more room on larger screens.
        */}
        <p className="max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl mx-auto text-base sm:text-lg md:text-xl text-neutral-700 dark:text-neutral-400">
          UStop the guesswork. Understand your skin's true needs and unlock the confidence to build a routine that works for you.
        </p>

        {/* BUTTON:
            - Margin-top now scales more smoothly across breakpoints.
        */}
        <div className='z-10 mt-8 sm:mt-10 lg:mt-12'>
          <button className="p-[3px] relative group" onClick={handleGetStartedClick}>
            <div className="absolute inset-0 bg-gradient-to-r from-[#FFC2D1] to-[#FB6F92] rounded-lg" />
            <div className="px-6 py-2 sm:px-8 sm:py-2 bg-neutral-900 rounded-[6px] relative group-hover:bg-transparent 
                           transition duration-200 text-white group-hover:text-black font-medium text-sm sm:text-base">
              Start Your Scan
            </div>
          </button>
        </div>
      </div>
    </BackgroundLines>
  );
};
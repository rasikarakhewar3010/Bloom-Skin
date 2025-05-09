import React, { useState, useRef, useEffect } from 'react';

const BeforeAfterSlider = ({ beforeImage, afterImage, width = '100%', height = 'auto' }) => {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef(null);

  const handleMouseDown = () => {
    setIsDragging(true);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e) => {
    if (!isDragging || !containerRef.current) return;
    
    const containerRect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - containerRect.left;
    const percentage = Math.min(Math.max((x / containerRect.width) * 100, 0), 100);
    
    setSliderPosition(percentage);
  };

  useEffect(() => {
    const handleGlobalMouseUp = () => {
      if (isDragging) setIsDragging(false);
    };

    window.addEventListener('mouseup', handleGlobalMouseUp);
    return () => window.removeEventListener('mouseup', handleGlobalMouseUp);
  }, [isDragging]);

  return (
    <div 
      className="before-after-container"
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setIsDragging(false)}
      style={{ width, height, position: 'relative', overflow: 'hidden',borderRadius: '16px' }}
    >
      {afterImage && (
        <img
          src={afterImage}
          alt="After"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            position: 'absolute',
            top: 0,
            left: 0
          }}
        />
      )}
      
      {beforeImage && (
        <div
          style={{
            width: `${sliderPosition}%`,
            height: '100%',
            position: 'absolute',
            top: 0,
            left: 0,
            overflow: 'hidden'
          }}
        >
          <img
            src={beforeImage}
            alt="Before"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover'
            }}
          />
        </div>
      )}
      
      <div
        className="slider-line"
        style={{
          position: 'absolute',
          left: `${sliderPosition}%`,
          top: 0,
          bottom: 0,
          width: '4px',
          backgroundColor: 'white',
          cursor: 'ew-resize',
          transform: 'translateX(-2px)',
          zIndex: 10
        }}
        onMouseDown={handleMouseDown}
      >
        <div
          className="slider-handle"
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            backgroundColor: 'white',
            transform: 'translate(-50%, -50%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 2px 10px rgba(0,0,0,0.2)'
          }}
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M8 15l4 4 4-4M16 9l-4-4-4 4" />
          </svg>
        </div>
      </div>
      
      <style jsx>{`
        .before-after-container {
          user-select: none;
        }
        
        .before-after-container:active {
          cursor: ew-resize;
        }
      `}</style>
    </div>
  );
};

export default BeforeAfterSlider;
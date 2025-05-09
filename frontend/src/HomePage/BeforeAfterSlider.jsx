import React, { useState, useRef, useEffect } from 'react';

const BeforeAfterSlider = ({ beforeImage, afterImage, width = '100%', height = 'auto' }) => {
  const [sliderPosition, setSliderPosition] = useState(50); // Default to half-half
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef(null);

  const handleMouseDown = () => setIsDragging(true);
  const handleMouseUp = () => setIsDragging(false);

  const handleMouseMove = (e) => {
    if (!isDragging || !containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = Math.min(Math.max((x / rect.width) * 100, 0), 100);
    setSliderPosition(percentage);
  };

  useEffect(() => {
    const handleGlobalMouseUp = () => setIsDragging(false);
    window.addEventListener('mouseup', handleGlobalMouseUp);
    return () => window.removeEventListener('mouseup', handleGlobalMouseUp);
  }, []);

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseUp}
      style={{
        width,
        height,
        position: 'relative',
        overflow: 'hidden',
        borderRadius: '16px',
        userSelect: 'none',
      }}
    >
      {/* After Image */}
      <img
        src={afterImage}
        alt="After"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          height: '100%',
          width: '100%',
          objectFit: 'cover',
        }}
      />

      {/* Before Image (visible only to sliderPosition%) */}
      <img
        src={beforeImage}
        alt="Before"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          height: '100%',
          width: '100%',
          objectFit: 'cover',
          clipPath: `inset(0 ${100 - sliderPosition}% 0 0)`, // clip right side
        }}
      />

      {/* Slider handle */}
      <div
        style={{
          position: 'absolute',
          left: `${sliderPosition}%`,
          top: 0,
          bottom: 0,
          width: '4px',
          backgroundColor: 'white',
          cursor: 'ew-resize',
          transform: 'translateX(-2px)',
          zIndex: 10,
        }}
        onMouseDown={handleMouseDown}
      >
        <div
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
            boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
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
    </div>
  );
};

export default BeforeAfterSlider;

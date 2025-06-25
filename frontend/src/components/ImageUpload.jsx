import { useState, useRef, useEffect, useCallback } from 'react';

// --- Acne Info Data ---
const acneInfo = {
  "Blackheads": {
    cause: "Blackheads occur when pores are clogged with oil and dead skin cells, exposed to air, and oxidize.",
    prevention: "Cleanse regularly, avoid heavy oil-based products, and use salicylic acid or retinoids."
  },
  "Whiteheads": {
    cause: "Whiteheads are blocked pores that stay closed at the surface, trapping oil and dead skin cells.",
    prevention: "Gently exfoliate, avoid touching the face, and use non-comedogenic skincare."
  },
  "Pustules": {
    cause: "Pustules are inflamed pimples filled with pus caused by bacterial infection and clogged pores.",
    prevention: "Maintain proper hygiene, avoid popping pimples, and use benzoyl peroxide or topical antibiotics."
  },
  "Papules": {
    cause: "Papules are red, inflamed bumps without pus due to pore inflammation or bacterial growth.",
    prevention: "Use anti-inflammatory skincare, avoid scrubbing, and consult a dermatologist if severe."
  },
  "Cyst": {
    cause: "Cystic acne forms deep under the skin when pores are clogged with oil, bacteria, and dead cells.",
    prevention: "Consult a dermatologist, avoid self-treatment, and consider prescription medication."
  },
  "Unknown": { // Added fallback
    cause: "Could not confidently classify.",
    prevention: "Please try again with a clearer, well-lit image focused on the area of concern. If issues persist, consult a dermatologist."
  }
};

// --- Constants ---
const PREDICT_ENDPOINT = '/api/predict';
const MAX_FILE_SIZE_MB = 5;

// --- Component ---
export default function ImageUpload() {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('upload');
  const [cameraError, setCameraError] = useState(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState(null);
  
  // --- NEW: State for the camera warning modal ---
  const [showCameraWarning, setShowCameraWarning] = useState(false);

  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const fileInputRef = useRef(null);
  const containerRef = useRef(null);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setCameraActive(false);
  }, []);

  useEffect(() => {
    return () => stopCamera();
  }, [stopCamera]);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        containerRef.current.style.setProperty('--cursor-x', `${x}px`);
        containerRef.current.style.setProperty('--cursor-y', `${y}px`);
      }
    };
    const container = containerRef.current;
    if (container) container.addEventListener('mousemove', handleMouseMove);
    return () => {
      if (container) container.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  const processFile = (file) => {
    setError(null);
    setResult(null);
    if (!file) return;

    if (fileInputRef.current) fileInputRef.current.value = null;

    if (!file.type.match('image.*')) {
      setError('Please upload an image file (e.g., JPEG, PNG)');
      setImage(null); setPreview(null); return;
    }
    if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      setError(`File size should be less than ${MAX_FILE_SIZE_MB}MB`);
      setImage(null); setPreview(null); return;
    }
    setImage(file);
    setPreview(URL.createObjectURL(file));
  }

  const handleClear = useCallback(() => {
    setImage(null); setPreview(null); setResult(null);
    setError(null); setLoading(false); setCameraError(null);
    if (fileInputRef.current) fileInputRef.current.value = null;
    // Don't auto-start camera here, it will be handled by the modal flow
  }, []);

  const handleFileChange = (e) => processFile(e.target.files[0]);
  const handleDragOver = (e) => { e.preventDefault(); e.stopPropagation(); setIsDragging(true); };
  const handleDragLeave = (e) => { e.preventDefault(); e.stopPropagation(); setIsDragging(false); };
  const handleDrop = (e) => {
    e.preventDefault(); e.stopPropagation(); setIsDragging(false);
    if (e.dataTransfer.files?.[0]) {
      processFile(e.dataTransfer.files[0]);
      e.dataTransfer.clearData();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!image) {
      setError('Please select or capture an image first');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    const formData = new FormData();
    formData.append('image', image);

    const headers = {};
    const token = localStorage.getItem('token');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    try {
      const res = await fetch(PREDICT_ENDPOINT, {
        method: 'POST',
        headers: headers,
        body: formData,
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ 
          message: `Request failed with status: ${res.status}` 
        }));
        throw new Error(errorData.error || errorData.message);
      }

      const data = await res.json();

      if (data && typeof data.class !== 'undefined') {
        setResult(data);
      } else {
        throw new Error('Received invalid response format from analysis service.');
      }

    } catch (err) {
      console.error('Prediction failed:', err);
      setError(err.message || 'Analysis failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const startCamera = async () => {
    setImage(null); setPreview(null); setResult(null);
    setCameraError(null); setCameraActive(false);
    try {
      if (streamRef.current) stopCamera();
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false
      });
      if (videoRef.current) videoRef.current.srcObject = stream;
      streamRef.current = stream;
    } catch (err) {
      console.error("Camera access error:", err);
      let message = "Could not access camera.";
      if (err.name === 'NotAllowedError') message = "Camera access denied. Please check browser permissions.";
      if (err.name === 'NotFoundError') message = "No camera found on this device.";
      setCameraError(message); setCameraActive(false); streamRef.current = null;
    }
  };

  const capturePhoto = () => {
    if (!cameraActive || !videoRef.current || !streamRef.current) {
      setError("Camera not ready."); return;
    }
    setError(null); setResult(null);
    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth; canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    canvas.toBlob((blob) => {
      if (!blob) { setError('Failed to capture photo.'); return; }
      const file = new File([blob], `capture_${Date.now()}.jpg`, { type: 'image/jpeg' });
      setImage(file);
      setPreview(URL.createObjectURL(blob));
      stopCamera();
    }, 'image/jpeg', 0.90);
  };

  // --- UPDATED: This function now triggers the modal instead of the camera directly ---
  const handleTabChange = (tab) => {
    handleClear();
    setActiveTab(tab);
    if (tab === 'camera') {
      setShowCameraWarning(true); // Show the modal
    } else {
      stopCamera(); // Stop camera if switching to upload tab
    }
  };

  // --- NEW: Handlers for the warning modal ---
  const handleConfirmCamera = () => {
    setShowCameraWarning(false); // Close modal
    startCamera();              // Proceed to start camera
  };
  
  const handleCloseWarning = () => {
    setShowCameraWarning(false); // Close modal
    setActiveTab('upload');     // Revert tab to 'upload' to prevent UI confusion
  };


  const triggerFileInput = () => fileInputRef.current?.click();
  const details = result?.class ? (acneInfo[result.class] || acneInfo["Unknown"]) : null;
  // --- RENDER ---
  return (
    <div
      className="min-h-screen bg-white py-8 px-4 sm:px-6 lg:px-8 relative overflow-hidden select-none"
      ref={containerRef}
      style={{
        '--cursor-x': '0px',
        '--cursor-y': '0px',
      }}
    >
      {/* --- NEW: Render the warning modal when its state is true --- */}
      <CameraWarningModal
        isOpen={showCameraWarning}
        onConfirm={handleConfirmCamera}
        onClose={handleCloseWarning}
      />

      {/* Grid background */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div
          className="h-full w-full grid grid-cols-12 grid-rows-6"
          style={{
            maskImage:
              'linear-gradient(to bottom, transparent 0%, black 15%, black 85%, transparent 100%)',
            WebkitMaskImage:
              'linear-gradient(to bottom, transparent 0%, black 15%, black 85%, transparent 100%)',
            opacity: 0.2,
          }}
        >
          {Array.from({ length: 72 }).map((_, i) => (
            <div key={i} className="border border-black/10" />
          ))}
        </div>
      </div>

      {/* Cursor glow effect */}
      <div
        className="absolute inset-0 pointer-events-none z-0"
        style={{
          background: `radial-gradient(400px circle at var(--cursor-x) var(--cursor-y), rgba(236, 72, 153, 0.15) 0%, transparent 60%)`,
        }}
      ></div>

      <div className="max-w-7xl mx-auto relative z-10">
        { /* --- HEADER --- */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-extrabold text-black mb-4 tracking-tight">
            Bloom Skin AI
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Upload or take a photo to analyze your acne type and get personalized care tips.
          </p>
        </div>
        { /* --- MAIN CONTENT GRID --- */}
        <div className="flex flex-col lg:flex-row gap-8">
          { /* --- Left side - Upload/Camera --- */}
          <div className="lg:w-2/3 bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden border border-gray-100">
            { /* Tabs */}
            <div className="flex border-b border-gray-200 bg-white">
              <button
                aria-label="Upload Photo Tab"
                onClick={() => handleTabChange('upload')}
                className={`flex-1 py-4 px-6 text-center font-medium focus:outline-none transition-colors ${activeTab === 'upload' ? 'text-pink-600 border-b-2 border-pink-600 bg-pink-50/70' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'}`}
              >
                Upload Photo
              </button>
              <button
                aria-label="Take Photo Tab"
                onClick={() => handleTabChange('camera')}
                className={`flex-1 py-4 px-6 text-center font-medium focus:outline-none transition-colors ${activeTab === 'camera' ? 'text-pink-600 border-b-2 border-pink-600 bg-pink-50/70' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'}`}
              >
                Take Photo
              </button>
            </div>
            { /* Tab Content */}
            <div className="p-6 sm:p-8">
              { /* Error Alert */}
              {error && (
                <div className="mb-4 p-3 bg-red-100 border border-red-200 text-red-700 rounded-lg text-sm font-medium flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {error}
                </div>
              )}

              { /* UPLOAD TAB */}
              {activeTab === 'upload' ? (
                <div className="space-y-4">
                  { /* Drag / Click Area */}
                  <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={!preview ? triggerFileInput : undefined}
                    className={`border-2 border-dashed rounded-xl transition-all duration-300 min-h-[200px] flex items-center justify-center
                        ${preview ? 'border-pink-200 cursor-default'
                        : 'border-gray-300 hover:border-pink-300 cursor-pointer'}
                        ${isDragging ? 'border-pink-500 bg-pink-50 scale-105' : ''} 
                        `}
                  >
                    {preview ? (
                      <div className="p-2 w-full text-center">
                        <img
                          src={preview}
                          alt="Preview"
                          className="mx-auto max-h-80 object-contain rounded-lg shadow-sm"
                        />
                        <button
                          onClick={() => { handleClear(); setActiveTab('upload'); }}
                          className="mt-3 bg-gray-100 hover:bg-gray-200 text-gray-800 py-1.5 px-4 rounded-full text-sm transition-colors">
                          Clear Selection
                        </button>
                      </div>
                    ) : (
                      <div className="p-10 text-center">
                        <div className="mx-auto h-16 w-16 text-gray-400 mb-3">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z" />
                          </svg>
                        </div>
                        <p className="text-gray-600 mb-1">
                          <span className="font-semibold text-pink-600">Click to upload</span> or drag and drop
                        </p>
                        <p className="text-xs text-gray-500">JPG or PNG (max. {MAX_FILE_SIZE_MB}MB)</p>
                      </div>
                    )}
                  </div>
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/jpeg, image/png"
                    onChange={handleFileChange}
                    className="hidden"
                    aria-hidden="true"
                  />
                </div>
              ) : (
                /* CAMERA TAB */
                <div className="space-y-4">
                  {cameraError ? (
                    <div className="text-center py-12 bg-red-50 rounded-lg border border-red-200">
                      <p className="text-red-600 font-medium">{cameraError}</p>
                      <button
                        onClick={startCamera}
                        className="mt-4 bg-pink-600 hover:bg-pink-700 text-white py-2 px-5 rounded-full text-sm font-medium shadow"
                      >
                        Try Again
                      </button>
                    </div>
                  ) : (
                    <>
                      <div className="relative bg-black rounded-xl overflow-hidden aspect-video flex items-center justify-center border border-gray-700">
                        {preview ? (
                          <img
                            src={preview}
                            alt="Captured"
                            className="w-full h-full object-contain bg-black"
                          />
                        ) : (
                          <>
                            <video
                              ref={videoRef}
                              autoPlay
                              playsInline
                              muted
                              className="w-full h-full object-cover"
                              onCanPlay={() => setCameraActive(true)}
                            />
                            {!cameraActive && (
                              <div className="absolute inset-0 flex items-center justify-center bg-black/60">
                                <div className="text-white text-center">
                                  <Spinner className="h-8 w-8 mx-auto mb-3" />
                                  <p className="text-sm">Initializing camera...</p>
                                </div>
                              </div>
                            )}
                          </>
                        )}
                      </div>

                      <div className="flex gap-3">
                        {!preview && cameraActive && (
                          <button
                            aria-label="Capture Photo"
                            onClick={capturePhoto}
                            className="flex-1 bg-pink-600 hover:bg-pink-700 text-white py-3 rounded-lg font-medium transition duration-200 flex items-center justify-center space-x-2 shadow-md"
                          >
                            <CameraIcon className="h-5 w-5" />
                            <span>Capture Photo</span>
                          </button>
                        )}
                        {preview && (
                          <button
                            aria-label="Retake Photo"
                            onClick={() => { handleClear(); startCamera(); }}
                            className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-3 rounded-lg font-medium transition duration-200 flex items-center justify-center space-x-2">
                            <RefreshIcon className="h-5 w-5" />
                            <span>Retake Photo</span>
                          </button>
                        )}
                      </div>
                    </>
                  )}
                </div>
              )}

              <button
                onClick={handleSubmit}
                disabled={!image || loading}
                className={`mt-6 w-full py-3 px-6 rounded-xl font-semibold text-lg transition duration-300 flex items-center justify-center space-x-3 shadow-lg 
                    ${!image || loading
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed shadow-none'
                    : 'bg-gradient-to-r from-pink-500 to-purple-500 text-white hover:from-pink-600 hover:to-purple-600 active:scale-95 '}`}
              >
                {loading ? (
                  <>
                    <Spinner className="h-5 w-5" />
                    <span>Analyzing...</span>
                  </>
                ) : (
                  <>
                    <AnalyzeIcon className="h-6 w-6" />
                    <span>Analyze Skin</span>
                  </>
                )}
              </button>

            </div>
          </div>

          { /* --- Right side - Results --- */}
          <div className="lg:w-1/3 flex flex-col">
            <div className="flex-grow bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden border border-gray-100 flex flex-col">
              {result && details ? (
                <div className="p-6 sm:p-8 h-full flex flex-col">
                  <div className="flex items-center gap-3 pb-4 border-b border-gray-200">
                    <div className="flex-shrink-0 bg-pink-100 rounded-xl p-3">
                      <CheckShieldIcon className="h-7 w-7 text-pink-600" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-xl sm:text-2xl font-bold text-gray-900 truncate">
                        {result.class}
                      </h3>
                      {result.confidence != null && (
                        <p className="text-sm font-medium text-gray-500">
                          {(result.confidence * 100).toFixed(1)}% confidence
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="mt-6 space-y-5 flex-grow overflow-y-auto pr-2 custom-scrollbar">
                    <div className="bg-pink-50/70 rounded-xl p-4 border border-pink-100">
                      <h4 className="font-semibold text-base text-pink-700 flex items-center gap-2 mb-1.5">
                        <InfoIcon className="h-5 w-5 text-pink-500" />
                        Possible Causes
                      </h4>
                      <p className="text-sm text-gray-700 leading-relaxed">{details.cause}</p>
                    </div>

                    <div className="bg-green-50/70 rounded-xl p-4 border border-green-100">
                      <h4 className="font-semibold text-base text-green-700 flex items-center gap-2 mb-1.5">
                        <CheckIcon className="h-5 w-5 text-green-500" />
                        Treatment & Prevention
                      </h4>
                      <p className="text-sm text-gray-700 leading-relaxed">{details.prevention}</p>
                    </div>
                  </div>
                  <div className="mt-auto pt-4 ">
                    <p className="text-xs text-gray-500 italic leading-snug text-center">
                      Disclaimer: AI analysis is informational and not a substitute for professional medical advice.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="h-full flex items-center justify-center p-6 sm:p-8">
                  <div className="text-center max-w-xs mx-auto">
                    <div className="mx-auto h-16 w-16 text-gray-300 mb-4">
                      <BulbIcon />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-500 mb-1">Awaiting Analysis</h3>
                    <p className="text-sm text-gray-400">Results will appear here after you analyze an image.</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- NEW: Camera Warning Modal Component ---
// This component is self-contained and placed at the bottom for organizational clarity.
const CameraWarningModal = ({ isOpen, onConfirm, onClose }) => {
  if (!isOpen) return null;

  return (
    // Backdrop
    <div
      onClick={onClose}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 transition-opacity duration-300"
      style={{ animation: 'fadeIn 0.2s ease-out forwards' }}
    >
      {/* Modal Content */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 max-w-md w-full m-4 text-center transform transition-transform duration-300"
        style={{ animation: 'scaleIn 0.2s ease-out forwards' }}
      >
        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 mb-4">
          <PhoneCameraIcon className="h-7 w-7 text-blue-600" />
        </div>
        <h3 className="text-xl md:text-2xl font-bold text-gray-900">
          Important Camera Notice
        </h3>
        <p className="mt-3 text-base text-gray-600 leading-relaxed">
          Please use your <strong>phone's camera</strong> for capturing photos. Do not use the camera of a laptop or PC. Your photo should be <strong>clear enough</strong> for better results.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row-reverse gap-3">
          <button
            onClick={onConfirm}
            className="w-full sm:w-auto py-2.5 px-6 rounded-lg font-semibold text-white transition duration-200 bg-pink-600 hover:bg-pink-700 shadow-md active:scale-95"
          >
            Continue Anyway
          </button>
          <button
            onClick={onClose}
            className="w-full sm:w-auto py-2.5 px-6 rounded-lg font-semibold transition duration-200 bg-gray-100 hover:bg-gray-200 text-gray-700"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};


// --- SVG ICONS (To make component self-contained) ---
// ... (Your existing SVG icons)
const Spinner = ({ className }) => <svg className={`animate-spin ${className}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
const CameraIcon = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
const AnalyzeIcon = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
const CheckShieldIcon = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
const InfoIcon = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
const CheckIcon = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
const BulbIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}><path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>
const RefreshIcon = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" /></svg>
// NEW: Icon for the modal
const PhoneCameraIcon = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" /></svg>
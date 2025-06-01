import { useState, useRef } from 'react';

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
  }
};

export default function ImageUpload() {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('upload'); // 'upload' or 'camera'
  const [cameraError, setCameraError] = useState(null);
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
      setResult(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!image) return;

    setLoading(true);
    const formData = new FormData();
    formData.append('image', image);

    try {
      const res = await fetch('http://localhost:5000/predict', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      setResult(data);
    } catch (error) {
      console.error('Prediction failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'user' }, 
        audio: false 
      });
      videoRef.current.srcObject = stream;
      streamRef.current = stream;
      setCameraError(null);
    } catch (err) {
      console.error("Camera error:", err);
      setCameraError("Could not access camera. Please check permissions.");
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
  };

  const capturePhoto = () => {
    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d').drawImage(video, 0, 0);
    
    canvas.toBlob((blob) => {
      const file = new File([blob], 'capture.jpg', { type: 'image/jpeg' });
      setImage(file);
      setPreview(URL.createObjectURL(blob));
      setResult(null);
      stopCamera();
      setActiveTab('upload');
    }, 'image/jpeg', 0.95);
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (tab === 'camera') {
      startCamera();
    } else {
      stopCamera();
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  const details = result?.class ? acneInfo[result.class] : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600 mb-3">
            Bloom Skin AI
          </h1>
          <p className="text-lg text-gray-600">
            Upload or take a photo to analyze your acne type and get personalized care tips
          </p>
        </div>

        <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
          {/* Tabs */}
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => handleTabChange('upload')}
              className={`flex-1 py-4 px-6 text-center font-medium text-sm focus:outline-none transition-colors ${activeTab === 'upload' ? 'text-pink-600 border-b-2 border-pink-600 bg-pink-50' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'}`}
            >
               Upload Photo
            </button>
            <button
              onClick={() => handleTabChange('camera')}
              className={`flex-1 py-4 px-6 text-center font-medium text-sm focus:outline-none transition-colors ${activeTab === 'camera' ? 'text-pink-600 border-b-2 border-pink-600 bg-pink-50' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'}`}
            >
               Take Photo
            </button>
          </div>

          <div className="p-6 sm:p-8">
            {activeTab === 'upload' ? (
              <div className="space-y-6">
                <div 
                  onClick={triggerFileInput}
                  className={`border-2 border-dashed rounded-2xl cursor-pointer transition-all ${preview ? 'border-pink-200' : 'border-gray-300 hover:border-pink-300'}`}
                >
                  {preview ? (
                    <div className="p-4">
                      <img
                        src={preview}
                        alt="Preview"
                        className="mx-auto max-h-80 object-contain rounded-xl"
                      />
                    </div>
                  ) : (
                    <div className="p-12 text-center">
                      <div className="mx-auto h-24 w-24 text-gray-400 mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <p className="text-gray-600 mb-2">
                        <span className="font-medium text-pink-600">Click to upload</span> or drag and drop
                      </p>
                      <p className="text-xs text-gray-500">JPG or PNG (max. 5MB)</p>
                    </div>
                  )}
                </div>
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </div>
            ) : (
              <div className="space-y-6">
                {cameraError ? (
                  <div className="text-center py-8 bg-red-50 rounded-xl">
                    <p className="text-red-500">{cameraError}</p>
                  </div>
                ) : (
                  <>
                    <div className="relative bg-black rounded-xl overflow-hidden">
                      <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        muted
                        className="w-full h-auto max-h-80 mx-auto"
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        {!streamRef.current && (
                          <div className="text-white">
                            <svg className="animate-spin h-8 w-8 mx-auto mb-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            <p>Initializing camera...</p>
                          </div>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={capturePhoto}
                      disabled={!streamRef.current}
                      className="w-full bg-pink-600 hover:bg-pink-700 text-white py-3 rounded-lg font-medium transition duration-200 flex items-center justify-center space-x-2 disabled:opacity-50"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span>Take Photo</span>
                    </button>
                  </>
                )}
              </div>
            )}

            <button
              onClick={handleSubmit}
              disabled={!image || loading}
              className={`mt-6 w-full py-3 px-4 rounded-xl font-medium transition duration-200 flex items-center justify-center space-x-2 ${!image || loading ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-gradient-to-r from-pink-600 to-purple-600 text-white hover:from-pink-700 hover:to-purple-700 shadow-lg'}`}
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Analyzing...</span>
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  <span>Analyze Skin</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Results Section */}
        {result && (
          <div className="mt-8 bg-white rounded-3xl shadow-xl overflow-hidden animate-fade-in-up">
            <div className="p-6 sm:p-8">
              <div className="flex items-start">
                <div className="flex-shrink-0 bg-pink-100 rounded-lg p-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-pink-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <h3 className="text-2xl font-bold text-gray-900">
                    {result.class} <span className="text-sm font-normal text-gray-500 ml-2">{(result.confidence * 100).toFixed(1)}% confidence</span>
                  </h3>
                  
                  {details && (
                    <div className="mt-4 space-y-4">
                      <div className="bg-pink-50 rounded-xl p-4">
                        <h4 className="font-semibold text-pink-700 flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          Causes
                        </h4>
                        <p className="mt-2 text-gray-700">{details.cause}</p>
                      </div>
                      
                      <div className="bg-green-50 rounded-xl p-4">
                        <h4 className="font-semibold text-green-700 flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          Treatment & Prevention
                        </h4>
                        <p className="mt-2 text-gray-700">{details.prevention}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="mt-6 pt-6 border-t border-gray-200">
                <p className="text-sm text-gray-500">
                  Disclaimer: This analysis is for informational purposes only and not a substitute for professional medical advice.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
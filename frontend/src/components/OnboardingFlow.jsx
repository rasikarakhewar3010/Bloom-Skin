import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { updateProfile } from '../api/apiService';

const OnboardingFlow = ({ onComplete }) => {
  const { user, setUser } = useAuth();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    skinType: '',
    environment: '',
    currentConcerns: [],
    knownAllergies: [],
  });

  const concernsList = ['Acne', 'Dark Spots', 'Redness', 'Wrinkles', 'Dryness', 'Oiliness', 'Texture'];

  const handleNext = () => setStep(step + 1);
  const handleBack = () => setStep(step - 1);

  const toggleConcern = (concern) => {
    setFormData((prev) => {
      const isSelected = prev.currentConcerns.includes(concern);
      if (isSelected) {
        return { ...prev, currentConcerns: prev.currentConcerns.filter((c) => c !== concern) };
      } else {
        return { ...prev, currentConcerns: [...prev.currentConcerns, concern] };
      }
    });
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const res = await updateProfile({ skinProfile: formData });
      if (res.user) {
        setUser(res.user);
      }
      onComplete(); // Close modal
    } catch (err) {
      console.error('Error updating profile:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-300">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden relative">
        {/* Progress Bar */}
        <div className="h-1 w-full bg-gray-100">
          <div 
            className="h-full bg-pink-500 transition-all duration-300" 
            style={{ width: `${(step / 3) * 100}%` }}
          />
        </div>

        <div className="p-8">
          <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">
            Let's personalize your experience 🌸
          </h2>

          {step === 1 && (
            <div className="space-y-4 animate-in slide-in-from-right">
              <p className="text-center text-gray-500 mb-6 font-medium">What is your skin type?</p>
              <div className="grid grid-cols-2 gap-3">
                {['oily', 'dry', 'combination', 'normal', 'sensitive'].map((type) => (
                  <button
                    key={type}
                    onClick={() => setFormData({ ...formData, skinType: type })}
                    className={`py-3 px-4 rounded-xl border-2 text-sm font-semibold capitalize transition-all cursor-pointer ${
                      formData.skinType === type
                        ? 'border-pink-500 bg-pink-50 text-pink-600 shadow-sm'
                        : 'border-gray-100 hover:border-pink-200 text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4 animate-in slide-in-from-right">
              <p className="text-center text-gray-500 mb-6 font-medium">What is your primary environment?</p>
              <div className="grid grid-cols-2 gap-3">
                {['humid', 'dry', 'polluted', 'temperate'].map((env) => (
                  <button
                    key={env}
                    onClick={() => setFormData({ ...formData, environment: env })}
                    className={`py-3 px-4 rounded-xl border-2 text-sm font-semibold capitalize transition-all cursor-pointer ${
                      formData.environment === env
                        ? 'border-pink-500 bg-pink-50 text-pink-600 shadow-sm'
                        : 'border-gray-100 hover:border-pink-200 text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    {env}
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4 animate-in slide-in-from-right">
              <p className="text-center text-gray-500 mb-6 font-medium">Any specific concerns?</p>
              <div className="flex flex-wrap gap-2 justify-center">
                {concernsList.map((concern) => (
                  <button
                    key={concern}
                    onClick={() => toggleConcern(concern)}
                    className={`py-2 px-4 rounded-full border-2 text-sm font-semibold transition-all cursor-pointer ${
                      formData.currentConcerns.includes(concern)
                        ? 'border-pink-500 bg-pink-500 text-white shadow-sm'
                        : 'border-gray-200 hover:border-pink-200 text-gray-600'
                    }`}
                  >
                    {concern}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="flex justify-between mt-10 pt-4 border-t border-gray-100">
            {step > 1 ? (
              <button
                onClick={handleBack}
                className="px-6 py-2 rounded-full font-bold text-gray-500 hover:bg-gray-100 transition-colors cursor-pointer"
              >
                Back
              </button>
            ) : (
              <div /> // Placeholder for alignment
            )}
            
            {step < 3 ? (
              <button
                onClick={handleNext}
                disabled={step === 1 && !formData.skinType || step === 2 && !formData.environment}
                className="px-8 py-2 rounded-full font-bold bg-pink-500 text-white hover:bg-pink-600 transition-colors shadow-md disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                Next
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="px-8 py-2 rounded-full font-bold bg-gradient-to-r from-pink-500 to-purple-600 text-white hover:shadow-lg transition-all shadow-md cursor-pointer disabled:opacity-50"
              >
                {loading ? 'Saving...' : 'Finish Setup'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnboardingFlow;

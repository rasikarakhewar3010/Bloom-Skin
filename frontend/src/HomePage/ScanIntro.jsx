import React from 'react';
import BeforeAfterSlider from './BeforeAfterSlider';
// 1. Import the useNavigate hook
import { useNavigate } from 'react-router-dom';

const ScanIntro = () => {
    // 2. Get the navigate function from the hook
    const navigate = useNavigate();

    // 3. Create a handler function to navigate to the desired URL
    const handleNavigateToChat = () => {
        navigate('/aichat');
    };

    return (
        <div className="container mx-auto">
            <div className="flex flex-wrap">
                <div className="w-full md:w-1/2 p-4">
                    <BeforeAfterSlider
                        beforeImage="/images/before3.png"
                        afterImage="/images/after3.png"
                        width="100%"
                        height="500px"
                    />

                </div>
                <div className="w-full md:w-1/2 p-4">
                    <div className="flex flex-col items-center h-full p-6 bg-white rounded-lg shadow-sm">
                        <h2 className="text-2xl font-bold mb-4 font-sans text-center">
                            Unlock Your Personalized Skin Analysis
                        </h2>
                        <div className='flex flex-col items-center justify-center h-full'>
                            <ul className="space-y-2 mb-6 text-left">
                                <li className="flex items-start">
                                    <span className="text-[#ff4f8b] mr-2">✓</span>
                                    <span> Instantly detect concerns like acne, dark spots, and texture.</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="text-[#ff4f8b] mr-2">✓</span>
                                    <span>Receive AI-powered recommendations tailored to your unique skin.</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="text-[#ff4f8b] mr-2">✓</span>
                                    <span>Track your skin's progress over time with objective data.</span>
                                </li>
                            </ul>

                            <p className="text-center text-gray-600 mb-4">
                                Join thousands who are building smarter skincare routines based on data, not trends.
                            </p>

                            {/* 4. Attach the handler to the button's onClick event */}
                            <button 
                                onClick={handleNavigateToChat}
                                className="bg-[#ff4f8b] hover:bg-[#e8437d] text-white font-medium py-2 px-6 rounded-full transition-all duration-300 transform hover:scale-105 shadow-md">
                                Start Your Skin Analysis
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ScanIntro;
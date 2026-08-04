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
        <section className="py-20 sm:py-24 bg-white relative overflow-hidden">
            {/* Background decorative elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-pink-50 opacity-50 blur-3xl"></div>
                <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-pink-50 opacity-50 blur-3xl"></div>
            </div>

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl relative z-10">
                <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
                    {/* Left side: Slider */}
                    <div className="w-full lg:w-1/2 rounded-2xl overflow-hidden shadow-2xl shadow-pink-100 border border-gray-100">
                        <BeforeAfterSlider
                            beforeImage="/images/before3.png"
                            afterImage="/images/after3.png"
                            width="100%"
                            height="500px"
                        />
                    </div>
                    
                    {/* Right side: Content */}
                    <div className="w-full lg:w-1/2">
                        <div className="flex flex-col h-full bg-transparent">
                            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 mb-6 tracking-tight leading-tight">
                                Unlock Your Personalized <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-pink-400">Skin Analysis</span>
                            </h2>
                            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                                Join thousands who are building smarter skincare routines based on data, not trends. See exactly what your skin needs in seconds.
                            </p>
                            
                            <ul className="space-y-4 mb-10 text-left">
                                <li className="flex items-start">
                                    <div className="flex-shrink-0 mt-1 flex items-center justify-center w-6 h-6 rounded-full bg-pink-100 text-pink-600">
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                                    </div>
                                    <span className="ml-4 text-gray-700 text-lg">Instantly detect concerns like acne, dark spots, and texture.</span>
                                </li>
                                <li className="flex items-start">
                                    <div className="flex-shrink-0 mt-1 flex items-center justify-center w-6 h-6 rounded-full bg-pink-100 text-pink-600">
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                                    </div>
                                    <span className="ml-4 text-gray-700 text-lg">Receive AI-powered recommendations tailored to your unique skin.</span>
                                </li>
                                <li className="flex items-start">
                                    <div className="flex-shrink-0 mt-1 flex items-center justify-center w-6 h-6 rounded-full bg-pink-100 text-pink-600">
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                                    </div>
                                    <span className="ml-4 text-gray-700 text-lg">Track your skin's progress over time with objective data.</span>
                                </li>
                            </ul>

                            {/* 4. Attach the handler to the button's onClick event */}
                            <div>
                                <button 
                                    onClick={handleNavigateToChat}
                                    className="group relative inline-flex items-center justify-center px-8 py-3.5 text-base font-bold text-white transition-all duration-200 bg-gray-900 border border-transparent rounded-full hover:bg-gray-800 hover:-translate-y-0.5 shadow-lg shadow-gray-900/20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900">
                                    Start Your Skin Analysis
                                    <svg className="w-5 h-5 ml-2 -mr-1 transition-transform duration-200 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path></svg>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ScanIntro;
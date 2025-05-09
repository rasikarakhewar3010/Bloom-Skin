import React from 'react';
import BeforeAfterSlider from './BeforeAfterSlider';

const ScanIntro = () => {
    return (
        <div className="container mx-auto">
            <div className="flex flex-wrap">
                <div className="w-full md:w-1/2 p-4">
                    <BeforeAfterSlider
                        beforeImage="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSL_eLXjR6L5kuW7Bv-ny-o48UgwrBEW9-gAw&s"
                        afterImage="https://marketplace.canva.com/EAFiN8tytkM/1/0/900w/canva-brown-aesthetic-flower-phone-wallpaper-JdUFkY6mPh4.jpg"
                        width="100%"
                        height="500px"
                    />

                </div>
                <div className="w-full md:w-1/2 p-4">
                    <div className="flex flex-col items-center  h-full p-6 bg-white rounded-lg shadow-sm">
                        <h2 className="text-2xl font-bold  mb-4 font-sans text-center">
                            Your Skin Transformation Journey
                        </h2>
                        <div className='flex  flex-col items-center justify-center h-full'>
                            <ul className="space-y-2 mb-6 text-left">
                            <li className="flex items-start">
                                <span className="text-[#ff4f8b] mr-2">✓</span>
                                <span>Reduces visible pores by up to 40%</span>
                            </li>
                            <li className="flex items-start">
                                <span className="text-[#ff4f8b] mr-2">✓</span>
                                <span>Improves skin texture in just 7 days</span>
                            </li>
                            <li className="flex items-start">
                                <span className="text-[#ff4f8b] mr-2">✓</span>
                                <span>Clinically proven to boost hydration</span>
                            </li>
                        </ul>

                        <p className="text-center text-gray-600 mb-4">
                            Join thousands who've discovered their healthiest skin with Bloom Skin's personalized care system.
                        </p>

                        <button className="bg-[#ff4f8b] hover:bg-[#e8437d] text-white font-medium py-2 px-6 rounded-full transition-all duration-300 transform hover:scale-105 shadow-md">
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
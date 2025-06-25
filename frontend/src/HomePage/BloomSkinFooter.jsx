import React from 'react';
import { FiInstagram, FiTwitter, FiGithub, FiMail } from 'react-icons/fi';

const BloomSkinFooter = () => {
  return (
    // THE CHANGE IS HERE: Restored the original gradient background
    <footer className="bg-gradient-to-b from-pink-50 to-pink-100 pt-16 pb-8 border-t border-pink-200">
      <div className="container mx-auto px-4">

        {/* --- DEVELOPMENT NOTE --- */}
        <div className="text-center mb-12 p-4 bg-white/50 rounded-lg border border-pink-200">
          <p className="text-sm text-pink-800">
            <strong>Please Note:</strong> Bloom Skin is a student project created for educational purposes. 
            We are actively developing new features and improving our AI model.
          </p>
        </div>

        {/* --- Main Footer Content --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 mb-12">
          
          {/* Brand Column */}
          <div className="space-y-4">
            <div className="flex items-center">
              {/* USE YOUR LOGO IMAGE HERE */}
              <img 
                src="/images/BLOOM SKIN LOGO.PNG" // Make sure you have a logo.png in your /public folder
                alt="Bloom Skin Logo" 
                className="h-8 w-8 mr-3"
              />
              <span className="text-2xl font-bold text-pink-600">BloomSkin</span>
            </div>
            <p className="text-gray-600 pr-4">
              AI-powered insights for your unique skin. Your path to healthier skin, powered by intelligent technology.
            </p>
            <div className="flex space-x-4 pt-2">
              <a href="#" aria-label="GitHub" className="text-gray-500 hover:text-pink-600 transition-colors">
                <FiGithub className="h-6 w-6" />
              </a>
              <a href="#" aria-label="Twitter" className="text-gray-500 hover:text-pink-600 transition-colors">
                <FiTwitter className="h-6 w-6" />
              </a>
              <a href="#" aria-label="Instagram" className="text-gray-500 hover:text-pink-600 transition-colors">
                <FiInstagram className="h-6 w-6" />
              </a>
            </div>
          </div>

          {/* Project Links Column */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4"> Quick links</h3>
            <ul className="space-y-3">
              <li>
                <a href="/" className="text-gray-600 hover:text-pink-600 transition-colors">
                  Home
                </a>
              </li>
              <li>
                <a href="/aichat" className="text-gray-600 hover:text-pink-600 transition-colors">
                  AI camera
                </a>
              </li>
              <li>
                <a href="/gide" className="text-gray-600 hover:text-pink-600 transition-colors">
                  BloomSkin Guide
                </a>
              </li>
              <li>
                <a href="/contact" className="text-gray-600 hover:text-pink-600 transition-colors">
                  Contact Us 
                </a>
              </li>
            </ul>
          </div>

          {/* Connect Column */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Connect</h3>
            <p className="text-gray-600 mb-4">Have questions or feedback? We’d love to hear from you.</p>
            <ul className="space-y-3">
              {/* <li className="flex items-start">
                <FiMail className="text-pink-500 mt-1 mr-3 flex-shrink-0" />
                <a href="mailto:feedback.bloomskin@gmail.com" className="text-gray-600 hover:text-pink-600 transition-colors">
                  feedback.bloomskin@gmail.com
                </a>
              </li> */}
              <li className="flex items-start">
                <FiGithub className="text-pink-500 mt-1 mr-3 flex-shrink-0" />
                <a href="https://github.com/rasikarakhewar3010" className="text-gray-600 hover:text-pink-600 transition-colors">
                  View on GitHub
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* --- Bottom Bar --- */}
        <div className="pt-8 border-t border-pink-200 text-center text-sm text-gray-500">
          <p className="mb-1">
            © {new Date().getFullYear()} BloomSkin Project. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default BloomSkinFooter;
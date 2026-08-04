import React from 'react';
import { Instagram, Twitter, Github } from 'lucide-react';
import { Link } from 'react-router-dom';

const BloomSkinFooter = () => {
  return (
    <footer className="bg-pink-50 border-t border-pink-100 pt-10 pb-6">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
          
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center">
              <img 
                src="/images/BLOOM SKIN LOGO.PNG"
                alt="Bloom Skin Logo" 
                className="h-10 w-10 mr-3 object-contain"
              />
              <span className="text-2xl font-extrabold tracking-tight text-gray-900">
                BloomSkin
              </span>
            </div>
            <p className="text-gray-500 text-base leading-relaxed max-w-md">
              Your personalized AI dermatologist. We combine advanced machine learning with dermatological insights to help you achieve your healthiest skin yet.
            </p>
            <div className="flex space-x-5 pt-2">
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter" className="text-gray-400 hover:text-pink-500 transition-colors bg-gray-50 hover:bg-pink-50 p-2.5 rounded-full">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="text-gray-400 hover:text-pink-500 transition-colors bg-gray-50 hover:bg-pink-50 p-2.5 rounded-full">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="https://github.com/rasikarakhewar3010" aria-label="GitHub" className="text-gray-400 hover:text-pink-500 transition-colors bg-gray-50 hover:bg-pink-50 p-2.5 rounded-full">
                <Github className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-5">Product</h3>
            <ul className="space-y-4">
              <li>
                <Link to="/" className="text-gray-500 hover:text-pink-600 font-medium transition-colors">Overview</Link>
              </li>
              <li>
                <Link to="/aichat" className="text-gray-500 hover:text-pink-600 font-medium transition-colors">AI Analysis</Link>
              </li>
              <li>
                <Link to="/guide" className="text-gray-500 hover:text-pink-600 font-medium transition-colors">Skin Guide</Link>
              </li>
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-5">Company</h3>
            <ul className="space-y-4">
              <li>
                <Link to="/contact" className="text-gray-500 hover:text-pink-600 font-medium transition-colors">Contact Us</Link>
              </li>
              <li>
                <Link to="/privacy" className="text-gray-500 hover:text-pink-600 font-medium transition-colors">Privacy Policy</Link>
              </li>
              <li>
                <Link to="/terms" className="text-gray-500 hover:text-pink-600 font-medium transition-colors">Terms of Service</Link>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-pink-100 flex justify-center items-center text-center">
          <p className="text-sm text-gray-500 font-medium">
            © {new Date().getFullYear()} BloomSkin Inc. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default BloomSkinFooter;
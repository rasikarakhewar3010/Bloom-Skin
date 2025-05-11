import React from 'react';
import { FiInstagram, FiTwitter, FiFacebook, FiMail, FiMapPin, FiPhone } from 'react-icons/fi';

const BloomSkinFooter = () => {
  return (
    <footer className="bg-gradient-to-b from-pink-50 to-pink-100 pt-16 pb-8 border-t border-pink-200">
      <div className="container mx-auto px-4">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          
          {/* Brand Column */}
          <div className="space-y-4">
            <div className="flex items-center">
              <svg
                width="32"
                height="32"
                viewBox="0 0 32 32"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="mr-2 h-8 w-8"
              >
                <path
                  d="M16 2C8.268 2 2 8.268 2 16C2 23.732 8.268 30 16 30C23.732 30 30 23.732 30 16C30 8.268 23.732 2 16 2ZM16 26C10.477 26 6 21.523 6 16C6 10.477 10.477 6 16 6C21.523 6 26 10.477 26 16C26 21.523 21.523 26 16 26Z"
                  fill="#EC4899"
                />
                <path
                  d="M16 10C12.686 10 10 12.686 10 16C10 19.314 12.686 22 16 22C19.314 22 22 19.314 22 16C22 12.686 19.314 10 16 10Z"
                  fill="#F472B6"
                />
              </svg>
              <span className="text-2xl font-bold text-pink-600">BloomSkin</span>
            </div>
            <p className="text-gray-600">
              Science-backed skincare solutions tailored to your unique skin needs.
            </p>
            <div className="flex space-x-4 pt-2">
              <a href="#" className="text-pink-500 hover:text-pink-700 transition-colors">
                <FiInstagram className="h-6 w-6" />
              </a>
              <a href="#" className="text-pink-500 hover:text-pink-700 transition-colors">
                <FiTwitter className="h-6 w-6" />
              </a>
              <a href="#" className="text-pink-500 hover:text-pink-700 transition-colors">
                <FiFacebook className="h-6 w-6" />
              </a>
            </div>
          </div>

          {/* Contact Column */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Contact</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <FiMapPin className="text-pink-500 mt-1 mr-3 flex-shrink-0" />
                <span className="text-gray-600">123 Beauty St, Skinville SV 12345</span>
              </li>
              <li className="flex items-start">
                <FiMail className="text-pink-500 mt-1 mr-3 flex-shrink-0" />
                <a href="mailto:hello@bloomskin.com" className="text-gray-600 hover:text-pink-500 transition-colors">
                  hello@bloomskin.com
                </a>
              </li>
              <li className="flex items-start">
                <FiPhone className="text-pink-500 mt-1 mr-3 flex-shrink-0" />
                <a href="tel:+11234567890" className="text-gray-600 hover:text-pink-500 transition-colors">
                  +1 (123) 456-7890
                </a>
              </li>
            </ul>
          </div>

          {/* Quick Links Column */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-gray-600 hover:text-pink-500 transition-colors">
                  About Us
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-pink-500 transition-colors">
                  Skin Quiz
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-pink-500 transition-colors">
                  FAQ
                </a>
              </li>
              
            </ul>
          </div>

          {/* Policies Column */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Policies</h3>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-gray-600 hover:text-pink-500 transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-pink-500 transition-colors">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-pink-500 transition-colors">
                  Shipping Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-pink-500 transition-colors">
                  Return Policy
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Newsletter Subscription */}
        <div className="bg-white rounded-xl p-8 mb-12 shadow-sm border border-pink-200">
          <div className="max-w-2xl mx-auto text-center">
            <h3 className="text-2xl font-bold text-gray-800 mb-2">Stay Blooming Beautiful</h3>
            <p className="text-gray-600 mb-6">
              Subscribe to our newsletter for skincare tips, exclusive offers, and product updates.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Your email address"
                className="flex-grow px-4 py-3 rounded-lg border border-pink-300 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              />
              <button className="px-6 py-3 bg-gradient-to-r from-pink-500 to-pink-600 text-white rounded-lg font-medium hover:from-pink-600 hover:to-pink-700 transition-all shadow hover:shadow-md whitespace-nowrap">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-pink-200 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-600 mb-4 md:mb-0">
            © {new Date().getFullYear()} BloomSkin. All rights reserved.
          </p>
          <div className="flex space-x-6">
            <a href="#" className="text-gray-600 hover:text-pink-500 transition-colors text-sm">
              Accessibility
            </a>
            <a href="#" className="text-gray-600 hover:text-pink-500 transition-colors text-sm">
              Sitemap
            </a>
            <a href="#" className="text-gray-600 hover:text-pink-500 transition-colors text-sm">
              Careers
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default BloomSkinFooter;
import React from 'react';
import { NavbarDemo } from '../NavbarDemo';
import BloomSkinFooter from '../HomePage/BloomSkinFooter';

const TermsOfService = () => {
  return (
    <div className="min-h-screen bg-gray-50/50 flex flex-col">
      <NavbarDemo />
      
      <main className="flex-grow pt-32 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto bg-white p-8 md:p-12 rounded-2xl shadow-sm border border-gray-100">
          <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-8 tracking-tight">Terms of Service</h1>
          
          <div className="prose prose-pink max-w-none text-gray-600 leading-relaxed space-y-6">
            <p className="text-lg">Last updated: August 2026</p>
            
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">1. Acceptance of Terms</h2>
              <p>By accessing and using Bloom Skin AI, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by these terms, please do not use our service.</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">2. Medical Disclaimer</h2>
              <p className="font-medium text-pink-600">Bloom Skin AI is an educational and informational tool, NOT a medical diagnostic service.</p>
              <p>The skin analysis and recommendations provided by our AI are for informational purposes only and are not intended to be a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition.</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">3. User Accounts</h2>
              <p>To use certain features of the service, you must register for an account. You are responsible for maintaining the confidentiality of your account information and for all activities that occur under your account.</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">4. User Content</h2>
              <p>By uploading images to Bloom Skin AI, you grant us a license to process these images to provide our services. You represent and warrant that you own or have the necessary rights to upload the images and that they do not violate any third-party rights.</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">5. Limitation of Liability</h2>
              <p>In no event shall Bloom Skin AI, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the Service.</p>
            </section>
          </div>
        </div>
      </main>

      <BloomSkinFooter />
    </div>
  );
};

export default TermsOfService;

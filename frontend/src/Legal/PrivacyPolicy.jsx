import React from 'react';
import { NavbarDemo } from '../NavbarDemo';
import BloomSkinFooter from '../HomePage/BloomSkinFooter';

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-gray-50/50 flex flex-col">
      <NavbarDemo />
      
      <main className="flex-grow pt-32 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto bg-white p-8 md:p-12 rounded-2xl shadow-sm border border-gray-100">
          <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-8 tracking-tight">Privacy Policy</h1>
          
          <div className="prose prose-pink max-w-none text-gray-600 leading-relaxed space-y-6">
            <p className="text-lg">Last updated: August 2026</p>
            
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">1. Information We Collect</h2>
              <p>When you use Bloom Skin AI, we may collect the following types of information:</p>
              <ul className="list-disc pl-6 space-y-2 mt-4">
                <li><strong>Images:</strong> Photos you upload for skin analysis.</li>
                <li><strong>Account Information:</strong> Your name, email address, and profile details when you register.</li>
                <li><strong>Usage Data:</strong> Information about how you interact with our application, including scan history and preferences.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">2. How We Use Your Information</h2>
              <p>We use the information we collect to:</p>
              <ul className="list-disc pl-6 space-y-2 mt-4">
                <li>Provide our AI skin analysis services and generate personalized recommendations.</li>
                <li>Improve our machine learning models (anonymized data only).</li>
                <li>Communicate with you regarding your account, updates, and customer support.</li>
                <li>Ensure the security and integrity of our platform.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">3. Data Security & Privacy</h2>
              <p>Your privacy is paramount. Images uploaded for analysis are processed securely and are never linked to your personal identity without your explicit consent. We implement industry-standard encryption and security measures to protect your data from unauthorized access.</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">4. Sharing Your Information</h2>
              <p>We do not sell, trade, or rent your personal identification information to others. We may share generic aggregated demographic information not linked to any personal identification information regarding visitors and users with our business partners.</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">5. Contact Us</h2>
              <p>If you have any questions about this Privacy Policy, the practices of this site, or your dealings with this site, please contact us at support@bloomskin.ai.</p>
            </section>
          </div>
        </div>
      </main>

      <BloomSkinFooter />
    </div>
  );
};

export default PrivacyPolicy;

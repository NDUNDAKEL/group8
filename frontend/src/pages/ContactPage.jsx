import React from 'react';

const ContactPage = () => {
  return (
    // Main container for the Contact page, styled for a dark theme and responsive padding
    <div className="min-h-screen bg-gray-900 text-gray-100 font-inter py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Page Title */}
        <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-8 text-center">
          Contact Us
        </h1>

        {/* Introduction */}
        <p className="text-lg sm:text-xl text-gray-300 mb-12 text-center max-w-2xl mx-auto">
          We're here to help! Whether you have questions about MoringaPair, need technical support, or want to explore partnership opportunities, feel free to reach out.
        </p>

        {/* Contact Information Sections */}
        <section className="mb-12 space-y-8">
          {/* General Inquiries */}
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg text-center">
            <h2 className="text-2xl font-bold text-blue-400 mb-3">General Inquiries</h2>
            <p className="text-lg text-gray-300 mb-2">
              For general questions about MoringaPair, our features, or how we can benefit your institution, please email us at:
            </p>
            <a href="mailto:tallambrian633@gmail" className="text-xl font-semibold text-blue-300 hover:underline">
              info@moringapair.com
            </a>
          </div>

          {/* Technical Support */}
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg text-center">
            <h2 className="text-2xl font-bold text-purple-400 mb-3">Technical Support</h2>
            <p className="text-lg text-gray-300 mb-2">
              If you are experiencing technical issues, have a bug report, or need assistance with your account, please contact our support team:
            </p>
            <a href="mailto:tallambrian633@gmail" className="text-xl font-semibold text-purple-300 hover:underline">
              support@moringapair.com
            </a>
          </div>

          {/* Sales Inquiries */}
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg text-center">
            <h2 className="text-2xl font-bold text-green-400 mb-3">Sales Inquiries</h2>
            <p className="text-lg text-gray-300 mb-2">
              Interested in a demo, custom pricing, or a tailored solution for your bootcamp? Our sales team would love to hear from you:
            </p>
            <a href="mailto:tallambrian633@gmail" className="text-xl font-semibold text-green-300 hover:underline">
              sales@moringapair.com
            </a>
          </div>
        </section>

        {/* Social Media Section */}
        <section className="mb-12 text-center">
          <h2 className="text-2xl font-bold text-yellow-400 mb-4">Connect With Us</h2>
          <p className="text-lg text-gray-300 mb-6">
            Follow us on social media to stay updated on the latest news and features:
          </p>
          <div className="flex justify-center space-x-6 text-3xl">
            {/* Replace with actual icons/links */}
            <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200" aria-label="LinkedIn">
              <i className="fab fa-linkedin"></i> {/* Example: Font Awesome icon */}
            </a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200" aria-label="Twitter">
              <i className="fab fa-twitter"></i> {/* Example: Font Awesome icon */}
            </a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200" aria-label="Facebook">
              <i className="fab fa-facebook"></i> {/* Example: Font Awesome icon */}
            </a>
          </div>
        </section>

        {/* Location Section (Optional) */}
        <section className="mb-12 bg-gray-800 p-6 rounded-lg shadow-lg text-center">
          <h2 className="text-2xl font-bold text-cyan-400 mb-3">Our Location</h2>
          <address className="text-lg text-gray-300 not-italic">
            MoringaPair Headquarters<br />
            123 Tech Avenue<br />
            Nairobi, 00100<br />
            Kenya
          </address>
        </section>
        {/* Closing Statement */}
        <p className="text-center text-gray-400 mt-12">We look forward to hearing from you!</p>
      </div>
    </div>
  );
};

export default ContactPage;
import React from 'react';

const PricingPage = () => {
  return (
    // Main container for the Pricing page, styled for a dark theme and responsive padding
    <div className="min-h-screen bg-gray-900 text-gray-100 font-inter py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Page Title */}
        <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-8 text-center">
          MoringaPair Pricing
        </h1>

        {/* Introduction */}
        <p className="text-lg sm:text-xl text-gray-300 mb-12 text-center max-w-3xl mx-auto">
          MoringaPair offers flexible pricing plans designed to scale with the needs of your coding bootcamp or educational institution. We believe in providing value that empowers collaboration and accelerates learning.
        </p>

        {/* Pricing Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {/* Free Tier Card */}
          <div className="bg-gray-800 p-8 rounded-lg shadow-xl flex flex-col items-center text-center border-2 border-blue-500">
            <h2 className="text-3xl font-bold text-blue-400 mb-4">Free Tier</h2>
            <p className="text-xl text-gray-300 mb-6">Perfect for pilot programs</p>
            <p className="text-5xl font-extrabold text-white mb-8">
              $0<span className="text-xl text-gray-400">/month</span>
            </p>
            <ul className="list-none space-y-3 text-lg text-gray-300 mb-8">
              <li>✅ Automated Weekly Pairing</li>
              <li>✅ Duplicate Pair Prevention</li>
              <li>✅ Basic Pairing History</li>
              <li>✅ Up to 20 Students</li>
              <li>✅ 1 Technical Mentor Account</li>
              <li>✅ Email Support</li>
            </ul>
            <button
              className="bg-blue-600 text-white font-bold py-3 px-8 rounded-full transition-colors duration-300 shadow-md opacity-50 cursor-not-allowed"
              disabled // Make button non-clickable
            >
              Coming Soon
            </button>
          </div>

          {/* Standard Plan Card */}
          <div className="bg-gray-800 p-8 rounded-lg shadow-xl flex flex-col items-center text-center border-2 border-purple-500 transform scale-105 relative z-10">
            <span className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-yellow-500 text-gray-900 text-sm font-bold px-4 py-1 rounded-full shadow-lg">
              Coming Soon
            </span> {/* Changed "Most Popular" to "Coming Soon" */}
            <h2 className="text-3xl font-bold text-purple-400 mb-4">Standard Plan</h2>
            <p className="text-xl text-gray-300 mb-6">Ideal for growing bootcamps</p>
            <p className="text-5xl font-extrabold text-white mb-8">
              $49<span className="text-xl text-gray-400">/month</span>
            </p>
            <ul className="list-none space-y-3 text-lg text-gray-300 mb-8">
              <li>✅ Everything in Free Tier</li>
              <li>✅ Unlimited Students</li>
              <li>✅ Up to 5 Technical Mentor Accounts</li>
              <li>✅ Full Pairing History & Data Visualization</li>
              <li>✅ Advanced Filtering & Search</li>
              <li>✅ Standard Email & Chat Support</li>
              <li>✅ Priority Bug Fixes</li>
            </ul>
            <button
              className="bg-purple-600 text-white font-bold py-3 px-8 rounded-full transition-colors duration-300 shadow-md opacity-50 cursor-not-allowed"
              disabled // Make button non-clickable
            >
              Coming Soon
            </button>
          </div>

          {/* Premium Plan Card */}
          <div className="bg-gray-800 p-8 rounded-lg shadow-xl flex flex-col items-center text-center border-2 border-green-500">
            <h2 className="text-3xl font-bold text-green-400 mb-4">Premium Plan</h2>
            <p className="text-xl text-gray-300 mb-6">For large institutions</p>
            <p className="text-5xl font-extrabold text-white mb-8">
              $99<span className="text-xl text-gray-400">/month</span>
            </p>
            <ul className="list-none space-y-3 text-lg text-gray-300 mb-8">
              <li>✅ Everything in Standard Plan</li>
              <li>✅ Unlimited Technical Mentor Accounts</li>
              <li>✅ Dedicated Account Manager</li>
              <li>✅ Premium 24/7 Support</li>
              <li>✅ Early Access to Future Features</li>
              <li>✅ Custom Integrations (upon request)</li>
              <li>✅ SLA (Service Level Agreement)</li>
            </ul>
            <button
              className="bg-green-600 text-white font-bold py-3 px-8 rounded-full transition-colors duration-300 shadow-md opacity-50 cursor-not-allowed"
              disabled // Make button non-clickable
            >
              Coming Soon
            </button>
          </div>
        </div>

        {/* Call to Action for Sales */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Get Started Today!
          </h2>
          <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
            Contact our sales team to discuss which plan is best for your institution and to get a custom quote. We're happy to tailor a solution that fits your unique requirements.
          </p>
          <a
            href="/contact" // Link to your contact page
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-10 rounded-full transition-colors duration-300 shadow-lg text-xl"
          >
            Contact Sales
          </a>
        </div>

        {/* Transparent Billing Section */}
        <section className="text-center text-gray-400 text-sm">
          <h3 className="text-xl font-semibold text-white mb-4">Transparent Billing</h3>
          <ul className="list-none space-y-2 mb-4">
            <li>All plans are billed annually.</li>
            <li>No hidden fees.</li>
            <li>Upgrade or downgrade anytime.</li>
            <li>Educational discounts available for qualifying institutions.</li>
          </ul>
          <p className="italic">
            Note: Pricing details are illustrative and subject to change. Please contact us for the most up-to-date information and custom quotes.
          </p>
        </section>
      </div>
    </div>
  );
};

export default PricingPage;

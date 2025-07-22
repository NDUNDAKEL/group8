import React from 'react';

const HelpPage = () => {
  return (
    // Main container for the Help Center page, styled for a dark theme and responsive padding
    <div className="min-h-screen bg-gray-900 text-gray-100 font-inter py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Page Title */}
        <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-8 text-center">
          MoringaPair Help Center
        </h1>

        {/* Introduction */}
        <p className="text-lg sm:text-xl text-gray-300 mb-12 text-center max-w-2xl mx-auto">
          Welcome to the MoringaPair Help Center! Here you'll find resources and answers to common questions about using our student pairing platform.
        </p>

        {/* Getting Started Section */}
        <section className="mb-12 bg-gray-800 p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-blue-400 mb-4">Getting Started</h2>
          <div className="space-y-4 text-gray-300">
            <div>
              <h3 className="text-xl font-semibold text-white mb-2">How do I create an account?</h3>
              <p>Click on the "Sign Up" button on the landing page. You can register with your email and password or use your Google account for quick access.</p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-white mb-2">How do I log in?</h3>
              <p>Navigate to the "Login" page and enter your registered email and password, or select "Continue with Google."</p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-white mb-2">What is my role?</h3>
              <p>You will be automatically assigned a 'Student' role upon registration. Technical Mentors (Admins) are typically registered by the system administrator.</p>
            </div>
          </div>
        </section>

        {/* For Students Section */}
        <section className="mb-12 bg-gray-800 p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-purple-400 mb-4">For Students</h2>
          <div className="space-y-4 text-gray-300">
            <div>
              <h3 className="text-xl font-semibold text-white mb-2">How do I see my current pairing?</h3>
              <p>After logging in, your dashboard will display your current week's pairing.</p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-white mb-2">Where can I find my past pairings?</h3>
              <p>On your dashboard, there will be a "Pairing History" section where you can view all your previous collaborations.</p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-white mb-2">How do I give feedback on a pairing?</h3>
              <p>After your weekly pairing is completed, you'll find an option on your dashboard or within your pairing history to submit feedback for that specific pair.</p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-white mb-2">Will I always be paired with someone new?</h3>
              <p>Our system prioritizes unique pairings. You will only be paired with someone you've worked with before if all other possible combinations have been exhausted within a set number of recent weeks.</p>
            </div>
          </div>
        </section>

        {/* For Technical Mentors Section */}
        <section className="mb-12 bg-gray-800 p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-green-400 mb-4">For Technical Mentors (Admins)</h2>
          <div className="space-y-4 text-gray-300">
            <div>
              <h3 className="text-xl font-semibold text-white mb-2">How do I generate weekly pairings?</h3>
              <p>Log in as an admin, navigate to the "Admin Dashboard," and you'll find a "Generate Pairings" option. Select the week you want to generate pairings for.</p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-white mb-2">Can I review pairings before they are published?</h3>
              <p>Yes, after generating pairings, you will have an opportunity to review them before publishing.</p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-white mb-2">How do I view historical pairing data?</h3>
              <p>The "Pairing History" section in your Admin Dashboard allows you to view, search, and filter all past pairings.</p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-white mb-2">How can I manage student accounts?</h3>
              <p>The "User Management" section in your Admin Dashboard provides tools to create, update, or delete student accounts.</p>
            </div>
          </div>
        </section>

        {/* Technical Support Section */}
        <section className="mb-12 text-center">
          <h2 className="text-2xl font-bold text-yellow-400 mb-4">Technical Support</h2>
          <p className="text-lg text-gray-300 mb-6">
            If you encounter any issues or have questions not covered here, please don't hesitate to reach out to our support team.
          </p>
          <div className="flex justify-center space-x-4">
            <a href="/contact" className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-6 rounded-full transition-colors duration-300 shadow-md">
              Visit our Contact page
            </a>
            <a href="/status" className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-6 rounded-full transition-colors duration-300 shadow-md">
              Check our Status page
            </a>
          </div>
        </section>

        {/* FAQs Section */}
        <section className="bg-gray-800 p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-cyan-400 mb-4">FAQs</h2>
          <div className="space-y-4 text-gray-300">
            <div>
              <h3 className="text-xl font-semibold text-white mb-2">Is my data secure?</h3>
              <p>Yes, we use industry-standard security practices, including password hashing and JWT authentication, to protect your data.</p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-white mb-2">What if there's an odd number of students?</h3>
              <p>Our pairing algorithm is designed to handle an odd number of students. It may result in a group of three or a designated 'solo' student for that week, depending on the configuration.</p>
            </div>
          </div>
          <p className="text-gray-400 text-sm mt-6 text-center">
            For more detailed information, please refer to our <a href="/features" className="text-blue-400 hover:underline">Features</a> and <a href="/api" className="text-blue-400 hover:underline">API</a> documentation.
          </p>
        </section>
      </div>
    </div>
  );
};

export default HelpPage;

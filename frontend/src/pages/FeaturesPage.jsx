import React from 'react';

const FeaturesPage = () => {
  return (
    // Main container for the Features page, styled for a dark theme and responsive padding
    <div className="min-h-screen bg-gray-900 text-gray-100 font-inter py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Page Title */}
        <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-8 text-center">
          MoringaPair Features
        </h1>

        {/* Introduction */}
        <p className="text-lg sm:text-xl text-gray-300 mb-12 text-center max-w-2xl mx-auto">
          MoringaPair is designed to revolutionize student collaboration in coding bootcamps. Our key features are built to streamline the pairing process, enhance learning outcomes, and provide invaluable insights for technical mentors.
        </p>

        {/* Core Features Section */}
        <section className="mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-blue-400 mb-6 text-center">
            Core Capabilities
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Feature Card 1 */}
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
              <h3 className="text-2xl font-semibold text-white mb-3">Automated Weekly Pairing</h3>
              <p className="text-gray-300">
                Say goodbye to manual pairing! Our intelligent algorithm randomly pairs students each week, ensuring diverse collaboration experiences without any manual effort from mentors.
              </p>
            </div>
            {/* Feature Card 2 */}
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
              <h3 className="text-2xl font-semibold text-white mb-3">Duplicate Pair Prevention</h3>
              <p className="text-gray-300">
                The system meticulously tracks all historical pairings, guaranteeing that students are not repeatedly matched with the same partner unless all other possible combinations have been exhausted.
              </p>
            </div>
            {/* Feature Card 3 */}
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
              <h3 className="text-2xl font-semibold text-white mb-3">Comprehensive Pairing History</h3>
              <p className="text-gray-300">
                A detailed record of every pairing, week by week, is maintained. Technical mentors can easily access and review this history to understand collaboration trends.
              </p>
            </div>
            {/* Feature Card 4 */}
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
              <h3 className="text-2xl font-semibold text-white mb-3">Intuitive Data Visualization</h3>
              <p className="text-gray-300">
                Our dashboard provides clear visual representations of pairing data over time. Quickly see who was paired with whom, identify collaboration patterns, and gain insights.
              </p>
            </div>
            {/* Feature Card 5 */}
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
              <h3 className="text-2xl font-semibold text-white mb-3">Advanced Filtering & Search</h3>
              <p className="text-gray-300">
                Technical mentors can effortlessly filter pairing history by week, student, or date range, allowing for quick retrieval of relevant data and analysis.
              </p>
            </div>
            {/* Feature Card 6 */}
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
              <h3 className="text-2xl font-semibold text-white mb-3">Secure User Authentication</h3>
              <p className="text-gray-300">
                Students and technical mentors can create accounts and log in securely using email/password or convenient Google social authentication.
              </p>
            </div>
            {/* Feature Card 7 */}
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
              <h3 className="text-2xl font-semibold text-white mb-3">Role-Based Access Control</h3>
              <p className="text-gray-300">
                Ensures that students can only view their own pairings and provide feedback, while technical mentors (admins) have full control.
              </p>
            </div>
          </div>
        </section>

        {/* Features for Students Section */}
        <section className="mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-purple-400 mb-6 text-center">
            For Students
          </h2>
          <ul className="list-disc list-inside space-y-4 text-lg text-gray-300 max-w-2xl mx-auto">
            <li>
              <span className="font-semibold text-white">Personalized Dashboard:</span> View your current week's pairing and easily access your past collaboration history.
            </li>
            <li>
              <span className="font-semibold text-white">Notifications:</span> Receive alerts when new weekly pairings are published, keeping you informed and ready for your next collaboration.
            </li>
            <li>
              <span className="font-semibold text-white">Feedback Mechanism:</span> Provide valuable feedback on your pairing experiences, helping to improve the system and future matches. You can also suggest preferred partners or flag unproductive pairings.
            </li>
          </ul>
        </section>

        {/* Features for Technical Mentors Section */}
        <section className="mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-green-400 mb-6 text-center">
            For Technical Mentors (Admins)
          </h2>
          <ul className="list-disc list-inside space-y-4 text-lg text-gray-300 max-w-2xl mx-auto">
            <li>
              <span className="font-semibold text-white">Effortless Pairing Initiation:</span> Trigger the weekly random pairing process with a single click.
            </li>
            <li>
              <span className="font-semibold text-white">Pairing Review & Publication:</span> Review generated pairings before publishing them to students, with options for manual adjustments if necessary.
            </li>
            <li>
              <span className="font-semibold text-white">Student Account Management:</span> Create, update, or delete student accounts directly within the platform.
            </li>
            <li>
              <span className="font-semibold text-white">Data Export:</span> Download or export pairing records for offline storage, reporting, or sharing.
            </li>
          </ul>
        </section>

        {/* Future Enhancements Section */}
        <section>
          <h2 className="text-3xl sm:text-4xl font-bold text-yellow-400 mb-6 text-center">
            Future Enhancements (Coming Soon!)
          </h2>
          <ul className="list-disc list-inside space-y-4 text-lg text-gray-300 max-w-2xl mx-auto">
            <li>
              <span className="font-semibold text-white">Skill-Based Pairing:</span> Intelligent pairing that considers student strengths and weaknesses, fostering complementary learning.
            </li>
            <li>
              <span className="font-semibold text-white">Integrated Skill Assessments:</span> Built-in quizzes and assessments to capture student skill profiles, providing data for more strategic pairing decisions.
            </li>
            <li>
              <span className="font-semibold text-white">Learning Preferences:</span> Allow students to update detailed learning preferences that can influence future pairing algorithms.
            </li>
          </ul>
        </section>
      </div>
    </div>
  );
};

export default FeaturesPage;

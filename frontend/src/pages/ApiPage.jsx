import React from 'react';

const ApiPage = () => {
  return (
    // Main container for the API page, styled for a dark theme and responsive padding
    <div className="min-h-screen bg-gray-900 text-gray-100 font-inter py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Page Title */}
        <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-8 text-center">
          MoringaPair API Documentation
        </h1>

        {/* Introduction */}
        <p className="text-lg sm:text-xl text-gray-300 mb-12 text-center max-w-2xl mx-auto">
          The MoringaPair API allows you to programmatically integrate our powerful student pairing capabilities into your existing systems, dashboards, or custom applications.
        </p>

        {/* Base URL */}
        <section className="mb-10 bg-gray-800 p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-blue-400 mb-4">Base URL</h2>
          <code className="block bg-gray-700 text-white p-3 rounded-md overflow-x-auto">
            [Your Backend URL Here]/api/v1
          </code>
          <p className="text-gray-400 text-sm mt-2">
            (e.g., `https://api.moringapair.com/api/v1`)
          </p>
        </section>

        {/* Authentication Section */}
        <section className="mb-10 bg-gray-800 p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-purple-400 mb-4">Authentication</h2>
          <p className="text-gray-300 mb-4">
            All API endpoints require **JWT (JSON Web Token) authentication**.
            Obtain a token by authenticating an `admin` or `student` user via the `/auth/login` or `/auth/google-login` endpoint.
          </p>
          <p className="text-gray-300 mb-2">
            Include the token in the `Authorization` header of all subsequent requests:
          </p>
          <code className="block bg-gray-700 text-white p-3 rounded-md overflow-x-auto">
            Authorization: Bearer &lt;YOUR_JWT_TOKEN&gt;
          </code>
        </section>

        {/* Key Endpoints Section */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-green-400 mb-6 text-center">Key Endpoints Overview</h2>
          <div className="space-y-6">
            {/* Authentication Endpoints */}
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-semibold text-white mb-3">Authentication</h3>
              <ul className="list-disc list-inside space-y-2 text-gray-300">
                <li><code className="font-mono text-blue-300">POST /auth/register</code>: Register a new student user.</li>
                <li><code className="font-mono text-blue-300">POST /auth/login</code>: Authenticate user and receive JWT.</li>
                <li><code className="font-mono text-blue-300">POST /auth/google-login</code>: Authenticate/register via Google ID Token.</li>
                <li><code className="font-mono text-blue-300">GET /auth/me</code>: Get authenticated user's profile (requires JWT).</li>
              </ul>
            </div>

            {/* User Management Endpoints */}
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-semibold text-white mb-3">User Management <span className="text-sm text-gray-400">(Admin Only)</span></h3>
              <ul className="list-disc list-inside space-y-2 text-gray-300">
                <li><code className="font-mono text-blue-300">GET /users/&lt;user_id&gt;</code>: Retrieve all user profiles.</li>
                <li><code className="font-mono text-blue-300">GET /users/&lt;user_id&gt;</code>: Retrieve a specific user profile.</li>
                <li><code className="font-mono text-blue-300">PUT /users/&lt;user_id&gt;</code>: Update a user's profile.</li>
                <li><code className="font-mono text-blue-300">DELETE /users/&lt;user_id&gt;</code>: Delete a user.</li>
              </ul>
            </div>

            {/* Pairing Management Endpoints */}
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-semibold text-white mb-3">Pairing Management</h3>
              <ul className="list-disc list-inside space-y-2 text-gray-300">
                <li><code className="font-mono text-blue-300">POST /pairings/generate</code>: Generate new weekly pairings (Admin Only).</li>
                <li><code className="font-mono text-blue-300">POST /pairings/publish/&lt;week_id&gt;</code>: Mark pairings as published (Admin Only).</li>
                <li><code className="font-mono text-blue-300">GET /pairings/current</code>: Get current published pairings.</li>
                <li><code className="font-mono text-blue-300">GET /pairings/history</code>: Get all historical pairings.</li>
                <li><code className="font-mono text-blue-300">GET /pairings/history/week/&lt;week_id&gt;</code>: Get pairings for a specific week.</li>
                <li><code className="font-mono text-blue-300">GET /pairings/history/student/&lt;student_id&gt;</code>: Get pairings for a specific student (Admin Only).</li>
                <li><code className="font-mono text-blue-300">GET /pairings/history/filter</code>: Filter pairings by query params (Admin Only).</li>
              </ul>
            </div>

            {/* Feedback Endpoints */}
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-semibold text-white mb-3">Feedback</h3>
              <ul className="list-disc list-inside space-y-2 text-gray-300">
                <li><code className="font-mono text-blue-300">POST /feedback</code>: Submit feedback for a pair (Student Only).</li>
                <li><code className="font-mono text-blue-300">GET /feedback/pair/&lt;pair_id&gt;</code>: Get feedback for a specific pair (Admin Only).</li>
                <li><code className="font-mono text-blue-300">GET /feedback/student/&lt;student_id&gt;</code>: Get feedback by a specific student.</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Error Responses Section */}
        <section className="bg-gray-800 p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-red-400 mb-4">Error Responses</h2>
          <p className="text-gray-300 mb-4">
            All error responses will be in JSON format with an `error` message and an appropriate HTTP status code.
          </p>
          <pre className="bg-gray-700 text-white p-4 rounded-md overflow-x-auto">
            <code>
{`{
  "error": "Unauthorized access"
}`}
            </code>
          </pre>
        </section>
      </div>
    </div>
  );
};

export default ApiPage;

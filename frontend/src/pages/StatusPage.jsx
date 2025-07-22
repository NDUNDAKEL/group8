import React from 'react';

const StatusPage = () => {
  // You would typically fetch this data from an API endpoint
  const statusData = {
    lastUpdated: new Date().toLocaleString('en-US', { dateStyle: 'full', timeStyle: 'short' }),
    overallStatus: 'All Systems Operational',
    components: [
      { name: 'Web Application', status: 'Operational', description: 'Frontend and User Interface' },
      { name: 'API Services', status: 'Operational', description: 'Backend API endpoints and logic' },
      { name: 'Database', status: 'Operational', description: 'Data storage and retrieval' },
      { name: 'Authentication', status: 'Operational', description: 'User login and security' },
      { name: 'Pairing Engine', status: 'Operational', description: 'Automated student pairing algorithm' },
      { name: 'Notifications', status: 'Operational', description: 'Email and in-app alerts' },
    ],
    recentIncidents: [], // Empty array for no incidents
    historicalUptime: {
      last7Days: '100% Uptime',
      last30Days: '99.9% Uptime',
      last90Days: '99.95% Uptime',
    }
  };

  return (
    // Main container for the Status page, styled for a dark theme and responsive padding
    <div className="min-h-screen bg-gray-900 text-gray-100 font-inter py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Page Title */}
        <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-8 text-center">
          MoringaPair System Status
        </h1>

        {/* Current Status */}
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg text-center mb-12">
          <h2 className="text-3xl font-bold text-green-400 mb-2">
            {statusData.overallStatus}
          </h2>
          <p className="text-gray-400 text-sm">
            Last Updated: {statusData.lastUpdated}
          </p>
        </div>

        {/* Service Components Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-blue-400 mb-6 text-center">
            Service Components
          </h2>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-gray-800 rounded-lg shadow-lg">
              <thead>
                <tr className="bg-gray-700 text-gray-200 uppercase text-sm leading-normal">
                  <th className="py-3 px-6 text-left rounded-tl-lg">Component</th>
                  <th className="py-3 px-6 text-left">Status</th>
                  <th className="py-3 px-6 text-left rounded-tr-lg">Description</th>
                </tr>
              </thead>
              <tbody className="text-gray-300 text-sm font-light">
                {statusData.components.map((component, index) => (
                  <tr key={index} className="border-b border-gray-700 hover:bg-gray-700">
                    <td className="py-3 px-6 text-left whitespace-nowrap">
                      {component.name}
                    </td>
                    <td className="py-3 px-6 text-left">
                      <span className={`py-1 px-3 rounded-full text-xs font-semibold ${
                        component.status === 'Operational' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
                      }`}>
                        {component.status}
                      </span>
                    </td>
                    <td className="py-3 px-6 text-left">
                      {component.description}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Recent Incidents Section */}
        <section className="mb-12 bg-gray-800 p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-red-400 mb-4 text-center">
            Recent Incidents
          </h2>
          {statusData.recentIncidents.length === 0 ? (
            <p className="text-lg text-gray-300 text-center">No recent incidents to report.</p>
          ) : (
            <ul className="list-disc list-inside space-y-3 text-lg text-gray-300">
              {/* Map through incidents if any */}
              {statusData.recentIncidents.map((incident, index) => (
                <li key={index}>
                  <span className="font-semibold text-white">{incident.date}:</span> {incident.description}
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* Historical Uptime Section */}
        <section className="mb-12 bg-gray-800 p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-yellow-400 mb-4 text-center">
            Historical Uptime
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center text-lg">
            <div>
              <p className="font-semibold text-white">Last 7 Days:</p>
              <p className="text-gray-300">{statusData.historicalUptime.last7Days}</p>
            </div>
            <div>
              <p className="font-semibold text-white">Last 30 Days:</p>
              <p className="text-gray-300">{statusData.historicalUptime.last30Days}</p>
            </div>
            <div>
              <p className="font-semibold text-white">Last 90 Days:</p>
              <p className="text-gray-300">{statusData.historicalUptime.last90Days}</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default StatusPage;

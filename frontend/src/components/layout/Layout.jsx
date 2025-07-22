import React from 'react';
import Navigation from './Navigation';

const Layout = ({ children }) => {
  return (
    <div className="h-screen bg-gray-50">
      <Navigation />
      <div className="lg:pl-64">
        <main className="flex-1 h-full overflow-y-auto">
          <div className="p-4 lg:p-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
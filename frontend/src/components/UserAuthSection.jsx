import React from 'react';
import { UserButton, SignedIn, SignedOut, useUser } from '@clerk/clerk-react';
import { Link } from 'react-router-dom';
import Button from './ui/Button';

const UserAuthSection = () => {
  const { user } = useUser();

  return (
    <div className="flex items-center space-x-4">
      {/* Signed Out State */}
      <SignedOut>
        <Link
          to="/login"
          className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors"
        >
          Sign In
        </Link>
        <Link to="/register">
          <Button size="sm">Get Started</Button>
        </Link>
      </SignedOut>

      {/* Signed In State */}
      <SignedIn>
        <div className="flex items-center space-x-3">
          {/* Option 1: Using Clerk's UserButton (recommended) */}
          <UserButton 
            appearance={{
              elements: {
                avatarBox: "h-9 w-9", // Custom avatar size
                userButtonPopoverCard: "shadow-lg" // Custom dropdown style
              }
            }}
          />
          
          {/* Option 2: Manual profile display */}
          <div className="flex items-center space-x-2">
         
            <span className="text-sm font-medium text-gray-700">
              {user?.firstName || user?.username}
            </span>
          </div>
        </div>
      </SignedIn>
    </div>
  );
};

export default UserAuthSection;
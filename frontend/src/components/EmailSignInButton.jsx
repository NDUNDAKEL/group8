import React from 'react';
import { SignInButton, SignedOut, useClerk } from "@clerk/clerk-react";
import Button from './ui/Button';
import { useNavigate } from 'react-router-dom';

const EmailSignInButton = () => {
  const { user } = useClerk();
  const navigate = useNavigate();

  return (
    <SignedOut>
      <SignInButton 
        mode="modal"
        afterSignInUrl="/landing"
        afterSignUpUrl="/landing"
      >
        <Button
          variant="outline"
          className="w-full flex items-center justify-center gap-3 border-gray-300 hover:bg-gray-50"
        >
          {/* Email icon */}
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          Continue with Email
        </Button>
      </SignInButton>
    </SignedOut>
  );
};

export default EmailSignInButton;
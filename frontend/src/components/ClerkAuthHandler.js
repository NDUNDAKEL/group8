import React, { useEffect } from 'react';
import { useClerk, useUser } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
const ClerkAuthHandler = () => {
  const { loginWithClerk, isAuthenticated } = useAuth();
  const { isSignedIn } = useClerk();
  const { user: clerkUser } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuth = async () => {
      if (isSignedIn && clerkUser && !isAuthenticated) {
        try {
          const user = await loginWithClerk(clerkUser);
          navigate(user?.role === 'tm' ? '/admin/dashboard' : '/student/dashboard');
        } catch (error) {
          console.error('Clerk authentication failed:', error);
          navigate('/login', { state: { error: 'Authentication failed' } });
        }
      }
    };

    // Only run if Clerk is signed in and we haven't authenticated yet
    if (isSignedIn && !isAuthenticated) {
      handleAuth();
    }
  }, [isSignedIn, isAuthenticated, clerkUser, loginWithClerk, navigate]);

  return null;
};

export default ClerkAuthHandler;
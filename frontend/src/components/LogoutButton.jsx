import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useClerk } from '@clerk/clerk-react';

const LogoutButton = () => {
  const { logout } = useAuth();
  const { signOut } = useClerk();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      // First sign out from Clerk
      if (signOut) {
        await signOut();
      }
      
      // Then clear local auth state
      await logout();
      
      // Redirect to login
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
      // Optionally show error to user
    }
  };

  return (
    <button onClick={handleLogout} className="logout-button">
      Log Out
    </button>
  );
};

export default LogoutButton;
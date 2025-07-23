import React, { createContext, useContext, useReducer, useEffect } from 'react';

const initialState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN_START':
      return { ...state, isLoading: true, error: null };
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        isLoading: false,
        isAuthenticated: true,
        user: action.payload,
        error: null,
      };
    case 'LOGIN_FAILURE':
      return {
        ...state,
        isLoading: false,
        isAuthenticated: false,
        user: null,
        error: action.payload,
      };
    case 'LOGOUT':
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        error: null,
      };
    case 'CLEAR_ERROR':
      return { ...state, error: null };

    case 'UPDATE_USER':
        return {
          ...state,
          user: { ...state.user, ...action.payload }, // merge changes
        };
    default:
      return state;
  }
};

const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Check for existing session on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('moringapair_user');
    if (savedUser) {
      try {
        const user = JSON.parse(savedUser);
        dispatch({ type: 'LOGIN_SUCCESS', payload: user });
      } catch (error) {
        localStorage.removeItem('moringapair_user');
      }
    }
  }, []);


  const updateUser = (updatedUser) => {
    // Save new user to localStorage so it persists
    localStorage.setItem('moringapair_user', JSON.stringify(updatedUser));

    // Dispatch reducer action to update context
    dispatch({ type: 'UPDATE_USER', payload: updatedUser });
  };
// Add this to your AuthContext
 const loginWithClerk = async (clerkUser) => {
  dispatch({ type: 'LOGIN_START' });
  
  try {
    const response = await fetch('http://localhost:5000/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        is_clerk: true,
        clerk_id: clerkUser.id,
        email: clerkUser.primaryEmailAddress?.emailAddress,
        name: clerkUser.fullName || `${clerkUser.firstName} ${clerkUser.lastName}`
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    if (!data.token || !data.user) {
      throw new Error('Invalid response format');
    }

    localStorage.setItem('moringapair_user', JSON.stringify(data.user));
    localStorage.setItem('auth_token', data.token);

    dispatch({ type: 'LOGIN_SUCCESS', payload: data.user });
    return data.user;
  } catch (error) {
    console.error('Login error:', error);
    dispatch({ type: 'LOGIN_FAILURE', payload: error.message });
    throw error;
  }
};

  const login = async (email, password) => {
    dispatch({ type: 'LOGIN_START' });
  
    try {
      const response = await fetch('http://localhost:5000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Login failed');
      }
  
      const data = await response.json();
  
      
      const { token, user } = data;
  
      // Save token & user
      localStorage.setItem('moringapair_user', JSON.stringify(user));
      localStorage.setItem('auth_token', token);
  
      dispatch({ type: 'LOGIN_SUCCESS', payload: user });
    } catch (error) {
      dispatch({ type: 'LOGIN_FAILURE', payload: error.message });
    }
  };
  const logout = async () => {
  try {
    // Clear local storage
    localStorage.removeItem('moringapair_user');
    localStorage.removeItem('auth_token');
    
    // If using Clerk, sign out from Clerk session
    if (window.Clerk && window.Clerk.signOut) {
      await window.Clerk.signOut();
    }
    
    // Dispatch logout action
    dispatch({ type: 'LOGOUT' });
    
    
    return true;
  } catch (error) {
    console.error('Logout error:', error);
    return false;
  }
};


  const loginWithGoogle = async (googleUser) => {
    dispatch({ type: 'LOGIN_START' });
    
    try {
      // Simulate API call to verify Google token and get user data
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const user = {
        id: googleUser.googleId || googleUser.sub,
        name: googleUser.name || googleUser.given_name + ' ' + googleUser.family_name,
        email: googleUser.email,
        role: 'student', // Default role for Google sign-in
        avatar: googleUser.imageUrl || googleUser.picture
      };
      
      localStorage.setItem('moringapair_user', JSON.stringify(user));
      dispatch({ type: 'LOGIN_SUCCESS', payload: user });
    } catch (error) {
      dispatch({ type: 'LOGIN_FAILURE', payload: 'Google authentication failed' });
    }
  };


  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        logout,
        login,
        loginWithGoogle,
        clearError,
        updateUser,
        loginWithClerk
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
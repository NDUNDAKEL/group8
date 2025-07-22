import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { AppProvider } from './contexts/AppContext';
import ProtectedRoute from './components/ProtectedRoute';

// Landing Page
import LandingPage from './pages/LandingPage';

// Auth Pages
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';

// Student Pages
import StudentDashboard from './pages/student/StudentDashboard';
import StudentHistory from './pages/student/StudentHistory';
import StudentProfile from './pages/student/StudentProfile';
import StudentAssessment from './pages/student/StudentQuestions'
import LearningPreference from './pages/student/LearningPreference'

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageStudents from './pages/admin/ManageStudents';
import AdminPairings from './pages/admin/AdminPairings';
import AdminQuizes from './pages/admin/AdminQuizes';
import StudentsFeedback from './pages/admin/StudentsFeedback';

// Landing Page
// Static Pages
import StatusPage from './pages/StatusPage';
import FeaturesPage from './pages/FeaturesPage';
import PricingPage from './pages/PricingPage';
import ApiPage from './pages/ApiPage';
import HelpPage from './pages/HelpPage';
import ContactPage from './pages/ContactPage';

const AppRoutes = () => {
  const { isAuthenticated, user } = useAuth();

  return (
    <Routes>
      {/* Static Pages */}
      <Route path="/status" element={<StatusPage />} />
      <Route path="/features" element={<FeaturesPage />} />
      <Route path="/pricing" element={<PricingPage />} />
      <Route path="/api" element={<ApiPage />} />
      <Route path="/help" element={<HelpPage />} />
      <Route path="/contact" element={<ContactPage />} />
      
      {/* Landing Page */}
      <Route 
        path="/landing" 
        element={
          isAuthenticated ? (
            <Navigate to={user?.role === 'admin' ? '/admin/dashboard' : '/student/dashboard'} replace />
          ) : (
            <LandingPage />
          )
        } 
      />
      
      {/* Public Routes */}
      <Route 
        path="/login" 
        element={
          isAuthenticated ? (
            <Navigate to={user?.role === 'admin' ? '/admin/dashboard' : '/student/dashboard'} replace />
          ) : (
            <LoginPage />
          )
        } 
      />
      <Route 
        path="/register" 
        element={
          isAuthenticated ? (
            <Navigate to={user?.role === 'admin' ? '/admin/dashboard' : '/student/dashboard'} replace />
          ) : (
            <RegisterPage />
          )
        } 
      />

      {/* Student Routes */}
      <Route
        path="/student/dashboard"
        element={
          <ProtectedRoute allowedRoles={['student']}>
            <StudentDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/student/history"
        element={
          <ProtectedRoute allowedRoles={['student']}>
            <StudentHistory />
          </ProtectedRoute>
        }
      />
      <Route
        path="/student/profile"
        element={
          <ProtectedRoute allowedRoles={['student']}>
            <StudentProfile />
          </ProtectedRoute>
        }
      />
      <Route
        path="/student/quizes"
        element={
          <ProtectedRoute allowedRoles={['student']}>
            <StudentAssessment />
          </ProtectedRoute>
        }
      />

<Route
        path="/student/learningpreference"
        element={
          <ProtectedRoute allowedRoles={['student']}>
            <LearningPreference />
          </ProtectedRoute>
        }
      />

      {/* Admin Routes */}
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute allowedRoles={['tm']}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/students"
        element={
          <ProtectedRoute allowedRoles={['tm']}>
            <ManageStudents />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/pairings"
        element={
          <ProtectedRoute allowedRoles={['tm']}>
            <AdminPairings />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/quizes"
        element={
          <ProtectedRoute allowedRoles={['tm']}>
            <AdminQuizes />
          </ProtectedRoute>
        }
      />
        <Route
        path="/admin/studentsfeedback"
        element={
          <ProtectedRoute allowedRoles={['tm']}>
            <StudentsFeedback />
          </ProtectedRoute>
        }
      />
    

      {/* Root redirect */}
      <Route
        path="/"
        element={
          isAuthenticated ? (
            <Navigate to={user?.role === 'tm' ? '/admin/dashboard' : '/student/dashboard'} replace />
          ) : (
            <Navigate to="/landing" replace />
          )
        }
      />

      {/* Catch all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
    
  );
};

function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <Router>
          <div className="min-h-screen bg-gray-50">
            <AppRoutes />
          </div>
        </Router>
      </AppProvider>
    </AuthProvider>
  );
}

export default App;
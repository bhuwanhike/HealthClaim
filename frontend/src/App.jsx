import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import MainLayout from './components/layout/MainLayout';
import Login from './pages/Login';
import { USER_ROLES } from './utils/constants';

// Hospital Pages
import HospitalDashboard from './pages/hospital/Dashboard';
import SubmitClaim from './pages/hospital/SubmitClaim';
import HospitalMyClaims from './pages/hospital/MyClaims';
import HospitalClaimDetails from './pages/hospital/ClaimDetails';
import HospitalProfile from './pages/hospital/Profile';

// Insurance Pages
import InsuranceDashboard from './pages/insurance/Dashboard';
import ReviewClaims from './pages/insurance/ReviewClaims';
import ClaimReview from './pages/insurance/ClaimReview';
import Analytics from './pages/insurance/Analytics';
import InsuranceProfile from './pages/insurance/Profile';

// Patient Pages
import PatientDashboard from './pages/patient/Dashboard';
import PatientMyClaims from './pages/patient/MyClaims';
import PatientClaimDetails from './pages/patient/ClaimDetails';
import UploadDocuments from './pages/patient/UploadDocuments';
import PatientProfile from './pages/patient/Profile';

// Dashboard Router Component
const DashboardRouter = () => {
  const userRole = JSON.parse(localStorage.getItem('user') || '{}').role;
  
  if (userRole === USER_ROLES.HOSPITAL) {
    return <HospitalDashboard />;
  } else if (userRole === USER_ROLES.INSURANCE) {
    return <InsuranceDashboard />;
  } else if (userRole === USER_ROLES.PATIENT) {
    return <PatientDashboard />;
  }
  
  return <Navigate to="/login" replace />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          
          {/* Protected Routes */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <MainLayout />
              </ProtectedRoute>
            }
          >
            {/* Common Routes */}
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<DashboardRouter />} />
            
            {/* Hospital Routes */}
            <Route
              path="submit-claim"
              element={
                <ProtectedRoute allowedRoles={[USER_ROLES.HOSPITAL]}>
                  <SubmitClaim />
                </ProtectedRoute>
              }
            />
            <Route
              path="my-claims"
              element={
                <ProtectedRoute allowedRoles={[USER_ROLES.HOSPITAL, USER_ROLES.PATIENT]}>
                  {JSON.parse(localStorage.getItem('user') || '{}').role === USER_ROLES.HOSPITAL
                    ? <HospitalMyClaims />
                    : <PatientMyClaims />
                  }
                </ProtectedRoute>
              }
            />
            <Route
              path="claim/:id"
              element={
                <ProtectedRoute allowedRoles={[USER_ROLES.HOSPITAL, USER_ROLES.PATIENT]}>
                  {JSON.parse(localStorage.getItem('user') || '{}').role === USER_ROLES.HOSPITAL
                    ? <HospitalClaimDetails />
                    : <PatientClaimDetails />
                  }
                </ProtectedRoute>
              }
            />
            
            {/* Insurance Routes */}
            <Route
              path="review-claims"
              element={
                <ProtectedRoute allowedRoles={[USER_ROLES.INSURANCE]}>
                  <ReviewClaims />
                </ProtectedRoute>
              }
            />
            <Route
              path="review-claim/:id"
              element={
                <ProtectedRoute allowedRoles={[USER_ROLES.INSURANCE]}>
                  <ClaimReview />
                </ProtectedRoute>
              }
            />
            <Route
              path="analytics"
              element={
                <ProtectedRoute allowedRoles={[USER_ROLES.INSURANCE]}>
                  <Analytics />
                </ProtectedRoute>
              }
            />
            
            {/* Patient Routes */}
            <Route
              path="upload-documents"
              element={
                <ProtectedRoute allowedRoles={[USER_ROLES.PATIENT]}>
                  <UploadDocuments />
                </ProtectedRoute>
              }
            />
            
            {/* Profile - Common for all roles */}
            <Route
              path="profile"
              element={
                <ProtectedRoute>
                  {JSON.parse(localStorage.getItem('user') || '{}').role === USER_ROLES.HOSPITAL
                    ? <HospitalProfile />
                    : JSON.parse(localStorage.getItem('user') || '{}').role === USER_ROLES.INSURANCE
                    ? <InsuranceProfile />
                    : <PatientProfile />
                  }
                </ProtectedRoute>
              }
            />
          </Route>
          
          {/* Catch all */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;

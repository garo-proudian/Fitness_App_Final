// ProtectedRoute.js

import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from './App'; // Adjust the path as necessary

const ProtectedRoute = ({ children }) => {
  const { isLoggedIn, hasCompletedProfile } = useContext(AuthContext);

  if (!isLoggedIn) {
    // Redirect to the login page if not logged in
    return <Navigate to="/fitnesslogin" replace />;
  } 
  else if (!hasCompletedProfile) {
    // Redirect to the profile completion page if the profile isn't completed
    return <Navigate to="/complete-profile" replace />;
  }

  return children;
};

export default ProtectedRoute;

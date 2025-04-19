import React from 'react';
import { Navigate } from 'react-router-dom';
import { getAuthToken } from './studentService';

const PrivateRoute = ({ children }) => {
  const token = getAuthToken();

  if (!token) {
    // Not logged in, redirect to login page
    return <Navigate to="/login" replace />;
  }

  // Logged in, render the child component
  return children;
};

export default PrivateRoute;

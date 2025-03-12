import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  // Check if user is authenticated and has the "farmer" role
  if (!token || role !== "farmer") {
    return <Navigate to="/" replace />; // Redirect to login if not authenticated or not a farmer
  }

  return children; // Render the protected component (e.g., Dashboard)
};

export default ProtectedRoute;
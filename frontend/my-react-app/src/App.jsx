import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./Components/Dashboard FInal.jsx";
import ProductSelection from "./Components/ProductSelection.jsx";
import Register from "./Components/Register.jsx";
import Home from "./Components/Home.jsx";
import Login from "./Components/Login.jsx";
import LoginFar from "./Components/LoginFar.jsx";
import LoginCon from "./Components/LoginCon.jsx";
import PrivateRoute from "./Components/PrivateRoute.jsx";
import CustomerDashboard from "./Components/CustomerDashboard.jsx";
import Payment from "./Components/Payment.jsx";
import { auth } from "./firebase.js"; // Import Firebase auth

function App() {
  const [isAuthenticated, setAuth] = useState(false);

  // Sync isAuthenticated with Firebase auth state on mount
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        console.log("App: User authenticated on mount, UID:", user.uid);
        setAuth(true);
      } else {
        console.log("App: No user authenticated on mount");
        setAuth(false);
      }
    });
    return () => unsubscribe(); // Cleanup subscription
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login setAuth={setAuth} />} />
        <Route path="/loginfar" element={<LoginFar setAuth={setAuth} />} />
        <Route path="/logincon" element={<LoginCon setAuth={setAuth} />} />
        <Route path="/signup" element={<Register setAuth={setAuth} />} />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute isAuthenticated={isAuthenticated}>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/CustomerDashboard"
          element={
            <PrivateRoute isAuthenticated={isAuthenticated}>
              <CustomerDashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/addproducts"
          element={
            <PrivateRoute isAuthenticated={isAuthenticated}>
              <ProductSelection />
            </PrivateRoute>
          }
        />
        <Route
          path="/payment"
          element={
            <PrivateRoute isAuthenticated={isAuthenticated}>
              <Payment />
            </PrivateRoute>
          }
        />
        {/* Redirect unknown routes to home or login */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
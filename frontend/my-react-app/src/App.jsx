import Dashboard from "./Components/Dashboard FInal.jsx";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ProductSelection from "./Components/ProductSelection.jsx";
import Register from "./Components/Register.jsx";
import Home from "./Components/Home.jsx";
import { useState } from 'react';
import Login from "./Components/Login.jsx";
import LoginFar from "./Components/LoginFar.jsx";
import LoginCon from "./Components/LoginCon.jsx";
import PrivateRoute from "./Components/PrivateRoute.jsx";
import CustomerDashboard from "./Components/CustomerDashboard.jsx";
import Payment from "./Components/Payment.jsx";
function App() {
  const [isAuthenticated, setAuth] = useState(false);

  return (
    <>
      <title>FARMER TO CONSUMER PLATFORM</title>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login setAuth={setAuth} />} /> {/* Pass setAuth here */}
          <Route path="/loginfar" element={<LoginFar setAuth={setAuth} />} /> 
          <Route path="/logincon" element={<LoginCon setAuth={setAuth} />} /> {/* Pass setAuth here */}
          <Route path="/signup" element={<Register setAuth={setAuth} />} /> {/* Simplified */}
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
          <Route path="/addproducts" element={<PrivateRoute isAuthenticated={isAuthenticated}>
                <ProductSelection />
              </PrivateRoute>} />
        </Routes>

       
      </Router>
    </>
  );
}

export default App;
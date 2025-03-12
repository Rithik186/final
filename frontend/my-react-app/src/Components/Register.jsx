// src/components/Register.jsx
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Register = ({ setAuth }) => {
  const [credentials, setCredentials] = useState({
    name: "",
    email: "",
    password: "",
    role: "farmer", // Default role
  });
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:5000/api/user/register",
        credentials,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      // Remove token handling if register doesn’t return one yet
      setError(null);
      navigate("/"); // Redirect to home/product page
    } catch (error) {
      console.error("Registration failed:", error.response?.data || error);
      setError(
        error.response?.data?.message ||
          "Registration failed due to a network or server error"
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-50 via-emerald-50 to-cyan-50">
      <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-lg">
        <h2 className="text-3xl font-bold text-teal-800 mb-6 text-center">
          Farmer Registration
        </h2>
        {error && <p className="text-red-600 text-center mb-4">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={credentials.name}
              onChange={handleChange}
              className="mt-1 w-full px-4 py-2 border border-teal-200 rounded-lg focus:ring-2 focus:ring-teal-400 focus:outline-none"
              placeholder="Enter your name"
              required
            />
          </div>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={credentials.email}
              onChange={handleChange}
              className="mt-1 w-full px-4 py-2 border border-teal-200 rounded-lg focus:ring-2 focus:ring-teal-400 focus:outline-none"
              placeholder="Enter your email"
              required
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={credentials.password}
              onChange={handleChange}
              className="mt-1 w-full px-4 py-2 border border-teal-200 rounded-lg focus:ring-2 focus:ring-teal-400 focus:outline-none"
              placeholder="Enter your password"
              required
            />
          </div>
          <div>
            <label
              htmlFor="role"
              className="block text-sm font-medium text-gray-700"
            >
              Role
            </label>
            <select
              id="role"
              name="role"
              value={credentials.role}
              onChange={handleChange}
              className="mt-1 w-full px-4 py-2 border border-teal-200 rounded-lg focus:ring-2 focus:ring-teal-400 focus:outline-none"
              required
            >
              <option value="farmer">Farmer</option>
              <option value="consumer">Consumer</option>
            </select>
          </div>
          <button
            type="submit"
            className="w-full py-2 px-4 bg-teal-600 text-white rounded-lg hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 transition duration-300"
          >
            Register
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <a href="/login" className="text-teal-600 hover:underline">
            Login
          </a>
        </p>
      </div>
    </div>
  );
};

export default Register;
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  auth,
  provider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  sendEmailVerification,
  signOut,
} from "../firebase.js";
import { getDatabase, ref, set, get } from "firebase/database";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const LoginFar = ({ setAuth }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [view, setView] = useState("login");

  const navigate = useNavigate();
  const db = getDatabase();

  const togglePasswordVisibility = () => setShowPassword(!showPassword);
  const toggleConfirmPasswordVisibility = () => setShowConfirmPassword(!showConfirmPassword);

  // Check auth state only on mount, but don’t redirect unless explicitly logging in

  const checkUserRoleAndNavigate = async (user) => {
    try {
      const userRef = ref(db, `users/${user.uid}`);
      const userSnapshot = await get(userRef);

      if (userSnapshot.exists()) {
        const userData = userSnapshot.val();
        const userRole = userData.role;
        console.log("Existing user role from DB:", userRole);

        if (userRole !== "farmer") {
          await set(ref(db, `users/${user.uid}/role`), "farmer");
          console.log("Role updated to farmer for UID:", user.uid);
        }
      } else {
        const userData = {
          email: user.email,
          name: user.displayName || "Google User",
          uid: user.uid,
          role: "farmer",
          createdAt: new Date().toISOString(),
          emailVerified: user.emailVerified || true,
        };
        await set(userRef, userData);
        console.log("New user created with role: farmer");
      }

      const token = await user.getIdToken();
      localStorage.setItem("token", token);
      localStorage.setItem("role", "farmer");
      localStorage.setItem("userDetails", JSON.stringify({
        uid: user.uid,
        email: user.email,
        name: user.displayName || userSnapshot.val()?.name || "Farmer",
      }));

      setAuth(true);
      console.log("Redirecting to /dashboard after login");
      navigate("/dashboard");
    } catch (error) {
      console.error("Error checking user role:", error);
      toast.error("Failed to authenticate user.");
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      console.log("Google login successful, UID:", user.uid);
      await checkUserRoleAndNavigate(user);

      toast.success("Login Successful!");
    } catch (error) {
      console.error("Google login error:", error.message);
      toast.error(error.message || "Google login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async () => {
    if (!email || !password) {
      toast.error("Email and Password are required!");
      return;
    }
    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      if (!user.emailVerified) {
        await signOut(auth);
        toast.error("Email not verified! Please verify your email.");
        return;
      }

      console.log("Email login successful, UID:", user.uid);
      await checkUserRoleAndNavigate(user);

      toast.success("Login Successful!");
    } catch (error) {
      console.error("Login error:", error.code, error.message);
      if (error.code === "auth/wrong-password") {
        toast.error("Incorrect password");
      } else if (error.code === "auth/user-not-found") {
        toast.error("No account found with this email");
      } else {
        toast.error(error.message || "Login failed");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    if (!email || !password || !confirmPassword || !name) {
      toast.error("All fields are required!");
      return;
    }
    if (password !== confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters long!");
      return;
    }
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const userData = {
        email,
        name,
        uid: user.uid,
        role: "farmer",
        createdAt: new Date().toISOString(),
        emailVerified: false,
      };
      await set(ref(db, `users/${user.uid}`), userData);

      await sendEmailVerification(user);
      toast.success("Registration successful! Please verify your email.");
      await signOut(auth);
      setView("login");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      setName("");
    } catch (error) {
      console.error("Register error:", error.code, error.message);
      if (error.code === "auth/email-already-in-use") {
        toast.error("Email already in use!");
      } else {
        toast.error(error.message || "Sign-up failed");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      toast.error("Please enter your email first!");
      return;
    }
    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, email);
      toast.success("Password reset email sent! Check your inbox.");
    } catch (error) {
      console.error("Forgot password error:", error.code, error.message);
      if (error.code === "auth/user-not-found") {
        toast.error("No account found with this email");
      } else {
        toast.error(error.message || "Failed to send reset email");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen w-full">
      <ToastContainer position="top-center" autoClose={3000} />

      <div className="relative w-1/2 h-full overflow-hidden">
        <video autoPlay loop muted className="absolute w-full h-full object-cover">
          <source src="left.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center text-white">
          <h1 className="text-4xl font-bold">FARMER TO CONSUMER COMMUNITY</h1>
          <p className="mt-2 text-gray-300">Home to Millions of people worldwide</p>
        </div>
      </div>

      <div
        className={`w-1/2 flex flex-col justify-center items-center p-10 bg-white transition-transform duration-500 ${
          view === "signup" ? "-translate-x-full" : ""
        }`}
      >
        {loading ? (
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500 mx-auto"></div>
            <p className="mt-2">Loading...</p>
          </div>
        ) : view === "login" ? (
          <>
            <h2 className="text-3xl font-bold">Welcome Back, Farmer!</h2>
            <p className="mt-1 text-gray-500">It's nice to see you again. Ready to sell?</p>
            <div className="w-full max-w-sm mt-5">
              <input
                type="email"
                placeholder="Your email"
                className="w-full p-3 mb-3 border border-gray-300 rounded-md hover:bg-gray-100"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
              />
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Your password"
                  className="w-full p-3 mb-3 border border-gray-300 rounded-md hover:bg-gray-100"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                />
                <span
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
                  onClick={togglePasswordVisibility}
                >
                  👁
                </span>
              </div>
              <button
                className="w-full p-3 bg-purple-300 text-white rounded-md hover:bg-purple-500 disabled:bg-gray-400"
                onClick={handleLogin}
                disabled={loading}
              >
                Log In
              </button>
              <div className="flex justify-end mt-3 text-sm">
                <button
                  className="text-blue-500 disabled:text-gray-400"
                  onClick={handleForgotPassword}
                  disabled={loading}
                >
                  Forgot password?
                </button>
              </div>
              <div className="flex items-center my-5 text-gray-500">
                <hr className="flex-grow" /> <span className="mx-2">or</span> <hr className="flex-grow" />
              </div>
              <button
                className="w-full p-3 border border-gray-300 rounded-md flex items-center justify-center hover:bg-gray-100 disabled:bg-gray-200"
                onClick={handleGoogleLogin}
                disabled={loading}
              >
                <img
                  src="https://cdn-icons-png.flaticon.com/128/281/281764.png"
                  alt="Google"
                  className="w-5 mr-2"
                />
                Continue with Google
              </button>
              <p className="mt-3 text-center">
                Don't have an account?{" "}
                <button
                  className="text-blue-500 disabled:text-gray-400"
                  onClick={() => setView("signup")}
                  disabled={loading}
                >
                  Sign up
                </button>
              </p>
            </div>
          </>
        ) : (
          <>
            <h2 className="text-3xl font-bold">Create a Farmer Account</h2>
            <p className="mt-1 text-gray-500">Join our farming community today!</p>
            <div className="w-full max-w-sm mt-5">
              <input
                type="text"
                placeholder="Full Name"
                className="w-full p-3 mb-3 border border-gray-300 rounded-md hover:bg-gray-100"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={loading}
              />
              <input
                type="email"
                placeholder="Email"
                className="w-full p-3 mb-3 border border-gray-300 rounded-md hover:bg-gray-100"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
              />
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  className="w-full p-3 mb-3 border border-gray-300 rounded-md hover:bg-gray-100"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                />
                <span
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
                  onClick={togglePasswordVisibility}
                >
                  👁
                </span>
              </div>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm Password"
                  className="w-full p-3 mb-3 border border-gray-300 rounded-md hover:bg-gray-100"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={loading}
                />
                <span
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
                  onClick={toggleConfirmPasswordVisibility}
                >
                  👁
                </span>
              </div>
              <button
                className="w-full p-3 bg-purple-300 text-white rounded-md hover:bg-purple-500 disabled:bg-gray-400"
                onClick={handleRegister}
                disabled={loading}
              >
                Sign Up
              </button>
              <p
                className="mt-3 text-center text-gray-700 hover:scale-105 cursor-pointer"
                onClick={() => setView("login")}
              >
                Already have an account? <span className="text-blue-500">Log in</span>
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default LoginFar;
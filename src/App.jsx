import { Routes, Route, Navigate } from "react-router-dom";
import HomePage from "./components/Home/HomePage.jsx";
import PaymentPage from "./components/Cart/PaymentPage";
import OrderSuccess from "./components/Cart/OrderSuccess";
import LiveTracking from "./components/Tracking/LiveTracking";
import Header from "./components/Home/Header.jsx";
import SearchPage from "./components/Search/SearchPage.jsx";
import LandingPage from "./components/Landing/LandingPage.jsx";

// Auth pages
import Login from "./auth/Login.jsx";
import Register from "./auth/Register.jsx";
import OTPVerification from "./auth/OTPVerification.jsx";
import ProtectedRoute from "./auth/ProtectedRoute.jsx";
import { AuthProvider, useAuth } from "./auth/AuthContext.jsx";
import { useEffect, useState } from "react";

// Component to handle root redirect - shows landing if not logged in
function RootHandler() {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
      </div>
    );
  }
  
  // Not logged in? Show landing page
  if (!user) {
    return <LandingPage />;
  }
  
  // Logged in? Show home page
  return <HomePage />;
}

function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Root - shows landing or home based on auth */}
        <Route path="/" element={<RootHandler />} />
        
        {/* Landing page - also accessible via /welcome */}
        <Route path="/welcome" element={<LandingPage />} />
        
        {/* Public routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/otp-verify" element={<OTPVerification />} />

        {/* Protected routes */}
        <Route
          path="/home/*"
          element={
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/search"
          element={
            <ProtectedRoute>
              <SearchPage/>
            </ProtectedRoute>
          }
        />
        <Route
          path="/payment"
          element={
            <ProtectedRoute>
              <PaymentPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/success"
          element={
            <ProtectedRoute>
              <OrderSuccess />
            </ProtectedRoute>
          }
        />
        <Route
          path="/track/:orderId"
          element={
            <ProtectedRoute>
              <LiveTracking />
            </ProtectedRoute>
          }
        />
        
        {/* Catch-all for any other protected routes */}
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </AuthProvider>

  );
}

export default App;
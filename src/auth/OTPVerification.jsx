import React, { useState } from "react";
import { verifySmsOtp } from "./authService";
import { useNavigate } from "react-router-dom";
import Toast from "../components/Toast";

export default function OTPVerification() {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });
  const navigate = useNavigate();

  const pending = JSON.parse(localStorage.getItem("myezz_pending_user") || "{}");

  const handleVerify = async (e) => {
    e.preventDefault();
    if (!code.trim()) {
      setError("Please enter the OTP code");
      return;
    }
    
    try {
      setLoading(true);
      setError("");
      const user = await verifySmsOtp(code);
      
      const userObj = {
        uid: user.uid,
        phone: user.phoneNumber || pending.phone || "",
        displayName: pending.name || user.displayName || "",
        email: user.email || "",
      };
      localStorage.setItem("myezz_user", JSON.stringify(userObj));
      localStorage.removeItem("myezz_pending_user");
      
      setToast({
        show: true,
        message: `Welcome to MyEzz, ${pending.name || 'User'}! 🎉`,
        type: "success"
      });
      
      setTimeout(() => {
        navigate("/");
      }, 1500);
      
    } catch (err) {
      setError("OTP verification failed: " + (err.message || err));
      
      setToast({
        show: true,
        message: "OTP verification failed. Please try again.",
        type: "error"
      });
    } finally {
      setLoading(false);
    }
  };

  const closeToast = () => {
    setToast({ show: false, message: "", type: "success" });
  };

  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#E23744] to-[#990000] relative overflow-hidden">
        <div className="relative z-10 flex flex-col justify-center items-center px-12 w-full">
          <div className="text-center mb-8">
            <h1 className="text-6xl font-bold mb-4 text-white drop-shadow-lg">MyEzz</h1>
            <p className="text-xl opacity-90 text-white drop-shadow-md">Almost there! Verify your phone number</p>
          </div>
          
          <div className="flex justify-between items-center w-full max-w-md">
            <div className="flex justify-center items-center">
              <img src="/spoonandfork355-zham.svg" alt="Spoon" className="w-48 h-48 transform -rotate-12" />
            </div>
            
            <div className="flex justify-center items-center">
              <div className="w-20 h-20 bg-white rounded-full shadow-lg flex items-center justify-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full border-2 border-gray-200"></div>
              </div>
            </div>
            
            <div className="flex justify-center items-center">
              <img src="/spoonandfork322-728kk.svg" alt="Fork" className="w-48 h-48 transform rotate-12" />
            </div>
          </div>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12 bg-gray-50">
        <div className="w-full max-w-md">
          <div className="lg:hidden text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">MyEzz</h1>
            <p className="text-gray-600">Verify your phone number</p>
          </div>

          <div className="hidden lg:block mb-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Verify OTP</h2>
            <p className="text-gray-600">Enter the code sent to your phone</p>
          </div>

          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-blue-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
              </svg>
              <span className="text-blue-800 font-medium">{pending.phone}</span>
            </div>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {error}
              </div>
            </div>
          )}

          <form onSubmit={handleVerify} className="space-y-6">
            <div>
              <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-2">
                OTP Code
              </label>
              <input
                id="otp"
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Enter 4-6 digit code"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#E23744] focus:border-transparent transition-all duration-200 text-center text-lg font-mono"
                maxLength="6"
                required
              />
              <p className="mt-1 text-xs text-gray-500">Enter the code sent to your phone number</p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#E23744] hover:bg-[#c92f3a] disabled:bg-[#E23744]/50 text-white py-4 px-6 rounded-xl text-lg font-medium shadow-sm transition-all duration-300 hover:shadow-md disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Verifying...
                </div>
              ) : (
                "Verify & Continue"
              )}
            </button>
          </form>

          <div className="mt-8 text-center">
            <button 
              onClick={() => navigate("/register")}
              className="text-[#E23744] hover:text-[#c92f3a] font-medium transition-colors duration-200"
            >
              ← Back to signup
            </button>
          </div>

          <div className="mt-6 text-center text-sm text-gray-500">
            <p>Didn't receive the code? Check your SMS or try again</p>
          </div>
        </div>
      </div>

      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.show}
        onClose={closeToast}
      />
    </div>
  );
}

import React, { useState, useEffect } from "react";
import { signInWithGoogle, sendSmsOtp } from "./authService";
import { InteractiveHoverButton } from "../components/ui/interactive-hover-button";
import { useNavigate, useLocation } from "react-router-dom";
import Toast from "../components/Toast";

const bgImage = "/landing-bg.png"; // Using a textured fallback if needed, or CSS gradients
const platterImage = "/login_platter.png";
const desktopPlatterImage = "/desktop_login.png";

export default function AuthPage({ initialMode = "login" }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [mode, setMode] = useState(initialMode); // 'login' or 'register'

  // Update mode based on route changes if necessary
  useEffect(() => {
    if (location.pathname === '/register') {
      setMode('register');
    } else if (location.pathname === '/login') {
      setMode('login');
    }
  }, [location.pathname]);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });
  const [showEmailForm, setShowEmailForm] = useState(false);

  // Form states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState(""); // Cosmetic for login
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  const toggleMode = () => {
    const newMode = mode === "login" ? "register" : "login";
    setMode(newMode);
    setError("");
    setShowEmailForm(false);
    // Use replace to avoid polluting history on visual toggles
    navigate(`/${newMode}`, { replace: true });
  };

  const closeToast = () => setToast({ show: false, message: "", type: "success" });

  // --- Auth Handlers ---
  const handleGoogleAuth = async () => {
    setIsLoading(true);
    setError("");
    try {
      const user = await signInWithGoogle();
      const userData = {
        uid: user.uid,
        phone: user.phoneNumber || "",
        displayName: user.displayName || "",
        email: user.email || "",
      };

      localStorage.setItem("myezz_user", JSON.stringify(userData));
      setToast({ show: true, message: `Welcome${mode === 'login' ? ' back' : ''}, ${user.displayName || 'User'}! 🎉`, type: "success" });
      setTimeout(() => navigate("/home"), 1500);
    } catch (err) {
      setError(`Google Auth failed: ${err.message}`);
      setToast({ show: true, message: "Authentication failed. Please try again.", type: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (mode === "login") {

      // We enforce Google sign in or fallback to a toast.
      setToast({ show: true, message: "Email login is under construction. Please use 'Continue with Google'.", type: "error" });
      return;
    }

    if (mode === "register") {
      if (!name.trim()) return setError("Please enter your name");
      if (!email.trim()) return setError("Please enter your email");
      if (!phone.startsWith("+91")) return setError("Please enter phone number in format: +91XXXXXXXXXX");

      try {
        setIsLoading(true);
        await sendSmsOtp(phone, "recaptcha-container");
        localStorage.setItem("myezz_pending_user", JSON.stringify({ name, email, phone }));
        navigate("/otp-verify");
      } catch (err) {
        if (err.code === 'auth/billing-not-enabled') {
          setError("Phone authentication is not enabled. Please enable billing in Firebase, or Sign up using Google.");
        } else {
          setError("Failed to send OTP: " + err.message);
        }
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row bg-[#FDFBF7] font-sans selection:bg-orange-200 relative">

      {/* 
        TOP/LEFT SECTION (Image & Gradient) 
        Mobile: Top 40vh, stacked. Desktop: Left 50% split screen.
      */}
      <div className="relative w-full h-[35vh] md:h-screen md:w-1/2 overflow-visible md:overflow-hidden bg-gradient-to-br from-[#FF8C42] via-[#FF6A00] to-[#E65C00]">

        {/* Subtle background texture / blur element (simulating repeating bowls) */}
        <div className="absolute inset-0 opacity-20 pointer-events-none mix-blend-overlay overflow-hidden" style={{ backgroundImage: `url(${platterImage})`, backgroundSize: '150px', filter: 'blur(4px)' }}></div>

        {/* MyEzz Logo centered on orange section - mobile only */}
        <div className="absolute inset-0 flex items-center justify-center z-[5] md:hidden pointer-events-none">
          <img src="/Myezz final logo.svg" alt="MyEzz" className="w-28 opacity-30" />
        </div>

        {/* Mock iOS Status Bar for Mobile Preview realism */}
        <div className="absolute top-0 w-full h-12 flex justify-between items-center px-6 text-white text-sm font-semibold z-30 md:hidden pointer-events-none">
          <span>9:41</span>
          <div className="flex items-center gap-1.5 opacity-90">
            {/* Cellular */}
            <svg width="17" height="11" viewBox="0 0 17 11" fill="currentColor">
              <path d="M16.5 0.5H15C14.72 0.5 14.5 0.72 14.5 1V10.5C14.5 10.78 14.72 11 15 11H16.5C16.78 11 17 10.78 17 10.5V1C17 0.72 16.78 0.5 16.5 0.5ZM12 3H10.5C10.22 3 10 3.22 10 3.5V10.5C10 10.78 10.22 11 10.5 11H12C12.28 11 12.5 10.78 12.5 10.5V3.5C12.5 3.22 12.28 3 12 3ZM7.5 5.5H6C5.72 5.5 5.5 5.72 5.5 6V10.5C5.5 10.78 5.72 11 6 11H7.5C7.78 11 8 10.78 8 10.5V6C8 5.72 7.78 5.5 7.5 5.5ZM3 8H1.5C1.22 8 1 8.22 1 8.5V10.5C1 10.78 1.22 11 1.5 11H3C3.28 11 3.5 10.78 3.5 10.5V8.5C3.5 8.22 3.28 8 3 8Z" />
            </svg>
            {/* Wifi */}
            <svg width="15" height="11" viewBox="0 0 15 11" fill="currentColor">
              <path d="M7.5 11C8.32843 11 9 10.3284 9 9.5C9 8.67157 8.32843 8 7.5 8C6.67157 8 6 8.67157 6 9.5C6 10.3284 6.67157 11 7.5 11Z" />
              <path d="M10.83 5.42C9.02 3.61 5.96 3.61 4.15 5.42L5.57 6.84C6.61 5.8 8.37 5.8 9.41 6.84L10.83 5.42Z" />
              <path d="M13.66 2.59C10.26 -0.810001 4.74 -0.810001 1.34 2.59L2.76 4H2.75C5.38 1.37 9.61 1.37 12.24 4L13.66 2.59Z" />
            </svg>
            {/* Battery */}
            <svg width="25" height="12" viewBox="0 0 25 12" fill="currentColor">
              <rect x="0.5" y="0.5" width="21" height="11" rx="2.5" stroke="currentColor" fill="none" />
              <path d="M23 4V8C23.55 8 24 7.55 24 7V5C24 4.45 23.55 4 23 4Z" />
              <rect x="2" y="2" width="18" height="8" rx="1.5" />
            </svg>
          </div>
        </div>

        {/* Top Right Toggle Link (Mobile Only) */}
        <button
          onClick={toggleMode}
          className="absolute top-12 right-6 text-white text-sm font-semibold tracking-wider z-30 md:hidden flex items-center gap-1.5 border border-white/60 rounded-full px-4 py-1.5 hover:bg-white/10 transition-all duration-300"
        >
          {mode === "login" ? "REGISTER" : "LOGIN"}
          <span className="text-xs">→</span>
        </button>
        {/* Mobile platter moved to root container for proper stacking */}

        {/* The Desktop Image */}
        <div className="hidden md:flex absolute inset-0 items-center justify-center z-20 pointer-events-none">
          <img
            src={desktopPlatterImage}
            alt="Authentic Indian Thali"
            className="w-full h-full object-cover"
          />
          {/* Orange gradient overlay - light */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#FF6A00]/30 via-[#FF6A00]/15 to-transparent"></div>
        </div>

        {/* Mobile Curve SVG Boundary (Bottom out) */}
        <div className="absolute -bottom-1 w-full h-12 md:hidden pointer-events-none overflow-hidden z-20">
          <svg className="absolute bottom-0 w-full h-full" viewBox="0 0 1440 160" preserveAspectRatio="none" fill="#FDFBF7">
            <path d="M0,160 L1440,160 L1440,80 C1100,160 340,160 0,60 Z" />
          </svg>
        </div>

        {/* Desktop Curve SVG Boundary (Right side vertical curve) */}
        <svg className="absolute -right-1 top-0 h-full w-24 hidden md:block pointer-events-none z-30" viewBox="0 0 160 1440" preserveAspectRatio="none" fill="#FDFBF7">
          <path d="M160,0 L160,1440 L80,1440 C160,1100 160,340 60,0 Z" />
        </svg>

      </div>

      {/* Mobile Platter Image - placed at root level so it sits above both sections */}
      <div className="absolute left-1/2 top-[35vh] -translate-x-1/2 -translate-y-1/2 md:hidden z-30 w-90 max-w-[420px] pointer-events-none">
        <img
          src={platterImage}
          alt="Authentic Indian Thali"

          className="w-full h-auto object-contain drop-shadow-[0_15px_30px_rgba(0,0,0,0.4)]"
        />
      </div>

      {/* 
        BOTTOM/RIGHT SECTION (Form Content)
      */}
      <div className="w-full flex-1 md:w-1/2 flex flex-col justify-center px-8 md:px-16 lg:px-24 py-6 pt-32 md:pt-12 md:py-12 bg-[#FDFBF7] relative z-10 transition-all duration-500 ease-in-out">

        {/* Desktop Top Right Toggle - removed per user request */}

        <div className="max-w-md w-full mx-auto md:ml-0 md:mt-12">
          <div className="mb-8">
            <h1 className="text-[28px] md:text-3xl lg:text-4xl font-extrabold text-[#2D2D2D] leading-tight mb-2">
              Welcome back!
            </h1>
            <p className="text-[#646464] text-sm md:text-base font-medium">
              Sign in to continue to MyEzz
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm font-medium animate-in fade-in slide-in-from-top-2">
              {error}
            </div>
          )}

          {/* MOBILE ONLY: Toggle View for Email vs Google */}
          {mode === "login" && !showEmailForm && (
            <div className="space-y-4 md:hidden">
              <button
                type="button"
                onClick={() => setShowEmailForm(true)}
                className="w-full flex items-center justify-center gap-3 bg-[#FF6A00] text-white py-4 px-6 rounded-full text-[15px] font-bold shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 active:scale-[0.98]"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                Sign in with Email
              </button>
              <button
                type="button"
                onClick={handleGoogleAuth}
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-3 bg-white hover:bg-[#FAF9F6] text-[#2D2D2D] py-4 px-6 rounded-full text-[15px] font-bold shadow-sm border border-[#EBEBEB] transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 active:scale-[0.98] disabled:opacity-70 disabled:pointer-events-none"
              >
                <img src="/googlelogo354-ccx-200w.png" alt="Google" className="w-5 h-5" />
                Continue with Google
              </button>
              <div className="mt-8 text-center md:hidden">
                <span className="text-sm font-semibold text-[#646464]">
                  Don't have an account?{" "}
                </span>
                {/* Native mobile Register text under Email Sign in - ensuring smooth animated underline */}
                <button
                  type="button"
                  onClick={toggleMode}
                  className="group text-sm font-bold text-[#FF6A00] hover:text-[#e65c00] transition-colors relative focus:outline-none"
                >
                  Register <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">&rarr;</span>
                  <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-[#e65c00] transition-all duration-300 group-hover:w-full"></span>
                </button>
              </div>
            </div>
          )}

          {/* MAIN FORM AREA: Always visible on Desktop, visible on Mobile when mode involves Email form */}
          <div className={mode === "login" && !showEmailForm ? "hidden md:block" : "block"}>
            <form onSubmit={handleFormSubmit} className="space-y-4">

              {/* SIGN UP FIELDS */}
              {mode === "register" && (
                <>
                  <div>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Full Name"
                      className="w-full px-5 py-4 bg-white border border-[#EBEBEB] rounded-2xl focus:ring-2 focus:ring-[#FF6A00] focus:border-transparent transition-all outline-none text-[#2D2D2D] shadow-sm font-medium"
                      required
                    />
                  </div>
                  <div>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="Phone Number (+91XXXXXXXXXX)"
                      className="w-full px-5 py-4 bg-white border border-[#EBEBEB] rounded-2xl focus:ring-2 focus:ring-[#FF6A00] focus:border-transparent transition-all outline-none text-[#2D2D2D] shadow-sm font-medium"
                      required
                    />
                  </div>
                </>
              )}

              {/* COMMON / LOGIN FIELDS */}
              <div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email Address"
                  className="w-full px-5 py-4 bg-white border border-[#EBEBEB] rounded-2xl focus:ring-2 focus:ring-[#FF6A00] focus:border-transparent transition-all outline-none text-[#2D2D2D] shadow-sm font-medium"
                  required
                />
              </div>

              {mode === "login" && (
                <div>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    className="w-full px-5 py-4 bg-white border border-[#EBEBEB] rounded-2xl focus:ring-2 focus:ring-[#FF6A00] focus:border-transparent transition-all outline-none text-[#2D2D2D] shadow-sm font-medium"
                    required
                  />
                  <div className="mt-3 flex items-center justify-end gap-1">
                    <span className="text-xs md:text-sm text-[#646464] font-medium">Don't have an account?</span>
                    <button
                      type="button"
                      onClick={toggleMode}
                      className="group text-xs md:text-sm font-bold text-[#FF6A00] hover:text-[#e65c00] transition-colors relative focus:outline-none"
                    >
                      Register
                      <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-[#e65c00] transition-all duration-300 group-hover:w-full"></span>
                    </button>
                  </div>
                </div>
              )}

              <div id="recaptcha-container" className="flex justify-center mb-2"></div>

              {/* Primary CTA via Shadcn Interactive Hover Button */}
              <div className="w-full mt-4">
                <InteractiveHoverButton
                  type="submit"
                  disabled={isLoading}
                  text={mode === "login" ? "Sign In" : "Register"}
                  className="w-full py-4 text-base tracking-wide bg-[#FF6A00] text-white border-0 shadow-[0_8px_16px_rgba(255,106,0,0.25)] hover:shadow-[0_12px_24px_rgba(255,106,0,0.35)]"
                />
              </div>
            </form>

            <div className="mt-8 mb-6 flex items-center justify-center">
              <div className="h-px bg-[#EBEBEB] flex-1"></div>
              <span className="px-4 text-[#A1A1A1] text-xs font-bold tracking-wider">or</span>
              <div className="h-px bg-[#EBEBEB] flex-1"></div>
            </div>

            {/* Secondary CTA (Google) */}
            <button
              onClick={handleGoogleAuth}
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-3 bg-white hover:bg-[#FAF9F6] text-[#2D2D2D] py-4 px-6 rounded-full text-[15px] font-bold shadow-sm border border-[#EBEBEB] transition-all duration-300 hover:shadow-md hover:border-[#D1D1D1] hover:-translate-y-0.5 active:scale-[0.98] disabled:opacity-70 disabled:pointer-events-none"
            >
              <img
                src="/googlelogo354-ccx-200w.png"
                alt="Google"
                className="w-5 h-5"
              />
              Continue with Google
            </button>

            <div className="text-center mt-6 md:hidden">
              {/* Removed desktop duplicate sign up link string */}
            </div>
          </div>

          <div className="mt-8 pt-4 border-t border-transparent text-center px-4 w-full">
            <p className="text-[11px] md:text-xs text-[#A1A1A1] leading-relaxed max-w-[280px] mx-auto">
              By continuing, you agree to our Terms of Service and Privacy Policy
            </p>
          </div>

        </div>
      </div>

      <Toast message={toast.message} type={toast.type} isVisible={toast.show} onClose={closeToast} />
    </div>
  );
}

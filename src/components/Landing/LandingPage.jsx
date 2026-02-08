import { useEffect, useRef, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Clock, Bike, MapPin, X } from 'lucide-react';
import { Canvas, useFrame } from '@react-three/fiber';
import { motion, AnimatePresence } from 'framer-motion';
import * as THREE from 'three';
import HorizontalFoodCarousel from './HorizontalFoodCarousel';
import TapedFooter from './TapedFooter';
import LandingNavbar from './LandingNavbar';
import LocationSearchBar from './LocationSearchBar';
import HowItWorks from './HowItWorks';

// ========== Three.js Particle System ==========
function Particles({ count = 50 }) {
  const mesh = useRef();
  const positions = useRef(new Float32Array(count * 3));
  const velocities = useRef(new Float32Array(count * 3));
  
  useEffect(() => {
    for (let i = 0; i < count; i++) {
      positions.current[i * 3] = (Math.random() - 0.5) * 20;
      positions.current[i * 3 + 1] = (Math.random() - 0.5) * 10;
      positions.current[i * 3 + 2] = (Math.random() - 0.5) * 5;
      velocities.current[i * 3] = (Math.random() - 0.5) * 0.01;
      velocities.current[i * 3 + 1] = Math.random() * 0.02 + 0.005;
      velocities.current[i * 3 + 2] = (Math.random() - 0.5) * 0.01;
    }
    if (mesh.current) {
      mesh.current.geometry.setAttribute(
        'position',
        new THREE.BufferAttribute(positions.current, 3)
      );
    }
  }, [count]);

  useFrame(() => {
    if (!mesh.current) return;
    try {
      const pos = mesh.current.geometry?.attributes?.position;
      if (!pos || !pos.array) return;
      for (let i = 0; i < count; i++) {
        pos.array[i * 3] += velocities.current[i * 3];
        pos.array[i * 3 + 1] += velocities.current[i * 3 + 1];
        pos.array[i * 3 + 2] += velocities.current[i * 3 + 2];
        
        if (pos.array[i * 3 + 1] > 6) {
          pos.array[i * 3 + 1] = -6;
          pos.array[i * 3] = (Math.random() - 0.5) * 20;
        }
      }
      pos.needsUpdate = true;
    } catch (e) {}
  });

  return (
    <points ref={mesh}>
      <bufferGeometry />
      <pointsMaterial 
        size={0.08} 
        color="#ff9f5a" 
        transparent 
        opacity={0.6}
        sizeAttenuation={true}
      />
    </points>
  );
}

function ParticleCanvas() {
  const [hasError, setHasError] = useState(false);
  if (hasError) return null;
  
  return (
    <div className="absolute inset-0 pointer-events-none z-0">
      <Canvas
        camera={{ position: [0, 0, 10], fov: 60 }}
        style={{ background: 'transparent' }}
        gl={{ alpha: true, antialias: true, preserveDrawingBuffer: true, failIfMajorPerformanceCaveat: false }}
        onCreated={({ gl }) => {
          gl.domElement.addEventListener('webglcontextlost', (e) => {
            e.preventDefault();
            setHasError(true);
          });
        }}
      >
        <Particles count={60} />
      </Canvas>
    </div>
  );
}

// ========== Rolling Text Component ==========
const rollingWords = ['Effortlessly', 'Securely', 'Efficiently'];

function RollingText() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % rollingWords.length);
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  return (
    <span className="inline-block">
      <AnimatePresence mode="wait">
        <motion.span
          key={rollingWords[index]}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -20, opacity: 0 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-orange-600"
        >
          {rollingWords[index]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

// ========== Service Card Component (Enhanced hover effects) ==========
function ServiceCard({ icon: Icon, title, description, iconBgColor, isMiddle = false }) {
  return (
    <div 
      className={`flex-1 min-w-[240px] max-w-[300px] flex flex-col items-center gap-4 p-6 rounded-xl bg-white border border-gray-100 shadow-md transition-all duration-300 group hover:shadow-2xl hover:-translate-y-2 ${
        isMiddle ? '-translate-y-2 shadow-xl' : ''
      }`}
    >
      <div 
        className="w-14 h-14 rounded-xl flex items-center justify-center shadow-md transition-shadow duration-300 group-hover:shadow-lg group-hover:shadow-orange-500/25"
        style={{ background: iconBgColor }}
      >
        <Icon className="w-7 h-7 text-white" strokeWidth={2} />
      </div>
      <div className="text-center">
        <h3 className="text-lg font-bold text-gray-800 mb-1">{title}</h3>
        <p className="text-gray-500 text-sm leading-relaxed">{description}</p>
      </div>
    </div>
  );
}

// ========== Toast Component ==========
function Toast({ message, type = 'info', onClose }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 50 }}
      className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 flex items-center gap-3 px-5 py-3 bg-gray-900 text-white rounded-xl shadow-2xl"
    >
      <span className="text-sm font-medium">{message}</span>
      <button onClick={onClose} className="text-gray-400 hover:text-white">
        <X className="w-4 h-4" />
      </button>
    </motion.div>
  );
}

// ========== Main Landing Page Component ==========
export default function LandingPage() {
  const [toast, setToast] = useState(null);

  const showToast = useCallback((message, type = 'info') => {
    setToast({ message, type });
  }, []);

  return (
    <div className="min-h-screen relative overflow-x-hidden bg-gray-50 scroll-smooth">
      {/* ===== FIXED NAVBAR ===== */}
      <LandingNavbar />

      {/* ===== HERO SECTION ===== */}
      <section id="home" className="relative min-h-screen overflow-hidden pt-20">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: 'url(/landing-bg.png)' }}
        />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-orange-50/40 via-transparent to-orange-100/30" />
        
        {/* Three.js Particles */}
        <ParticleCanvas />
        
        {/* Main Content */}
        <div className="relative z-10 min-h-screen flex flex-col">
          {/* Hero Content */}
          <main className="flex-1 flex flex-col lg:flex-row items-center justify-center lg:justify-between px-4 sm:px-6 md:px-12 lg:px-16 py-6 lg:py-8 gap-4 lg:gap-4">
            
            {/* Left Side - Text Content */}
            <div className="flex flex-col items-center lg:items-start text-center lg:text-left max-w-2xl z-20 px-2">
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 leading-tight mb-3 lg:mb-4">
                <span className="block">Your Favorite Food,</span>
                <span className="block">Delivered <RollingText /></span>
              </h1>
              
              <p className="text-gray-600 text-sm sm:text-base md:text-lg lg:text-xl mb-4 lg:mb-6 max-w-md">
                <span className="block">Fast delivery from local vendors & street food near you.</span>
                <span className="block">Simple. Reliable. MyEzz.</span>
              </p>

              {/* Location Search Bar */}
              <div className="w-full max-w-md mb-4 lg:mb-6">
                <LocationSearchBar showToast={showToast} />
              </div>
              
              {/* Partner text link - secondary action */}
              <a
                href="https://my-ezz-restaurants.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-gray-600 hover:text-orange-600 text-sm font-medium transition-colors"
              >
                Own a restaurant? <span className="text-orange-500 font-semibold">Partner with us →</span>
              </a>
            </div>

            {/* Right Side - Food Carousel */}
            <div className="w-full lg:w-[55%] flex items-center justify-center mt-2 lg:mt-0 max-h-[350px] sm:max-h-[400px] lg:max-h-none overflow-hidden">
              <HorizontalFoodCarousel />
            </div>
          </main>
        </div>
      </section>

      {/* ===== SOFT GRADIENT TRANSITION ===== */}
      <div className="h-16 bg-gradient-to-b from-transparent via-gray-50 to-white" />

      {/* ===== HOW IT WORKS SECTION ===== */}
      <HowItWorks />

      {/* ===== SOFT GRADIENT TRANSITION ===== */}
      <div className="h-8 bg-gradient-to-b from-white to-gray-50" />

      {/* ===== SERVICES SECTION ===== */}
      <section className="relative py-12 px-4 sm:px-6 md:px-12 lg:px-16 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-5xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
              Why Choose <span className="text-orange-500">MyEzz</span>?
            </h2>
            <p className="text-gray-500 text-base max-w-lg mx-auto">
              Features designed for your convenience
            </p>
          </div>

          {/* Service Cards - Updated specific text */}
          <div className="flex flex-col md:flex-row gap-5 justify-center">
            <ServiceCard 
              icon={Clock} 
              title="24/7 Service"
              description="Order anytime, day or night. We're always here for you."
              iconBgColor="linear-gradient(135deg, #FFB347, #FF6A00)"
            />
            <ServiceCard 
              icon={Bike} 
              title="30-min Average Delivery"
              description="Lightning-fast delivery to your doorstep."
              iconBgColor="linear-gradient(135deg, #FFB347, #FF6A00)"
              isMiddle={true}
            />
            <ServiceCard 
              icon={MapPin} 
              title="Track Your Rider in Real Time"
              description="Watch your order on live Google Maps tracking."
              iconBgColor="linear-gradient(135deg, #FF6B6B, #FF4757)"
            />
          </div>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <TapedFooter />

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <Toast 
            message={toast.message} 
            type={toast.type} 
            onClose={() => setToast(null)} 
          />
        )}
      </AnimatePresence>
    </div>
  );
}

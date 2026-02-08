import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const foodImages = [
  { id: 1, src: '/food-carousel/pizza.jpg', alt: 'Delicious Pizza', caption: 'Straight from the oven to you' },
  { id: 2, src: '/food-carousel/burger.jpg', alt: 'Juicy Burger', caption: "Cravings don't wait. Neither do we" },
  { id: 3, src: '/food-carousel/momos.jpg', alt: 'Steamed Momos', caption: 'Fresh momos from vendors near you' },
  { id: 4, src: '/food-carousel/streetfood.jpg', alt: 'Indian Street Food', caption: 'Order your favourite street food' },
  { id: 5, src: '/food-carousel/brownie.jpg', alt: 'Chocolate Brownie', caption: 'Sweet treats delivered fresh' },
];

// Simple click cursor SVG
function SwipingCursor({ className }) {
  return (
    <motion.div
      className={className}
      animate={{ x: [0, 50, 0] }}
      transition={{
        duration: 1.5,
        repeat: Infinity,
        ease: [0.4, 0, 0.2, 1],
      }}
    >
      <svg 
        width="28" 
        height="28" 
        viewBox="0 0 24 24" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        className="drop-shadow-lg"
      >
        <path 
          d="M5 3L19 12L12 13L9 20L5 3Z" 
          fill="white" 
          stroke="#ff6a00" 
          strokeWidth="1.5" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        />
      </svg>
    </motion.div>
  );
}

export default function HorizontalFoodCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const navigate = useCallback((direction) => {
    setCurrentIndex((prev) => {
      if (direction > 0) {
        return prev === foodImages.length - 1 ? 0 : prev + 1;
      }
      return prev === 0 ? foodImages.length - 1 : prev - 1;
    });
  }, []);

  // Auto-scroll pauses on hover
  useEffect(() => {
    if (isHovered) return;
    const interval = setInterval(() => {
      navigate(1);
    }, 1500);
    return () => clearInterval(interval);
  }, [navigate, isHovered]);

  const getCardStyle = (index) => {
    const total = foodImages.length;
    let diff = index - currentIndex;
    if (diff > total / 2) diff -= total;
    if (diff < -total / 2) diff += total;

    // Center card elevated with glass blur
    if (diff === 0) {
      return { x: 0, y: -15, scale: 1, opacity: 1, zIndex: 10, blur: 0 };
    } else if (diff === -1) {
      return { x: -220, y: 0, scale: 0.75, opacity: 0.6, zIndex: 4, blur: 1 };
    } else if (diff === -2) {
      return { x: -380, y: 0, scale: 0.55, opacity: 0.2, zIndex: 3, blur: 3 };
    } else if (diff === 1) {
      return { x: 220, y: 0, scale: 0.75, opacity: 0.6, zIndex: 4, blur: 1 };
    } else if (diff === 2) {
      return { x: 380, y: 0, scale: 0.55, opacity: 0.2, zIndex: 3, blur: 3 };
    } else {
      return { x: diff > 0 ? 500 : -500, y: 0, scale: 0.4, opacity: 0, zIndex: 0, blur: 5 };
    }
  };

  const isVisible = (index) => {
    const total = foodImages.length;
    let diff = index - currentIndex;
    if (diff > total / 2) diff -= total;
    if (diff < -total / 2) diff += total;
    return Math.abs(diff) <= 2;
  };

  return (
    <div 
      className="relative flex flex-col items-center justify-center w-full h-[300px] sm:h-[380px] md:h-[450px] lg:h-[520px]"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Card Stack */}
      <div className="relative flex items-center justify-center w-full h-full">
        {foodImages.map((image, index) => {
          if (!isVisible(index)) return null;
          const style = getCardStyle(index);
          const isCurrent = index === currentIndex;

          return (
            <motion.div
              key={image.id}
              className="absolute"
              animate={{
                x: style.x,
                y: style.y,
                scale: style.scale,
                opacity: style.opacity,
                filter: `blur(${style.blur}px)`,
              }}
              transition={{
                type: 'spring',
                stiffness: 260,
                damping: 22,
                mass: 0.7,
              }}
              style={{ zIndex: style.zIndex }}
            >
              {/* Glassmorphism border + shadow */}
              <div
                className="relative overflow-hidden rounded-2xl sm:rounded-3xl"
                style={{
                  width: isCurrent ? 'clamp(260px, 70vw, 400px)' : 'clamp(200px, 55vw, 300px)',
                  height: isCurrent ? 'clamp(175px, 45vw, 270px)' : 'clamp(135px, 35vw, 200px)',
                  boxShadow: isCurrent
                    ? '0 35px 70px -15px rgba(0,0,0,0.45), 0 0 0 1px rgba(255,255,255,0.25), inset 0 0 0 1px rgba(255,255,255,0.1)'
                    : '0 20px 40px -12px rgba(0,0,0,0.3)',
                  background: isCurrent 
                    ? 'linear-gradient(135deg, rgba(255,255,255,0.15), rgba(255,255,255,0.05))'
                    : 'transparent',
                  backdropFilter: isCurrent ? 'blur(8px)' : 'none',
                  padding: isCurrent ? '4px' : '0',
                }}
              >
                <div className="w-full h-full overflow-hidden rounded-xl sm:rounded-2xl relative">
                  <img
                    src={image.src}
                    alt={image.alt}
                    className="w-full h-full object-cover"
                    draggable={false}
                  />
                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-white/5 pointer-events-none" />
                  
                  {/* Caption overlay - only on active card */}
                  {isCurrent && (
                    <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5">
                      <AnimatePresence mode="wait">
                        <motion.p
                          key={image.caption}
                          initial={{ opacity: 0, y: 15 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -15 }}
                          transition={{ duration: 0.35 }}
                          className="text-white text-sm sm:text-base md:text-lg font-semibold text-center drop-shadow-lg"
                          style={{ textShadow: '0 2px 8px rgba(0,0,0,0.5)' }}
                        >
                          {image.caption}
                        </motion.p>
                      </AnimatePresence>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}

        {/* Cursor SVG */}
        <SwipingCursor className="absolute bottom-[25%] left-1/2 transform -translate-x-1/2 z-50 pointer-events-none" />
      </div>

      {/* Navigation dots */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 z-30">
        {foodImages.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`h-2 rounded-full transition-all duration-300 ease-out ${
              index === currentIndex
                ? 'w-8 bg-orange-500 shadow-lg shadow-orange-500/40'
                : 'w-2 bg-gray-400/50 hover:bg-gray-400/70'
            }`}
            aria-label={`Go to image ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

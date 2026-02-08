import { Linkedin, Instagram } from 'lucide-react';
import { Link } from 'react-router-dom';

// Orange tape SVG - smaller to avoid text overlap
const OrangeTape = ({ className = "" }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="80" 
    height="65" 
    viewBox="0 0 95 80" 
    fill="none"
    className={className}
  >
    <path d="M1 45L70.282 5L88.282 36.1769L19 76.1769L1 45Z" fill="#ff6a00"/>
    <path d="M69.6829 39.997C74.772 36.9233 80.2799 35.022 85.4464 32.0415C85.5584 31.9769 85.6703 31.912 85.782 31.8468L83.9519 38.6769C80.2833 32.3886 75.7064 26.4975 72.2275 20.0846C70.0007 15.9783 67.7966 11.8425 65.6183 7.69261L72.9746 9.66373C70.566 10.9281 68.1526 12.1837 65.7375 13.4301C59.1543 16.828 52.5477 20.1634 45.9059 23.4675C39.2779 26.7637 32.6138 30.0293 25.946 33.2683C21.417 35.4683 16.8774 37.6611 12.3408 39.8468C10.3494 40.8065 8.36335 41.7623 6.37228 42.7203C4.88674 43.4348 3.40117 44.1492 1.91563 44.8637C1.70897 44.9628 1.48389 45.0108 1.28779 44.994C1.0916 44.977 0.940536 44.8975 0.866099 44.7681C0.791689 44.6386 0.798739 44.4674 0.882816 44.289C0.966978 44.111 1.12195 43.9408 1.31146 43.8119C2.68692 42.8791 4.06239 41.9462 5.43785 41.0134C6.96571 39.9774 8.49068 38.9427 10.0185 37.9078L69.6829 39.997Z" fill="#ff6a00"/>
  </svg>
);

export default function TapedFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative py-10 px-4 bg-black overflow-hidden">
      {/* Grain texture overlay */}
      <div 
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />
      <div className="max-w-5xl mx-auto relative z-10">
        {/* Main Footer Card - off-white/cream */}
        <div className="relative bg-orange-50 rounded-2xl px-6 md:px-10 py-10 border border-orange-100/50 shadow-xl">
          {/* Tape decorations */}
          <div className="hidden md:block absolute -top-4 -left-5 opacity-95">
            <OrangeTape />
          </div>
          <div className="hidden md:block absolute -top-4 -right-5 rotate-90 opacity-95">
            <OrangeTape />
          </div>

          {/* Footer Content */}
          <div className="flex flex-col md:flex-row justify-between items-start gap-8">
            {/* Brand Section */}
            <div className="flex flex-col gap-3 max-w-xs">
              <Link to="/" className="flex items-center gap-2">
                <img 
                  src="/myezzlogopage0001removebgpreview2329-xmz0h-400w.png" 
                  alt="MyEzz Logo" 
                  className="h-12 object-contain"
                />
              </Link>
              <p className="text-gray-600 text-sm leading-relaxed">
                Your favorite food, delivered effortlessly. Fast delivery from local vendors and street food near you.
              </p>
            </div>

            {/* Links Section */}
            <div className="flex flex-col md:flex-row gap-8 md:gap-12">
              {/* Quick Links */}
              <div className="flex flex-col gap-3">
                <h4 className="uppercase text-xs font-bold text-gray-400 tracking-wider">Quick Links</h4>
                <div className="flex flex-col gap-2">
                  <a 
                    href="https://myezzofficial.netlify.app/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-gray-600 hover:text-orange-500 text-sm font-medium transition-colors"
                  >
                    About Us
                  </a>
                  <a 
                    href="https://myezzofficial.netlify.app/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-gray-600 hover:text-orange-500 text-sm font-medium transition-colors"
                  >
                    Privacy Policy
                  </a>
                  <a 
                    href="https://myezzofficial.netlify.app/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-gray-600 hover:text-orange-500 text-sm font-medium transition-colors"
                  >
                    Terms of Service
                  </a>
                </div>
              </div>

              {/* Partner */}
              <div className="flex flex-col gap-3">
                <h4 className="uppercase text-xs font-bold text-gray-400 tracking-wider">Partner</h4>
                <div className="flex flex-col gap-2">
                  <a 
                    href="https://my-ezz-restaurants.vercel.app/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-gray-600 hover:text-orange-500 text-sm font-medium transition-colors"
                  >
                    Restaurant Partner
                  </a>
                </div>
              </div>

              {/* Social Links */}
              <div className="flex flex-col gap-3">
                <h4 className="uppercase text-xs font-bold text-gray-400 tracking-wider">Follow Us</h4>
                <div className="flex gap-4 items-center">
                  <a
                    href="https://www.instagram.com/mycravezz/"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="MyEzz Instagram"
                    className="text-gray-500 hover:text-orange-500 transition-colors"
                  >
                    <Instagram className="w-5 h-5" />
                  </a>
                  <a
                    href="https://www.linkedin.com/company/myezz/"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="MyEzz LinkedIn"
                    className="text-gray-500 hover:text-orange-500 transition-colors"
                  >
                    <Linkedin className="w-5 h-5" />
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Copyright */}
          <div className="mt-8 pt-6 border-t border-orange-200/50 text-center">
            <p className="text-gray-500 text-sm">&copy; {currentYear} MyEzz. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}

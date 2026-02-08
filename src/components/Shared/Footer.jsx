import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 py-6 mt-12 border-t border-orange-100 dark:border-gray-700">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center text-sm">
        
        {/* Copyright Notice */}
        <div className="mb-4 sm:mb-0">
          <p>&copy; {new Date().getFullYear()} MyEzz. All Rights Reserved.</p>
        </div>
        
        {/* Footer Links */}
        <div className="flex space-x-6">
          <a 
            href="https://myezzofficial.netlify.app/" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="hover:text-orange-500 dark:hover:text-white hover:underline transition-colors"
          >
            About Us
          </a>
          {/* NOTE: Replace "#" with your actual Privacy Policy page link later */}
          <a href="https://myezzofficial.netlify.app/" className="hover:text-orange-500 dark:hover:text-white hover:underline transition-colors">
            Privacy Policy
          </a>
          {/* NOTE: Replace "#" with your actual Terms of Service page link later */}
          <a href="https://myezzofficial.netlify.app/" className="hover:text-orange-500 dark:hover:text-white hover:underline transition-colors">
            Terms
          </a>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
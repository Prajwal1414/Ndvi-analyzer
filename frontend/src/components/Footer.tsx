import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 text-white py-6 mt-auto">
      <div className="container mx-auto px-4">
        <p className="text-center">&copy; {new Date().getFullYear()} NDVI Analyzer. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
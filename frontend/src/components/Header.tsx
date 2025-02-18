import React from 'react';
import { Link } from 'react-router-dom';

const Header: React.FC = () => {
  return (
    <header className="bg-green-700 text-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold">NDVI Analyzer</Link>
        <nav>
          <ul className="flex space-x-6">
            <li><Link to="/" className="hover:text-green-200 transition">Home</Link></li>
            <li><Link to="/" className="hover:text-green-200 transition">About</Link></li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;

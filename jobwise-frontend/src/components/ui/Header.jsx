import React from 'react';
import './Header.css';

const Header = () => {
  return (
    <header className="header bg-white shadow-md p-4 flex justify-between items-center">
      <h1 className="text-2xl font-bold text-blue-600">Jobwise.ge</h1>
      <nav className="space-x-4">
        <a href="/" className="text-gray-700 hover:text-blue-600">Home</a>
        <a href="/login" className="text-gray-700 hover:text-blue-600">Login</a>
        <a href="/signup" className="text-gray-700 hover:text-blue-600">Signup</a>
      </nav>
    </header>
  );
};

export default Header;

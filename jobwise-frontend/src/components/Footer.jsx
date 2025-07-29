import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <p>© {new Date().getFullYear()} Jobwise.ge | Built with ❤️ in Georgia</p>
    </footer>
  );
};

export default Footer;

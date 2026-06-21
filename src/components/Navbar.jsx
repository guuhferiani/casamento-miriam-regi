import React, { useState, useEffect } from 'react';
import { Menu, X, Home, List, Gift, Mail, Camera } from 'lucide-react';

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: 'Home', href: '#hero', icon: Home },
    { name: 'Detalhes', href: '#local', icon: List },
    { name: 'Álbum', href: '#album', icon: Camera },
    { name: 'Presentes', href: '#presentes', icon: Gift },
    { name: 'Confirmar Presença', href: '#rsvp', icon: Mail },
  ];

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 py-4 bg-transparent md:bg-white/95 md:backdrop-blur-md md:shadow-sm`}>
      <div className="max-w-6xl mx-auto px-4 md:px-8 flex justify-center items-center">
        
        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-12 items-center">
          {navLinks.map((link) => (
            <a 
              key={link.name} 
              href={link.href}
              className="flex items-center space-x-2 text-navy hover:text-blue-accent transition-colors"
            >
              <link.icon className="w-4 h-4 text-blue-accent opacity-80" />
              <span className="font-sans text-sm tracking-wide capitalize">{link.name}</span>
            </a>
          ))}
        </div>

        {/* Mobile Menu Toggle */}
        <div className="md:hidden w-full flex justify-end">
          <button 
            className="text-white md:text-navy focus:outline-none"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={28} className="text-white md:text-navy" /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white/95 backdrop-blur-md shadow-lg border-t border-gray-100 flex flex-col items-center py-6 space-y-6">
          {navLinks.map((link) => (
            <a 
              key={link.name} 
              href={link.href}
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center space-x-3 text-navy hover:text-blue-accent"
            >
              <link.icon className="w-5 h-5 text-blue-accent opacity-80" />
              <span className="font-sans text-lg tracking-wide capitalize">{link.name}</span>
            </a>
          ))}
        </div>
      )}
    </nav>
  );
};

export default Navbar;

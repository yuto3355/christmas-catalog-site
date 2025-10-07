import React from 'react';
import { Link } from 'react-router-dom';

export default function Header() {
  return (
    <header className="bg-christmas-green/80 backdrop-blur-sm shadow-lg sticky top-0 z-50">
      <div className="container mx-auto p-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-white text-shadow-lg">
          🎄 Christmas Catalog
        </Link>
        <nav>
          <Link 
            to="/catalog" 
            className="text-white font-bold tracking-wider border-2 border-transparent rounded-full px-4 py-2 transition-all duration-300 hover:border-christmas-gold hover:text-christmas-gold"
          >
            プレゼント一覧
          </Link>
        </nav>
      </div>
    </header>
  );
}
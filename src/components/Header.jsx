import React from 'react';
import { Link } from 'react-router-dom';

export default function Header() {
  return (
    <header className="bg-christmas-green/80 backdrop-blur-sm shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex flex-col md:flex-row justify-between items-center space-y-2 md:space-y-0">
        <Link 
          to="/" 
          className="font-bold text-white text-shadow-lg text-2xl"
        >
          🎄 Christmas Catalog
        </Link>
        {/* ★★★ ここを修正 ★★★ */}
        <nav className="flex items-center gap-6">
          <Link 
            to="/catalog" 
            className="text-white font-bold tracking-wider border-2 border-transparent rounded-full px-4 py-2 transition-all duration-300 hover:border-christmas-gold hover:text-christmas-gold"
          >
            プレゼント一覧
          </Link>
          <Link 
            to="/admin" 
            className="text-gray-300 text-sm hover:text-white hover:underline"
          >
            管理画面
          </Link>
        </nav>
      </div>
    </header>
  );
}
import React from 'react';
import { Link } from 'react-router-dom';

function App() {
  return (
    <div className="relative text-center text-white">
      <img 
        src="/images/christmas-hero.jpg"
        alt="Christmas background"
        className="w-full h-[60vh] object-cover"
      />
      <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center p-4">
        <h1 className="text-5xl md:text-6xl font-bold text-shadow-lg mb-4">
          🎄 Merry Christmas !! 🎁
        </h1>
        <p className="text-lg md:text-xl max-w-2xl mb-8 text-shadow-lg">
          ようこそ！お好きなプレゼントをおひとつお選びください！
        </p>
        <Link 
          to="/catalog"
          className="bg-christmas-gold text-christmas-green font-bold text-xl px-8 py-3 rounded-full shadow-lg transition-transform duration-300 hover:scale-110"
        >
          カタログを見る
        </Link>
      </div>
    </div>
  )
}

export default App
import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function GiftCard({ gift }) {
  // 画像読み込み失敗時に代替画像を表示する関数
  const handleImageError = (e) => {
    e.target.src = 'https://dummyimage.com/600x400/cccccc/ffffff.png&text=No+Image';
  };

  return (
    <Link to={`/item/${gift.id}`}>
      <motion.div 
        className="rounded-lg overflow-hidden shadow-lg bg-white/10 backdrop-blur-sm transition-shadow duration-300 hover:shadow-2xl border-t-4 border-transparent hover:border-christmas-gold cursor-pointer"
        whileHover={{ y: -8, scale: 1.05 }}
      >
        <div className="w-full h-48 bg-white/20 flex items-center justify-center">
          <img 
            src={gift.imageUrl} 
            alt={gift.title} 
            className="w-full h-full object-contain"
            onError={handleImageError} // 画像読み込み失敗時の処理を追加
          />
        </div>
        {/* ★★★ タイトル表示部分を復活・改善 ★★★ */}
        <div className="p-4 text-white">
          <h3 className="font-bold text-lg truncate h-7">{gift.title}</h3>
        </div>
      </motion.div>
    </Link>
  );
}
import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { db } from '../firebase';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import GiftCard from '../components/GiftCard';
import Swal from 'sweetalert2';

export default function CatalogPage() {
  // --- ステート定義 ---
  const [gifts, setGifts] = useState([]);
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterImage, setFilterImage] = useState('all');

  // --- フック定義 ---
  const [searchParams] = useSearchParams();

  // Firestoreからデータを取得する
  useEffect(() => {
    const categoryFromUrl = searchParams.get('category');
    if (categoryFromUrl) {
      setFilterCategory(categoryFromUrl);
    }

    const q = query(collection(db, "gifts"), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(q, (querySnapshot) => {
      const giftsData = [];
      querySnapshot.forEach((doc) => {
        giftsData.push({ id: doc.id, ...doc.data() });
      });
      setGifts(giftsData);
    });

    return () => unsub();
  }, [searchParams]);

  // 絞り込みロジック
  const displayedGifts = useMemo(() => {
    let filteredGifts = [...gifts];

    // 1. ジャンル(category)で絞り込み
    if (filterCategory !== 'all') {
      filteredGifts = filteredGifts.filter(gift => gift.category === filterCategory);
    }

    // 2. イメージ(image)で絞り込み
    if (filterImage !== 'all') {
      filteredGifts = filteredGifts.filter(gift => gift.image === filterImage);
    }

    return filteredGifts;
  }, [gifts, filterCategory, filterImage]);


  // --- 関数定義 ---
  const handleReset = () => {
    setFilterCategory('all');
    setFilterImage('all');
  };

  const handleRandomSelect = () => {
    if (displayedGifts.length === 0) {
      Swal.fire({
        icon: 'info',
        title: 'おっと！',
        text: '表示されているプレゼントがありません。',
      });
      return;
    }

    const randomIndex = Math.floor(Math.random() * displayedGifts.length);
    const selectedGift = displayedGifts[randomIndex];

    Swal.fire({
      title: 'サンタからのプレゼントはこれ！',
      html: `
        <div class="text-left">
          <img src="${selectedGift.imageUrl}" alt="${selectedGift.title}" class="w-full h-64 object-cover rounded-lg mb-4" />
          <h3 class="text-2xl font-bold">${selectedGift.title}</h3>
          <p class="mt-4">${selectedGift.comment}</p>
        </div>
      `,
      confirmButtonText: '購入ページへ',
      showCancelButton: true,
      cancelButtonText: '閉じる',
    }).then((result) => {
      if (result.isConfirmed) {
        window.open(selectedGift.linkUrl, '_blank');
      }
    });
  };

  // --- レンダリング ---
  return (
    <div className="container mx-auto px-4 md:px-8">
      {/* スクロールしても追従するヘッダー */}
      <div className="sticky top-[72px] bg-christmas-green/80 backdrop-blur-sm z-20 pt-4 pb-8 mb-8">
        <h1 className="text-5xl font-bold text-center mb-8 text-christmas-gold text-shadow-lg">
          🎄 プレゼントカタログ 🎁
        </h1>
      
        <div className="flex flex-wrap items-center justify-center gap-4 p-4 bg-black/20 rounded-lg">
          {/* カテゴリ絞り込み */}
          <select 
            value={filterCategory} 
            onChange={(e) => setFilterCategory(e.target.value)}
            className="p-2 border-2 border-christmas-gold bg-christmas-green text-white rounded-lg shadow-sm cursor-pointer"
          >
            <option value="all">全カテゴリ</option>
            <option value="飲食物">飲食物</option>
            <option value="文房具">文房具</option>
            <option value="日用品">日用品</option>
            <option value="本">本</option>
            <option value="エンタメ">エンタメ</option>
          </select>

          {/* イメージ絞り込み */}
          <select 
            value={filterImage} 
            onChange={(e) => setFilterImage(e.target.value)}
            className="p-2 border-2 border-christmas-gold bg-christmas-green text-white rounded-lg shadow-sm cursor-pointer"
          >
            <option value="all">全イメージ</option>
            <option value="癒し">癒し</option>
            <option value="ユニーク">ユニーク</option>
            <option value="便利">便利</option>
            <option value="おしゃれ">おしゃれ</option>
            <option value="学び">学び</option>
            <option value="ワクワク">ワクワク</option>
          </select>

          {/* リセットボタン */}
          <button 
            onClick={handleReset}
            className="bg-gray-500 text-white font-bold px-4 py-2 rounded-lg shadow-sm hover:bg-gray-600 transition-all duration-300"
          >
            リセット
          </button>

          {/* ランダム表示ボタン */}
          <button 
            onClick={handleRandomSelect}
            className="bg-christmas-red text-white font-bold px-4 py-2 rounded-lg shadow-sm hover:bg-red-700 transition-all duration-300"
          >
            🎁 サンタにおまかせ
          </button>
        </div>
      </div>
      
      {/* プレゼント一覧グリッド */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8">
        {displayedGifts.map((gift) => (
          <GiftCard key={gift.id} gift={gift} />
        ))}
      </div>
    </div>
  );
}
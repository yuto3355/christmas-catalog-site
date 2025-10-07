import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { db } from '../firebase';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import GiftCard from '../components/GiftCard';
import Swal from 'sweetalert2';

export default function CatalogPage() {
  // --- ステート定義 ---
  const [gifts, setGifts] = useState([]);
  const [sortOrder, setSortOrder] = useState('createdAt'); 
  const [filterCategory, setFilterCategory] = useState('all');

  // --- フック定義 ---
  const [searchParams] = useSearchParams();

  // Firestoreからデータを取得する (初回のみ)
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
  }, []);

  // 絞り込みと並び替えのロジック
  const displayedGifts = useMemo(() => {
    let filteredGifts = [...gifts];

    // 1. カテゴリで絞り込み
    if (filterCategory !== 'all') {
      filteredGifts = filteredGifts.filter(gift => gift.category === filterCategory);
    }

    // 2. 並び替え
    switch (sortOrder) {
      case 'price-asc':
        filteredGifts.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        filteredGifts.sort((a, b) => b.price - a.price);
        break;
      case 'createdAt':
      default:
        filteredGifts.sort((a, b) => (b.createdAt?.seconds ?? 0) - (a.createdAt?.seconds ?? 0));
        break;
    }

    return filteredGifts;
  }, [gifts, sortOrder, filterCategory]);


  // --- 関数定義 ---
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
          {/* 並び替え */}
          <select 
            value={sortOrder} 
            onChange={(e) => setSortOrder(e.target.value)}
            className="p-2 border-2 border-christmas-gold bg-christmas-green text-white rounded-lg shadow-sm cursor-pointer"
          >
            <option value="createdAt">新着順</option>
            <option value="price-asc">価格の安い順</option>
            <option value="price-desc">価格の高い順</option>
          </select>

          {/* カテゴリ絞り込み */}
          <select 
            value={filterCategory} 
            onChange={(e) => setFilterCategory(e.target.value)}
            className="p-2 border-2 border-christmas-gold bg-christmas-green text-white rounded-lg shadow-sm cursor-pointer"
          >
            <option value="all">すべてのカテゴリ</option>
            <option value="実用">実用</option>
            <option value="面白い">面白い</option>
            <option value="癒し">癒し</option>
            <option value="食品">食品</option>
            <option value="ガジェット">ガジェット</option>
          </select>

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
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {displayedGifts.map((gift) => (
          <GiftCard key={gift.id} gift={gift} />
        ))}
      </div>
    </div>
  );
}
import React, { useState, useEffect } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import { db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';

export default function Breadcrumbs() {
  const location = useLocation();
  const params = useParams();
  const [giftDetails, setGiftDetails] = useState(null);

  // 詳細ページにいる時だけ、プレゼント情報を取得する
  useEffect(() => {
    if (params.id) {
      const fetchGiftDetails = async () => {
        const docRef = doc(db, "gifts", params.id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setGiftDetails(docSnap.data());
        }
      };
      fetchGiftDetails();
    } else {
      setGiftDetails(null);
    }
  }, [params.id]);

  // パンくずリストの基本形
  let crumbs = [
    <Link key="home" to="/" className="text-gray-200 hover:text-white hover:underline">ホーム</Link>
  ];

  // カタログページの場合
  if (location.pathname.startsWith('/catalog')) {
    crumbs.push(
      <span key="catalog-current" className="text-white">
        {' / '}
        カタログ
      </span>
    );
  // 詳細ページの場合
  } else if (location.pathname.startsWith('/item/') && giftDetails) {
    crumbs.push(
      <span key="catalog-link">
        {' / '}
        <Link to="/catalog" className="text-gray-200 hover:text-white hover:underline">カタログ</Link>
      </span>,
      // ★★★ アイテム名（プレゼント名）を直接表示 ★★★
      <span key="item-title" className="text-white">
        {' / '}
        {giftDetails.title}
      </span>
    );
  }

  return (
    <div className="container mx-auto p-4 bg-white/10 backdrop-blur-sm">
      {crumbs}
    </div>
  );
}
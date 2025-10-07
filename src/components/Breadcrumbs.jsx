import React, { useState, useEffect } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import { db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';

export default function Breadcrumbs() {
  const location = useLocation();
  const params = useParams(); // URLの:idなどを取得
  const [giftDetails, setGiftDetails] = useState(null);

  useEffect(() => {
    // 詳細ページ (例: /item/xxxx) にいる時だけ実行
    if (params.id) {
      const fetchGiftDetails = async () => {
        const docRef = doc(db, "gifts", params.id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setGiftDetails(docSnap.data()); // 取得したデータをステートに保存
        }
      };
      fetchGiftDetails();
    } else {
      setGiftDetails(null); // 詳細ページ以外ではリセット
    }
  }, [params.id]); // URLのidが変わるたびに実行

  // パンくずリストの基本形
  let crumbs = [
    <Link key="home" to="/" className="text-red-500 hover:underline">ホーム</Link>
  ];

  if (location.pathname.startsWith('/catalog')) {
    crumbs.push(
      <span key="catalog" className="text-gray-500">
        {' / '}
        カタログ
      </span>
    );
  } else if (location.pathname.startsWith('/item/') && giftDetails) {
    // 詳細ページ用のパンくずリストを生成
    crumbs.push(
      <span key="catalog-link">
        {' / '}
        <Link to="/catalog" className="text-red-500 hover:underline">カタログ</Link>
      </span>,
      <span key="category-link">
        {' / '}
        {/* カテゴリ名をクリックすると、絞り込まれたカタログページに飛ぶ */}
        <Link to={`/catalog?category=${giftDetails.category}`} className="text-red-500 hover:underline">
          {giftDetails.category}
        </Link>
      </span>,
      <span key="item-title" className="text-gray-500">
        {' / '}
        {giftDetails.title}
      </span>
    );
  }

  return (
    <div className="container mx-auto p-4 bg-gray-50">
      {crumbs}
    </div>
  );
}
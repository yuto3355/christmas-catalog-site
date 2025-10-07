import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import Swal from 'sweetalert2'; // Swalをインポート

export default function ItemDetailPage() {
  const { id } = useParams(); // URLからidを取得
  const [gift, setGift] = useState(null);
  const [loading, setLoading] = useState(true);
  // ★★★ 画像クリック時の関数を追加 ★★★
  const handleImageClick = () => {
    Swal.fire({
      imageUrl: gift.imageUrl,
      imageAlt: gift.title,
      showConfirmButton: false,
      background: 'transparent',
      backdrop: `
        rgba(0,0,0,0.8)
      `
    });
  };

  useEffect(() => {
    const fetchGift = async () => {
      try {
        const docRef = doc(db, "gifts", id); // IDを使ってドキュメントへの参照を作成
        const docSnap = await getDoc(docRef); // ドキュメントを取得

        if (docSnap.exists()) {
          setGift({ id: docSnap.id, ...docSnap.data() });
        } else {
          console.log("No such document!");
        }
      } catch (error) {
        console.error("Error fetching document:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchGift();
  }, [id]); // idが変わった時だけ実行

  if (loading) {
    return <div className="text-center p-10">読み込み中...</div>;
  }

  if (!gift) {
    return <div className="text-center p-10">プレゼントが見つかりませんでした。</div>;
  }

  return (
    <div className="container mx-auto p-8">
      <div className="bg-white/90 backdrop-blur-sm p-8 rounded-lg shadow-xl max-w-2xl mx-auto">
      <div className="w-full h-80 bg-white flex items-center justify-center rounded-lg mb-6">
  <img 
            src={gift.imageUrl} 
            alt={gift.title} 
            className="w-full h-full object-contain rounded-lg cursor-pointer" // cursor-pointerを追加
            onClick={handleImageClick} // ★★★ onClickイベントを追加 ★★★
          />
        </div>
        <h1 className="text-4xl font-bold mb-2">{gift.title}</h1>
        <p className="text-gray-600 mb-6 whitespace-pre-wrap">{gift.comment}</p>
        
        <a 
          href={gift.linkUrl} 
          target="_blank" 
          rel="noopener noreferrer"
          className="inline-block bg-christmas-red text-white font-bold px-6 py-3 rounded-lg shadow-md hover:bg-red-700 transition-colors mr-4"
        >
          購入ページで見る
        </a>

        <Link 
          to="/catalog"
          className="inline-block bg-gray-200 text-gray-800 font-bold px-6 py-3 rounded-lg hover:bg-gray-300 transition-colors"
        >
          カタログに戻る
        </Link>
      </div>
    </div>
  );
}
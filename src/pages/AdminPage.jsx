import React, { useState, useEffect } from 'react'; // ← useEffect を追加
// Firebaseと連携するための関数をインポート
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp, onSnapshot, query, orderBy, deleteDoc, doc } from 'firebase/firestore';
// 通知機能のtoastをインポート
import toast from 'react-hot-toast';

export default function AdminPage() {
  // --- ステート定義 ---
  const [password, setPassword] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [linkUrl, setLinkUrl] = useState('');
  const [category, setCategory] = useState('実用');
  const [comment, setComment] = useState('');
   // ★★★ 取得したプレゼント一覧を保存するステートを追加 ★★★
   const [image, setImage] = useState('かわいい'); // ★★★ イメージ用のステートを追加 ★★★
  const [gifts, setGifts] = useState([]);
  // ★★★ ページ表示時にFirestoreからデータを取得する処理を追加 ★★★
  useEffect(() => {
    // ログインしていない場合は処理を中断
    if (!isLoggedIn) return;

    // 'gifts'コレクションへの参照を作成し、createdAtで降順に並び替え
    const q = query(collection(db, "gifts"), orderBy("createdAt", "desc"));

    // リアルタイムリスナーを設定
    const unsub = onSnapshot(q, (querySnapshot) => {
      const giftsData = [];
      querySnapshot.forEach((doc) => {
        giftsData.push({ id: doc.id, ...doc.data() });
      });
      setGifts(giftsData); // 取得したデータをステートに保存
    });

    // クリーンアップ関数：コンポーネントが不要になったらリスナーを解除
    return () => unsub();
  }, [isLoggedIn]); // isLoggedInが変更されたときにも実行

  // --- 関数定義 ---
  const handleLogin = () => {
    if (password === 'santa2025') {
      setIsLoggedIn(true);
    } else {
      alert('パスワードが違います');
    }
  };

  // ★★★ この handleSubmit 関数の定義が重要です ★★★
  const handleSubmit = async (e) => {
    e.preventDefault(); // フォーム送信時のページリロードを防ぐ

    if (!title || !price || !imageUrl || !linkUrl || !comment) {
      toast.error('すべての項目を入力してください');
      return;
    }

    try {
      await addDoc(collection(db, "gifts"), {
        title: title,
        price: Number(price),
        imageUrl: imageUrl,
        linkUrl: linkUrl,
        category: category,
        comment: comment,
        image: image, // ★★★ imageを追加 ★★★
        createdAt: serverTimestamp()
      });

      toast.success('🎅 登録しました！');

      setTitle('');
      setPrice('');
      setImageUrl('');
      setLinkUrl('');
      setCategory('実用');
      setComment('');

    } catch (error) {
      console.error("Error adding document: ", error);
      toast.error('登録に失敗しました。');
    }
  };
  // ★★★ データを削除する関数を追加 ★★★
  const handleDelete = async (id) => {
    if (window.confirm("本当にこのプレゼントを削除しますか？")) {
      try {
        await deleteDoc(doc(db, "gifts", id));
        toast.success('🎁 削除しました！');
      } catch (error) {
        toast.error('削除に失敗しました。');
        console.error("Error removing document: ", error);
      }
    }
  };

  // --- レンダリング ---
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md">
          <h1 className="text-2xl font-bold mb-4">管理者ログイン</h1>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border p-2 w-full mb-4"
            placeholder="パスワード"
          />
          <button
            onClick={handleLogin}
            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
          >
            ログイン
          </button>
        </div>
      </div>
    );
  }

  // ★★★ ここで handleSubmit を使っています ★★★
  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">🎁 プレゼント管理ページ 🎁</h1>
      
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">新規プレゼント登録</h2>
        <div className="space-y-4">
          <input type="text" placeholder="プレゼント名" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full p-2 border rounded" />
          <input type="number" placeholder="価格（円）" value={price} onChange={(e) => setPrice(e.target.value)} className="w-full p-2 border rounded" />
          <input type="text" placeholder="画像URL" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} className="w-full p-2 border rounded" />
          <input type="text" placeholder="購入ページURL" value={linkUrl} onChange={(e) => setLinkUrl(e.target.value)} className="w-full p-2 border rounded" />
          <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full p-2 border rounded">
            <option value="飲食物">飲食物</option>
            <option value="文房具">文房具</option>
            <option value="日用品">日用品</option>
            <option value="本">本</option>
            <option value="エンタメ">エンタメ</option>
          </select>
          {/* ★★★ イメージ選択用のselectタグを追加 ★★★ */}
      <select value={image} onChange={(e) => setImage(e.target.value)} className="w-full p-2 border rounded">
            <option value="癒し">癒し</option>
            <option value="ユニーク">ユニーク</option>
            <option value="便利">便利</option>
            <option value="おしゃれ">おしゃれ</option>
            <option value="学び">学び</option>
            <option value="ワクワク">ワクワク</option>
      </select>
          <textarea placeholder="コメント・紹介文" value={comment} onChange={(e) => setComment(e.target.value)} className="w-full p-2 border rounded" rows="4"></textarea>
          <button type="submit" className="w-full bg-green-500 text-white p-3 rounded-lg font-bold hover:bg-green-600">
            登録する
          </button>
        </div>
      </form>

       {/* ★★★ 登録済みプレゼント一覧の表示部分を追加 ★★★ */}
      <div className="bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">登録済みプレゼント一覧</h2>
        <div className="space-y-4">
          {gifts.map((gift) => (
            <div key={gift.id} className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <p className="font-bold text-lg">{gift.title}</p>
                <p className="text-gray-600">{gift.price}円 - {gift.category}</p>
              </div>
              <div>
                {/* 編集ボタンは後で実装 */}
                <button 
                  onClick={() => handleDelete(gift.id)}
                  className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600"
                >
                  削除
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
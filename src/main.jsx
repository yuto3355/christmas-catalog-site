import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

// React Routerから必要な機能をインポート
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
// Toasterをインポート（ここを追加）
import { Toaster } from 'react-hot-toast';


// 作成したページコンポーネントをインポート
import AdminPage from './pages/AdminPage.jsx';
import CatalogPage from './pages/CatalogPage.jsx';
import ItemDetailPage from './pages/ItemDetailPage.jsx';
import Layout from './components/Layout.jsx'; // Layoutをインポート

// ページの道案内ルールを定義
const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />, // 親ルートとしてLayoutを設定
    children: [ // 子ルートを設定
      {
        index: true, // path: "/" と同じ意味
        element: <App />,
      },
      {
        path: "catalog",
        element: <CatalogPage />,
      },
      {
        path: "item/:id",
        element: <ItemDetailPage />,
      },
    ]
  },
  {
    // 管理ページはヘッダー・フッターなしの独立したルート
    path: "/admin",
    element: <AdminPage />,
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* RouterProviderを設置して、定義したルールをアプリに適用 */}
    <RouterProvider router={router} />
  </React.StrictMode>,
)
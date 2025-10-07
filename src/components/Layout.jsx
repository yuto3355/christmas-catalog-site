import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import Breadcrumbs from './Breadcrumbs';

export default function Layout() {
  return (
    <div className="bg-christmas-green relative"> {/* relativeを追加 */}
      {/* ★★★ あなたが提案してくれた雪の要素を追加 ★★★ */}
      <div className="snow-container">
        <div className="snow">●</div>
        <div className="snow">●</div>
        <div className="snow">●</div>
        <div className="snow">●</div>
        <div className="snow">●</div>
        <div className="snow">●</div>
        <div className="snow">●</div>
        <div className="snow">●</div>
        <div className="snow">●</div>
        <div className="snow">●</div>
      </div>

      {/* コンテンツ部分は変更なし */}
      <div className="relative z-10 flex flex-col min-h-screen">
        <Header />
        <Breadcrumbs />
        <main className="flex-grow">
          <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  );
}
// src/components/Layout.tsx
import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
  cartCount?: number;
  onCartClick?: () => void; // Новий пропс для переходу в кошик
}

export const Layout: React.FC<LayoutProps> = ({ children, cartCount = 0, onCartClick }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <nav className="glass-nav sticky top-0 z-50 px-4 md:px-8 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            <div className="bg-yellow-400 p-2 rounded-lg shadow-sm shadow-yellow-400/30">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-6 h-6 text-slate-900"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m13 2-2 10h8l-10 10 2-10H3l10-10z" />
              </svg>
            </div>
            <span className="text-xl font-black tracking-tighter">
              VOLT<span className="text-yellow-500">PRO</span>
            </span>
          </div>

          <div className="hidden md:flex items-center gap-10 text-[13px] font-black uppercase tracking-wider text-slate-500">
            <a href="#catalog" className="hover:text-yellow-600 transition">
              Каталог
            </a>
            <a href="#calculator" className="hover:text-yellow-600 transition">
              Калькулятор
            </a>
            <a href="#support" className="hover:text-yellow-600 transition">
              Сервіс
            </a>
          </div>

          <div className="flex items-center gap-4">
            {/* Клікабельна кнопка кошика */}
            <button
              onClick={onCartClick}
              className="relative p-2.5 bg-slate-100 text-slate-900 rounded-xl hover:bg-slate-200 transition-all active:scale-90"
              aria-label={`Перейти до кошика (${cartCount} товарів)`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>

              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[9px] font-black w-5 h-5 flex items-center justify-center rounded-full border-2 border-white animate-in zoom-in">
                  {cartCount}
                </span>
              )}
            </button>

            <button className="hidden sm:block bg-slate-900 text-white px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-slate-800 transition shadow-lg shadow-slate-900/10">
              Кабінет
            </button>
          </div>
        </div>
      </nav>

      <main className="flex-grow">{children}</main>

      {/* Футер без змін */}
      <footer className="bg-slate-950 text-slate-500 py-16 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="col-span-1 md:col-span-2">
            <div className="text-white text-2xl font-black mb-6">
              VOLTSTORE<span className="text-yellow-500"> PRO</span>
            </div>
            <p className="max-w-xs text-sm leading-relaxed mb-6">
              Комплексні рішення для вашої автономності. Власна логістика, сервісний центр та технічна підтримка 24/7.
            </p>
            <div className="flex gap-4">
              <div className="w-8 h-8 bg-white/5 rounded-lg"></div>
              <div className="w-8 h-8 bg-white/5 rounded-lg"></div>
              <div className="w-8 h-8 bg-white/5 rounded-lg"></div>
            </div>
          </div>
          {/* ... решта футера без змін ... */}
        </div>
        <div className="max-w-7xl mx-auto border-t border-white/5 mt-16 pt-8 text-center text-[11px] font-bold uppercase tracking-widest">
          © 2026 VoltStore Pro Ukraine. Робимо енергію доступною.
        </div>
      </footer>
    </div>
  );
};
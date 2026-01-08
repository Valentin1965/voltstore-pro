// src/components/OrderSuccess.tsx
import React from 'react';

interface OrderSuccessProps {
  orderId: string;
  onNewOrder: () => void;
}

export const OrderSuccess: React.FC<OrderSuccessProps> = ({ orderId, onNewOrder }) => {
  return (
    <div className="max-w-2xl mx-auto px-4 py-20 text-center">
      <div className="mb-10">
        <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="text-4xl font-black text-slate-900 mb-4">Дякуємо за замовлення!</h1>
        <p className="text-xl text-slate-600 mb-2">Ваше замовлення успішно оформлено</p>
        <p className="text-2xl font-black text-yellow-500">№ {orderId}</p>
      </div>

      <p className="text-slate-600 mb-10">
        Найближчим часом з вами зв'яжеться менеджер для підтвердження деталей.
      </p>

      <button
        onClick={onNewOrder}
        className="bg-slate-900 text-white px-10 py-5 rounded-2xl font-black uppercase tracking-widest hover:bg-yellow-500 hover:text-slate-900 transition-all shadow-xl"
      >
        Повернутися до каталогу
      </button>
    </div>
  );
};
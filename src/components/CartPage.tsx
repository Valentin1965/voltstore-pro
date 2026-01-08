// src/components/CartPage.tsx
import React from 'react';
import { CartItem } from '../types.ts';

interface CartPageProps {
  cart: CartItem[];
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
  onClearCart: () => void;
  onBackToCatalog: () => void;
  onCheckout: () => void; // Новий пропс для переходу до оформлення
}

export const CartPage: React.FC<CartPageProps> = ({
  cart,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onBackToCatalog,
  onCheckout,
}) => {
  const totalAmount = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  if (cart.length === 0) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-20 text-center">
        <h1 className="text-4xl font-black text-slate-900 mb-8">Кошик порожній</h1>
        <p className="text-xl text-slate-500 mb-10">Додайте товари з каталогу</p>
        <button
          onClick={onBackToCatalog}
          className="bg-slate-900 text-white px-10 py-5 rounded-2xl font-black uppercase tracking-widest hover:bg-yellow-500 hover:text-slate-900 transition-all shadow-xl"
        >
          Повернутися до каталогу
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-4xl font-black text-slate-900 mb-10">Кошик ({totalItems})</h1>

      <div className="space-y-6 mb-12">
        {cart.map((item) => (
          <div
            key={item.product.id}
            className="bg-white rounded-3xl p-6 border border-slate-100 flex flex-col sm:flex-row items-center gap-6 shadow-lg hover:shadow-xl transition-shadow"
          >
            <img
              src={item.product.image}
              alt={item.product.name}
              className="w-32 h-32 object-cover rounded-2xl flex-shrink-0"
            />

            <div className="flex-grow text-center sm:text-left">
              <h3 className="font-black text-lg text-slate-900">{item.product.name}</h3>
              <p className="text-slate-500 text-sm mt-1">
                {item.product.price.toLocaleString()} ₴ за одиницю
              </p>
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={() => onUpdateQuantity(item.product.id, item.quantity - 1)}
                className="w-10 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center font-black text-xl transition"
              >
                −
              </button>
              <span className="font-black text-xl w-12 text-center">{item.quantity}</span>
              <button
                onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
                className="w-10 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center font-black text-xl transition"
              >
                +
              </button>
            </div>

            <div className="text-center sm:text-right">
              <p className="font-black text-xl text-slate-900">
                {(item.product.price * item.quantity).toLocaleString()} ₴
              </p>
            </div>

            <button
              onClick={() => onRemoveItem(item.product.id)}
              className="text-red-500 hover:text-red-700 text-3xl sm:ml-6 transition"
            >
              ✕
            </button>
          </div>
        ))}
      </div>

      <div className="bg-slate-50 rounded-3xl p-8 border border-slate-200">
        <div className="flex justify-between items-center mb-8">
          <span className="text-2xl font-black text-slate-900">Разом до сплати:</span>
          <span className="text-4xl font-black text-slate-900">
            {totalAmount.toLocaleString()} ₴
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <button
            onClick={onClearCart}
            className="bg-white border border-slate-300 text-slate-900 px-6 py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-slate-100 transition"
          >
            Очистити кошик
          </button>

          <button
            onClick={onBackToCatalog}
            className="bg-slate-900 text-white px-6 py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-slate-700 transition"
          >
            Продовжити покупки
          </button>

          {/* Кнопка оформлення замовлення */}
          <button
            onClick={onCheckout}
            className="bg-yellow-500 text-slate-900 px-6 py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-yellow-400 transition shadow-lg"
          >
            Оформити замовлення
          </button>
        </div>
      </div>
    </div>
  );
};
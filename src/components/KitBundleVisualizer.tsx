
import React from 'react';
import { Product } from '../types';

interface KitBundleVisualizerProps {
  product: Product;
}

export const KitBundleVisualizer: React.FC<KitBundleVisualizerProps> = ({ product }) => {
  const hasDiscount = product.originalPrice && product.originalPrice > product.price;
  const savings = hasDiscount ? product.originalPrice! - product.price : 0;
  const discountPercent = hasDiscount ? Math.round((savings / product.originalPrice!) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Схема архітектури */}
      <div className="relative bg-slate-50 rounded-3xl p-6 border border-slate-100 overflow-hidden">
        <div className="absolute top-0 right-0 p-3">
          <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">System Architecture</span>
        </div>
        
        <div className="flex items-center justify-between relative z-10 py-4">
          {/* Інвертор */}
          <div className="flex flex-col items-center gap-2 w-1/3">
            <div className="w-12 h-12 bg-white rounded-2xl shadow-sm border border-slate-200 flex items-center justify-center text-xl animate-pulse">
              🔌
            </div>
            <span className="text-[10px] font-bold text-slate-500 text-center uppercase">Контроль</span>
          </div>

          <div className="h-px flex-grow bg-gradient-to-r from-yellow-400 to-blue-400 relative">
             <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-yellow-500 rounded-full animate-ping"></div>
          </div>

          {/* Батарея */}
          <div className="flex flex-col items-center gap-2 w-1/3">
            <div className="w-12 h-12 bg-white rounded-2xl shadow-sm border border-slate-200 flex items-center justify-center text-xl">
              🔋
            </div>
            <span className="text-[10px] font-bold text-slate-500 text-center uppercase">Резерв</span>
          </div>

          <div className="h-px flex-grow bg-gradient-to-r from-blue-400 to-green-400"></div>

          {/* Дім */}
          <div className="flex flex-col items-center gap-2 w-1/3">
            <div className="w-12 h-12 bg-white rounded-2xl shadow-sm border border-slate-200 flex items-center justify-center text-xl">
              🏠
            </div>
            <span className="text-[10px] font-bold text-slate-500 text-center uppercase">Споживання</span>
          </div>
        </div>
      </div>

      {/* Список компонентів */}
      <div className="space-y-2">
        <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider mb-3">Склад набору:</h4>
        {product.bundleItems?.map((item, idx) => (
          <div key={idx} className="group flex items-center justify-between p-3 bg-white hover:bg-slate-50 border border-slate-100 rounded-2xl transition">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-xs group-hover:bg-yellow-100 transition">
                📦
              </div>
              <span className="text-sm font-medium text-slate-700">{item.name}</span>
            </div>
            <span className="text-xs font-black bg-slate-900 text-white px-2.5 py-1 rounded-lg">x{item.quantity}</span>
          </div>
        ))}
      </div>

      {/* Блок економії */}
      {hasDiscount && (
        <div className="bg-red-50 border border-red-100 rounded-2xl p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-red-500/20">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <div>
              <p className="text-[10px] font-black text-red-600 uppercase tracking-tighter">Спеціальна пропозиція</p>
              <p className="text-sm font-bold text-slate-900">Ваша економія: <span className="text-red-600">{savings.toLocaleString()} грн</span></p>
            </div>
          </div>
          <div className="bg-white px-3 py-1 rounded-full border border-red-200 shadow-sm">
            <span className="text-red-600 font-black text-sm">-{discountPercent}%</span>
          </div>
        </div>
      )}
    </div>
  );
};

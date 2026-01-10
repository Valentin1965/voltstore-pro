// src/components/CatalogSection.tsx
import React from 'react';
import { Product } from '../types.ts';

interface CatalogSectionProps {
  filteredProducts: Product[];
  onSelect: (p: Product) => void;
  onAddToCart: (p: Product) => void;
}

export const CatalogSection = React.memo<CatalogSectionProps>(
  ({ filteredProducts, onSelect, onAddToCart }) => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
      {filteredProducts.length === 0 ? (
        <div className="col-span-full text-center py-20">
          <p className="text-2xl font-black text-slate-500">Товари не знайдено</p>
          <p className="text-slate-400 mt-4">Змініть фільтр або пошук</p>
        </div>
      ) : (
        filteredProducts.map(p => (
          <div
            key={p.id}
            className="bg-white rounded-[40px] p-5 border border-slate-100 flex flex-col cursor-pointer hover:shadow-2xl transition-all group"
            onClick={() => onSelect(p)}
          >
            <div className="relative overflow-hidden rounded-[30px] mb-6 aspect-square bg-slate-100">
              <img
                src={p.image || 'https://via.placeholder.com/400'}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                alt={p.name}
              />
            </div>
            <h3 className="font-bold text-slate-900 text-base mb-4 h-12 line-clamp-2">
              {p.name}
            </h3>
            <div className="mt-auto flex justify-between items-center bg-slate-50 p-3 rounded-2xl">
              <span className="font-black text-lg text-slate-900">
                {p.price != null && p.price > 0 ? p.price.toLocaleString() : 'Ціна за запитом'} ₴
              </span>
              <button
                onClick={e => {
                  e.stopPropagation();
                  onAddToCart(p);
                }}
                className="p-3 bg-white shadow-sm rounded-xl hover:bg-yellow-400 transition-colors"
              >
                🛒
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  )
);
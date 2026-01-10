import React from 'react';
import { Product } from '../types.ts';

interface ProductModalProps {
  product: Product;
  onClose: () => void;
  onAddToCart: (p: Product) => void;
}

export const ProductModal: React.FC<ProductModalProps> = ({ product, onClose, onAddToCart }) => (
  <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
    <div className="bg-white text-slate-900 w-full max-w-5xl rounded-[50px] overflow-hidden flex flex-col md:flex-row max-h-[95vh] shadow-2xl relative">
      <button
        onClick={onClose}
        className="absolute top-6 right-6 z-10 w-10 h-10 bg-white/80 rounded-full flex items-center justify-center font-bold shadow-lg"
      >
        ✕
      </button>

      <div className="w-full md:w-1/2 bg-slate-100">
        <img src={product.image || 'https://via.placeholder.com/400'} className="w-full h-full object-cover" alt={product.name} />
      </div>

      <div className="w-full md:w-1/2 p-12 overflow-y-auto">
        <h2 className="text-3xl font-black mb-6">{product.name}</h2>
        <p className="text-slate-500 mb-8 leading-relaxed">{product.description || 'Опис відсутній'}</p>

        {product.specs && (
          <div className="mb-10 bg-slate-50 rounded-3xl p-6">
            <h3 className="text-xl font-black mb-4">Короткі характеристики</h3>
            <div className="space-y-3">
              {product.specs.split(',').map((spec, i) => {
                const [key, val] = spec.split(':').map(s => s.trim());
                return key && val ? (
                  <div key={i} className="flex justify-between">
                    <span className="text-slate-600">{key}:</span>
                    <span className="font-bold text-slate-900">{val}</span>
                  </div>
                ) : null;
              })}
            </div>
          </div>
        )}

        {product.detailedTechSpecs && (
          <div className="mb-10">
            <h3 className="text-xl font-black mb-4">Повні технічні характеристики</h3>
            <p className="text-sm text-slate-700 whitespace-pre-line leading-relaxed">
              {product.detailedTechSpecs || 'Деталі відсутні'}
            </p>
          </div>
        )}

        {product.datasheet && (
          <a
            href={product.datasheet}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-slate-900 text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-slate-700 transition mb-8"
          >
            Завантажити datasheet (PDF)
          </a>
        )}

        <div className="mt-auto pt-10 border-t flex justify-between items-center gap-6">
          <div>
            <p className="text-[10px] uppercase text-slate-400 font-black mb-1">Вартість</p>
            <span className="text-3xl font-black">
              {product.price != null && product.price > 0 ? product.price.toLocaleString() : 'Ціна за запитом'} ₴
            </span>
          </div>
          <button
            onClick={() => {
              onAddToCart(product);
              onClose();
            }}
            className="bg-slate-900 text-white px-12 py-5 rounded-2xl font-black uppercase hover:bg-yellow-500 hover:text-slate-900 transition-all shadow-xl"
          >
            Додати до кошика
          </button>
        </div>
      </div>
    </div>
  </div>
);
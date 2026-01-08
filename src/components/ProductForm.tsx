// src/components/ProductForm.tsx
import React, { useState } from 'react';
import { Product } from '../types.ts';

interface ProductFormProps {
  product?: Product | null;
  onSave: (product: Product) => void;
  onClose: () => void;
}

export const ProductForm: React.FC<ProductFormProps> = ({ product, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    id: product?.id || '',
    name: product?.name || '',
    category: product?.category || 'inverter',
    subCategory: product?.subCategory || '',
    price: product?.price || 0,
    description: product?.description || '',
    image: product?.image || '',
    specs: product?.specs || '',
    detailedTechSpecs: product?.detailedTechSpecs || '',
    datasheet: product?.datasheet || '',
    stock: product?.stock || 10,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newProduct: Product = {
      ...formData,
      id: formData.id || 'prod_' + Date.now(),
    };
    onSave(newProduct);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4">
      <div className="bg-white rounded-3xl p-8 max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        <h2 className="text-3xl font-black mb-8">
          {product ? 'Редагувати інвертор' : 'Додати інвертор'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          {!product && (
            <input
              type="text"
              placeholder="ID (наприклад prod_123)"
              value={formData.id}
              onChange={e => setFormData(prev => ({ ...prev, id: e.target.value }))}
              className="w-full px-4 py-3 rounded-xl border border-slate-200"
            />
          )}

          <input
            type="text"
            placeholder="Назва моделі"
            value={formData.name}
            onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
            required
            className="w-full px-4 py-3 rounded-xl border"
          />

          <div className="grid md:grid-cols-2 gap-6">
            <select
              value={formData.category}
              onChange={e => setFormData(prev => ({ ...prev, category: e.target.value as Product['category'] }))}
              className="px-4 py-3 rounded-xl border"
            >
              <option value="inverter">Інвертор</option>
              <option value="battery">Акумулятор</option>
              <option value="kit">Комплект</option>
              <option value="solar_panel">Сонячна панель</option>
            </select>

            <input
              type="text"
              placeholder="Підкатегорія"
              value={formData.subCategory}
              onChange={e => setFormData(prev => ({ ...prev, subCategory: e.target.value }))}
              className="px-4 py-3 rounded-xl border"
            />
          </div>

          <input
            type="number"
            placeholder="Ціна (грн)"
            value={formData.price}
            onChange={e => setFormData(prev => ({ ...prev, price: Number(e.target.value) }))}
            required
            className="w-full px-4 py-3 rounded-xl border"
          />

          <textarea
            placeholder="Короткий опис"
            value={formData.description}
            onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
            rows={4}
            required
            className="w-full px-4 py-3 rounded-xl border resize-none"
          />

          <input
            type="url"
            placeholder="Посилання на зображення"
            value={formData.image}
            onChange={e => setFormData(prev => ({ ...prev, image: e.target.value }))}
            required
            className="w-full px-4 py-3 rounded-xl border"
          />

          <textarea
            placeholder="Короткі характеристики (через кому: Топологія: Неізольована, Розмір: 280×310×184 мм)"
            value={formData.specs}
            onChange={e => setFormData(prev => ({ ...prev, specs: e.target.value }))}
            rows={3}
            className="w-full px-4 py-3 rounded-xl border resize-none"
          />

          <textarea
            placeholder="Повні технічні характеристики"
            value={formData.detailedTechSpecs}
            onChange={e => setFormData(prev => ({ ...prev, detailedTechSpecs: e.target.value }))}
            rows={6}
            className="w-full px-4 py-3 rounded-xl border resize-none"
          />

          <input
            type="url"
            placeholder="Посилання на datasheet (PDF)"
            value={formData.datasheet}
            onChange={e => setFormData(prev => ({ ...prev, datasheet: e.target.value }))}
            className="w-full px-4 py-3 rounded-xl border"
          />

          <div className="flex gap-4 pt-6">
            <button
              type="submit"
              className="flex-1 bg-yellow-500 text-slate-900 py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-yellow-400 transition shadow-lg"
            >
              Зберегти
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-white border border-slate-300 text-slate-900 py-4 rounded-2xl font-black uppercase hover:bg-slate-100 transition"
            >
              Скасувати
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
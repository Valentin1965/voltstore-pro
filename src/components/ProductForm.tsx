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

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.id.trim()) newErrors.id = 'Вкажіть ID товару';
    if (!formData.name.trim()) newErrors.name = 'Вкажіть назву';
    if (!formData.category.trim()) newErrors.category = 'Оберіть категорію';
    if (formData.price <= 0) newErrors.price = 'Ціна повинна бути більше 0';
    if (!formData.description.trim()) newErrors.description = 'Додайте опис';
    if (!formData.image.trim()) newErrors.image = 'Вкажіть посилання на зображення';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const newProduct: Product = {
      ...formData,
      id: formData.id.trim(),
      price: Number(formData.price),
    };

    onSave(newProduct);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4">
      <div className="bg-white rounded-3xl p-8 max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        <h2 className="text-3xl font-black mb-8">
          {product ? 'Редагувати товар' : 'Додати товар'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          {!product && (
            <div>
              <label className="block text-sm font-black mb-2">ID товару *</label>
              <input
                type="text"
                value={formData.id}
                onChange={e => setFormData(prev => ({ ...prev, id: e.target.value }))}
                className={`w-full px-4 py-3 rounded-xl border ${errors.id ? 'border-red-500' : 'border-slate-200'}`}
                placeholder="Наприклад: prod_123"
              />
              {errors.id && <p className="text-red-500 text-sm mt-1">{errors.id}</p>}
            </div>
          )}

          <div>
            <label className="block text-sm font-black mb-2">Назва *</label>
            <input
              type="text"
              value={formData.name}
              onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className={`w-full px-4 py-3 rounded-xl border ${errors.name ? 'border-red-500' : 'border-slate-200'}`}
              placeholder="Назва товару"
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-black mb-2">Категорія *</label>
              <select
                value={formData.category}
                onChange={e => setFormData(prev => ({ ...prev, category: e.target.value as Product['category'] }))}
                className={`w-full px-4 py-3 rounded-xl border ${errors.category ? 'border-red-500' : 'border-slate-200'}`}
              >
                <option value="inverter">Інвертор</option>
                <option value="battery">Акумулятор</option>
                <option value="kit">Комплект</option>
                <option value="solar_panel">Сонячна панель</option>
              </select>
              {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category}</p>}
            </div>

            <div>
              <label className="block text-sm font-black mb-2">Підкатегорія</label>
              <input
                type="text"
                value={formData.subCategory}
                onChange={e => setFormData(prev => ({ ...prev, subCategory: e.target.value }))}
                className="w-full px-4 py-3 rounded-xl border border-slate-200"
                placeholder="Наприклад: Однофазні"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-black mb-2">Ціна (грн) *</label>
            <input
              type="number"
              value={formData.price}
              onChange={e => setFormData(prev => ({ ...prev, price: Number(e.target.value) }))}
              className={`w-full px-4 py-3 rounded-xl border ${errors.price ? 'border-red-500' : 'border-slate-200'}`}
              placeholder="19999"
              min="0"
            />
            {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
          </div>

          <div>
            <label className="block text-sm font-black mb-2">Опис *</label>
            <textarea
              value={formData.description}
              onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
              rows={4}
              className={`w-full px-4 py-3 rounded-xl border ${errors.description ? 'border-red-500' : 'border-slate-200'}`}
              placeholder="Детальний опис товару..."
            />
            {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
          </div>

          <div>
            <label className="block text-sm font-black mb-2">Посилання на зображення *</label>
            <input
              type="url"
              value={formData.image}
              onChange={e => setFormData(prev => ({ ...prev, image: e.target.value }))}
              className={`w-full px-4 py-3 rounded-xl border ${errors.image ? 'border-red-500' : 'border-slate-200'}`}
              placeholder="https://example.com/image.jpg"
            />
            {errors.image && <p className="text-red-500 text-sm mt-1">{errors.image}</p>}
          </div>

          <div>
            <label className="block text-sm font-black mb-2">Короткі характеристики (через кому)</label>
            <textarea
              value={formData.specs}
              onChange={e => setFormData(prev => ({ ...prev, specs: e.target.value }))}
              rows={3}
              className="w-full px-4 py-3 rounded-xl border border-slate-200"
              placeholder="Топологія: Неізольована, Розмір: 280×310×184 мм"
            />
          </div>

          <div>
            <label className="block text-sm font-black mb-2">Повні технічні характеристики</label>
            <textarea
              value={formData.detailedTechSpecs}
              onChange={e => setFormData(prev => ({ ...prev, detailedTechSpecs: e.target.value }))}
              rows={6}
              className="w-full px-4 py-3 rounded-xl border border-slate-200"
            />
          </div>

          <div>
            <label className="block text-sm font-black mb-2">Посилання на datasheet (PDF)</label>
            <input
              type="url"
              value={formData.datasheet}
              onChange={e => setFormData(prev => ({ ...prev, datasheet: e.target.value }))}
              className="w-full px-4 py-3 rounded-xl border border-slate-200"
              placeholder="https://example.com/datasheet.pdf"
            />
          </div>

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

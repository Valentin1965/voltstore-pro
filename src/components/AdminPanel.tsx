// src/components/AdminPanel.tsx
import React, { useState } from 'react';
import { Product } from '../types.ts';
import { ProductForm } from './ProductForm.tsx';
import { supabase } from '../services/supabase.ts';

interface AdminPanelProps {
  products: Product[];
  onUpdateProducts: (products: Product[]) => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ products, onUpdateProducts }) => {
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const handleSave = async (savedProduct: Product) => {
    if (editingProduct) {
      // Оновлення існуючого товару в Supabase
      const { error } = await supabase
        .from('products')
        .update(savedProduct)
        .eq('id', savedProduct.id);

      if (error) {
        alert('Помилка оновлення товару');
        console.error(error);
        return;
      }

      // Оновлення локального стану
      const updated = products.map(p => (p.id === savedProduct.id ? savedProduct : p));
      onUpdateProducts(updated);
    } else {
      // Додавання нового товару
      const { error } = await supabase.from('products').insert([savedProduct]);

      if (error) {
        alert('Помилка додавання товару');
        console.error(error);
        return;
      }

      // Оновлення стану (додаємо новий товар)
      onUpdateProducts([...products, savedProduct]);
    }

    setShowForm(false);
    setEditingProduct(null);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Видалити цей товар?')) return;

    const { error } = await supabase.from('products').delete().eq('id', id);

    if (error) {
      alert('Помилка видалення');
      console.error(error);
    } else {
      const updated = products.filter(p => p.id !== id);
      onUpdateProducts(updated);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="bg-white rounded-3xl border border-slate-100 shadow-xl overflow-hidden">
        <div className="p-8 bg-slate-50 border-b flex justify-between items-center">
          <h2 className="text-2xl font-black">Керування товарами ({products.length})</h2>
          <button
            onClick={() => {
              setEditingProduct(null);
              setShowForm(true);
            }}
            className="bg-yellow-500 text-slate-900 px-6 py-3 rounded-xl font-black uppercase tracking-widest hover:bg-yellow-400 transition"
          >
            + Додати товар
          </button>
        </div>

        <div className="p-6 grid gap-4">
          {products.length === 0 ? (
            <p className="text-center text-slate-500 py-10">Товари не знайдено</p>
          ) : (
            products.map(product => (
              <div
                key={product.id}
                className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border hover:bg-slate-100 transition"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                  <div>
                    <div className="font-bold text-lg">{product.name}</div>
                    <div className="text-sm text-slate-600">
                      {product.price ? product.price.toLocaleString() : 'Ціна за запитом'} ₴
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setEditingProduct(product);
                      setShowForm(true);
                    }}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                  >
                    Редагувати
                  </button>
                  <button
                    onClick={() => handleDelete(product.id)}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                  >
                    Видалити
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Модальна форма додавання/редагування */}
      {showForm && (
        <ProductForm
          product={editingProduct}
          onSave={handleSave}
          onClose={() => {
            setShowForm(false);
            setEditingProduct(null);
          }}
        />
      )}
    </div>
  );
};
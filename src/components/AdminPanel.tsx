// src/components/AdminPanel.tsx
import React, { useState, useEffect } from 'react';
import { Product } from '../types.ts';
import { ProductForm } from './ProductForm.tsx';
import { supabase } from '../services/supabase.ts';

interface AdminPanelProps {
  products: Product[];
  onUpdateProducts: (products: Product[]) => void;
}

interface Order {
  id: string;
  order_number: string;
  customer_name: string;
  customer_phone: string;
  customer_email: string;
  city: string;
  delivery_type: string;
  department?: string;
  address?: string;
  comment?: string;
  total_amount: number;
  items: any[]; // jsonb
  status: string;
  created_at: string;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ products, onUpdateProducts }) => {
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  // Завантаження замовлень з Supabase
  useEffect(() => {
    const loadOrders = async () => {
      setLoadingOrders(true);
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Помилка завантаження замовлень:', error);
      } else {
        setOrders(data || []);
      }
      setLoadingOrders(false);
    };

    loadOrders();
  }, []);

  // Збереження товару (оновлення в Supabase)
  const handleSaveProduct = async (savedProduct: Product) => {
    let updatedProducts: Product[];

    if (editingProduct) {
      // Оновлення існуючого
      const { error } = await supabase
        .from('products')
        .update({
          name: savedProduct.name,
          category: savedProduct.category,
          subCategory: savedProduct.subCategory,
          price: savedProduct.price,
          description: savedProduct.description,
          image: savedProduct.image,
          specs: savedProduct.specs,
          detailedTechSpecs: savedProduct.detailedTechSpecs,
          datasheet: savedProduct.datasheet,
          stock: savedProduct.stock,
        })
        .eq('id', savedProduct.id);

      if (error) {
        alert('Помилка оновлення товару');
        console.error(error);
        return;
      }

      updatedProducts = products.map(p =>
        p.id === savedProduct.id ? savedProduct : p
      );
    } else {
      // Додавання нового
      const { error } = await supabase
        .from('products')
        .insert({
          id: savedProduct.id,
          name: savedProduct.name,
          category: savedProduct.category,
          subCategory: savedProduct.subCategory,
          price: savedProduct.price,
          description: savedProduct.description,
          image: savedProduct.image,
          specs: savedProduct.specs,
          detailedTechSpecs: savedProduct.detailedTechSpecs,
          datasheet: savedProduct.datasheet,
          stock: savedProduct.stock,
        });

      if (error) {
        alert('Помилка додавання товару');
        console.error(error);
        return;
      }

      updatedProducts = [...products, savedProduct];
    }

    onUpdateProducts(updatedProducts);
    setShowProductForm(false);
    setEditingProduct(null);
  };

  // Видалення товару
  const handleDeleteProduct = async (id: string) => {
    if (!confirm('Видалити товар?')) return;

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
      {/* Товари */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-xl overflow-hidden mb-10">
        <div className="p-8 bg-slate-50 border-b flex justify-between items-center">
          <h2 className="text-xl font-black">Керування товарами ({products.length})</h2>
          <button
            onClick={() => { setEditingProduct(null); setShowProductForm(true); }}
            className="bg-yellow-500 text-slate-900 px-6 py-3 rounded-xl font-black uppercase tracking-widest hover:bg-yellow-400 transition"
          >
            + Додати товар
          </button>
        </div>
        <div className="p-6 max-h-[500px] overflow-y-auto">
          {products.map(p => (
            <div key={p.id} className="flex items-center justify-between p-4 hover:bg-slate-50 rounded-xl border-b">
              <div className="flex items-center gap-4">
                <img src={p.image} alt={p.name} className="w-12 h-12 object-cover rounded-lg" />
                <div>
                  <div className="font-bold">{p.name}</div>
                  <div className="text-sm text-slate-500">{p.price.toLocaleString()} ₴</div>
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => { setEditingProduct(p); setShowProductForm(true); }} className="text-blue-600 hover:underline">Редагувати</button>
                <button onClick={() => handleDeleteProduct(p.id)} className="text-red-600 hover:underline">Видалити</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Замовлення */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-xl overflow-hidden">
        <div className="p-8 bg-slate-50 border-b">
          <h2 className="text-xl font-black">Замовлення ({orders.length})</h2>
        </div>
        <div className="p-6 max-h-[500px] overflow-y-auto">
          {loadingOrders ? (
            <p className="text-center text-slate-500">Завантаження замовлень...</p>
          ) : orders.length === 0 ? (
            <p className="text-center text-slate-500">Замовлень ще немає</p>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-100">
                  <th className="p-3 font-black">№ Замовлення</th>
                  <th className="p-3 font-black">Клієнт</th>
                  <th className="p-3 font-black">Телефон</th>
                  <th className="p-3 font-black">Місто</th>
                  <th className="p-3 font-black">Сума</th>
                  <th className="p-3 font-black">Статус</th>
                  <th className="p-3 font-black">Дата</th>
                </tr>
              </thead>
              <tbody>
                {orders.map(order => (
                  <tr key={order.id} className="border-b hover:bg-slate-50">
                    <td className="p-3 font-medium">{order.order_number}</td>
                    <td className="p-3">{order.customer_name}</td>
                    <td className="p-3">{order.customer_phone}</td>
                    <td className="p-3">{order.city}</td>
                    <td className="p-3 font-bold">{order.total_amount.toLocaleString()} ₴</td>
                    <td className="p-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        order.status === 'new' ? 'bg-yellow-100 text-yellow-800' :
                        order.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                        order.status === 'shipped' ? 'bg-purple-100 text-purple-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {order.status === 'new' ? 'Нове' :
                         order.status === 'processing' ? 'В обробці' :
                         order.status === 'shipped' ? 'Відправлено' :
                         'Завершено'}
                      </span>
                    </td>
                    <td className="p-3 text-sm text-slate-500">
                      {new Date(order.created_at).toLocaleString('uk-UA')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Модалка форми товару */}
      {showProductForm && (
        <ProductForm
          product={editingProduct}
          onSave={handleSaveProduct}
          onClose={() => {
            setShowProductForm(false);
            setEditingProduct(null);
          }}
        />
      )}
    </div>
  );
};
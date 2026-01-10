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
  department?: string | null;
  address?: string | null;
  comment?: string | null;
  total_amount: number;
  items: Array<{
    product_id: string;
    name: string;
    price: number;
    quantity: number;
    image?: string;
  }>;
  status: 'new' | 'processing' | 'shipped' | 'completed';
  created_at: string;
}

const statusOptions = [
  { value: 'new', label: 'Нове', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'processing', label: 'В обробці', color: 'bg-blue-100 text-blue-800' },
  { value: 'shipped', label: 'Відправлено', color: 'bg-purple-100 text-purple-800' },
  { value: 'completed', label: 'Завершено', color: 'bg-green-100 text-green-800' },
];

export const AdminPanel: React.FC<AdminPanelProps> = ({ products, onUpdateProducts }) => {
  const [activeTab, setActiveTab] = useState<'products' | 'orders'>('orders');
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [searchOrder, setSearchOrder] = useState('');

  useEffect(() => {
    const loadOrders = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Помилка завантаження замовлень:', error);
        alert('Не вдалося завантажити замовлення');
      } else {
        setOrders(data || []);
      }
      setLoading(false);
    };

    if (activeTab === 'orders') {
      loadOrders();
    }
  }, [activeTab]);

  const updateOrderStatus = async (orderId: string, newStatus: Order['status']) => {
    const { error } = await supabase
      .from('orders')
      .update({ status: newStatus })
      .eq('id', orderId);

    if (error) {
      alert('Помилка оновлення статусу');
      console.error(error);
    } else {
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
      if (selectedOrder?.id === orderId) {
        setSelectedOrder(prev => prev ? { ...prev, status: newStatus } : null);
      }
    }
  };

  const handleSaveProduct = async (savedProduct: Product) => {
    if (editingProduct) {
      const { error } = await supabase
        .from('products')
        .update(savedProduct)
        .eq('id', savedProduct.id);

      if (error) {
        alert('Помилка оновлення товару');
        console.error(error);
        return;
      }

      onUpdateProducts(products.map(p => p.id === savedProduct.id ? savedProduct : p));
    } else {
      const { error } = await supabase.from('products').insert([savedProduct]);

      if (error) {
        alert('Помилка додавання товару');
        console.error(error);
        return;
      }

      onUpdateProducts([...products, savedProduct]);
    }

    setShowProductForm(false);
    setEditingProduct(null);
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm('Видалити товар?')) return;

    const { error } = await supabase.from('products').delete().eq('id', id);

    if (error) {
      alert('Помилка видалення');
      console.error(error);
    } else {
      onUpdateProducts(products.filter(p => p.id !== id));
    }
  };

  const filteredOrders = orders.filter(o =>
    o.order_number.toLowerCase().includes(searchOrder.toLowerCase()) ||
    o.customer_name.toLowerCase().includes(searchOrder.toLowerCase()) ||
    o.customer_phone.includes(searchOrder)
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="text-4xl font-black text-slate-900 mb-8">Адмін-панель</h1>

      <div className="flex gap-4 mb-8">
        <button
          onClick={() => setActiveTab('products')}
          className={`px-8 py-4 rounded-2xl font-black uppercase tracking-widest transition-all ${
            activeTab === 'products' ? 'bg-slate-900 text-white' : 'bg-white text-slate-900 border border-slate-200'
          }`}
        >
          Товари ({products.length})
        </button>
        <button
          onClick={() => setActiveTab('orders')}
          className={`px-8 py-4 rounded-2xl font-black uppercase tracking-widest transition-all ${
            activeTab === 'orders' ? 'bg-slate-900 text-white' : 'bg-white text-slate-900 border border-slate-200'
          }`}
        >
          Замовлення ({orders.length})
        </button>
      </div>

      {activeTab === 'products' ? (
        <div className="bg-white rounded-3xl border border-slate-100 shadow-xl overflow-hidden">
          <div className="p-8 bg-slate-50 border-b flex justify-between items-center">
            <h2 className="text-2xl font-black">Керування товарами</h2>
            <button
              onClick={() => {
                setEditingProduct(null);
                setShowProductForm(true);
              }}
              className="bg-yellow-500 text-slate-900 px-6 py-3 rounded-xl font-black uppercase tracking-widest hover:bg-yellow-400 transition"
            >
              + Додати товар
            </button>
          </div>
          <div className="p-6 grid gap-4 max-h-[600px] overflow-y-auto">
            {products.map(product => (
              <div key={product.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border hover:bg-slate-100 transition">
                <div className="flex items-center gap-4">
                  <img src={product.image} alt={product.name} className="w-16 h-16 object-cover rounded-lg" />
                  <div>
                    <div className="font-bold text-lg">{product.name}</div>
                    <div className="text-sm text-slate-600">
                      {product.price != null && product.price > 0 ? product.price.toLocaleString() : 'Ціна за запитом'} ₴
                    </div>
                  </div>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setEditingProduct(product);
                      setShowProductForm(true);
                    }}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                  >
                    Редагувати
                  </button>
                  <button
                    onClick={() => handleDeleteProduct(product.id)}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                  >
                    Видалити
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-100 shadow-xl overflow-hidden">
          <div className="p-8 bg-slate-50 border-b">
            <h2 className="text-2xl font-black">Замовлення</h2>
            <input
              type="text"
              placeholder="Пошук за номером, клієнтом або телефоном..."
              value={searchOrder}
              onChange={e => setSearchOrder(e.target.value)}
              className="mt-4 w-full max-w-md px-4 py-3 rounded-xl border border-slate-200"
            />
          </div>
          <div className="p-6 max-h-[600px] overflow-y-auto">
            {loading ? (
              <p className="text-center py-10 text-slate-500">Завантаження замовлень...</p>
            ) : filteredOrders.length === 0 ? (
              <p className="text-center py-10 text-slate-500">Замовлень не знайдено</p>
            ) : (
              <table className="w-full text-left">
                <thead className="bg-slate-100">
                  <tr>
                    <th className="p-4 font-black">№ Замовлення</th>
                    <th className="p-4 font-black">Клієнт</th>
                    <th className="p-4 font-black">Телефон</th>
                    <th className="p-4 font-black">Сума</th>
                    <th className="p-4 font-black">Статус</th>
                    <th className="p-4 font-black">Дата</th>
                    <th className="p-4 font-black">Деталі</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map(order => (
                    <tr key={order.id} className="border-b hover:bg-slate-50">
                      <td className="p-4 font-medium">{order.order_number}</td>
                      <td className="p-4">{order.customer_name}</td>
                      <td className="p-4">{order.customer_phone}</td>
                      <td className="p-4 font-bold">{order.total_amount.toLocaleString()} ₴</td>
                      <td className="p-4">
                        <select
                          value={order.status}
                          onChange={e => updateOrderStatus(order.id, e.target.value as Order['status'])}
                          className="px-4 py-2 rounded-lg border border-slate-300 bg-white"
                        >
                          {statusOptions.map(opt => (
                            <option key={opt.value} value={opt.value}>
                              {opt.label}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="p-4 text-sm text-slate-500">
                        {new Date(order.created_at).toLocaleString('uk-UA')}
                      </td>
                      <td className="p-4">
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="text-blue-600 hover:underline font-medium"
                        >
                          Переглянути
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}

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

      {/* Модалка деталів замовлення */}
      {selectedOrder && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="bg-white rounded-3xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative">
            <button
              onClick={() => setSelectedOrder(null)}
              className="absolute top-6 right-6 w-10 h-10 bg-white/80 rounded-full flex items-center justify-center font-bold shadow-lg"
            >
              ✕
            </button>

            <h2 className="text-3xl font-black mb-6">Замовлення {selectedOrder.order_number}</h2>

            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <div>
                <h3 className="text-xl font-black mb-4">Дані клієнта</h3>
                <p><strong>ПІБ:</strong> {selectedOrder.customer_name}</p>
                <p><strong>Телефон:</strong> {selectedOrder.customer_phone}</p>
                <p><strong>Email:</strong> {selectedOrder.customer_email}</p>
                <p><strong>Місто:</strong> {selectedOrder.city}</p>
                <p><strong>Доставка:</strong> {selectedOrder.delivery_type === 'nova-poshta' ? 'Нова Пошта' : 'Кур\'єр'}</p>
                {selectedOrder.delivery_type === 'nova-poshta' && selectedOrder.department && (
                  <p><strong>Відділення:</strong> {selectedOrder.department}</p>
                )}
                {selectedOrder.delivery_type === 'address' && selectedOrder.address && (
                  <p><strong>Адреса:</strong> {selectedOrder.address}</p>
                )}
                {selectedOrder.comment && (
                  <p className="mt-4"><strong>Коментар:</strong> {selectedOrder.comment}</p>
                )}
              </div>

              <div>
                <h3 className="text-xl font-black mb-4">Статус та дата</h3>
                <p><strong>Статус:</strong>
                  <select
                    value={selectedOrder.status}
                    onChange={e => updateOrderStatus(selectedOrder.id, e.target.value as Order['status'])}
                    className="ml-3 px-4 py-2 rounded-lg border border-slate-300 bg-white"
                  >
                    {statusOptions.map(opt => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </p>
                <p><strong>Дата замовлення:</strong> {new Date(selectedOrder.created_at).toLocaleString('uk-UA')}</p>
              </div>
            </div>

            <h3 className="text-xl font-black mb-4">Товари в замовленні</h3>
            <div className="space-y-4 mb-6">
              {selectedOrder.items.map((item, i) => (
                <div key={i} className="flex gap-4 p-4 bg-slate-50 rounded-xl">
                  {item.image && (
                    <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded-lg" />
                  )}
                  <div className="flex-grow">
                    <p className="font-bold">{item.name}</p>
                    <p className="text-sm text-slate-600">
                      {item.price.toLocaleString()} ₴ × {item.quantity} шт.
                    </p>
                    <p className="font-bold mt-2">
                      {(item.price * item.quantity).toLocaleString()} ₴
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t pt-6 flex justify-end">
              <p className="text-2xl font-black">Разом: {selectedOrder.total_amount.toLocaleString()} ₴</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
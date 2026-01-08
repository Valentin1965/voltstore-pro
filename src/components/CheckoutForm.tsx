// src/components/CheckoutForm.tsx
import React, { useState } from 'react';
import { CartItem } from '../types.ts';
import { supabase } from '../services/supabase.ts'; // Підключення Supabase

interface CheckoutFormProps {
  cart: CartItem[];
  totalAmount: number;
  onBackToCart: () => void;
  onOrderSuccess: (orderId: string) => void;
}

export const CheckoutForm: React.FC<CheckoutFormProps> = ({ cart, totalAmount, onBackToCart, onOrderSuccess }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    city: '',
    deliveryType: 'nova-poshta' as 'nova-poshta' | 'address',
    department: '',
    address: '',
    comment: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.fullName.trim()) newErrors.fullName = "Вкажіть ПІБ";
    if (!formData.phone.trim()) newErrors.phone = "Вкажіть телефон";
    if (!formData.email.trim()) newErrors.email = "Вкажіть email";
    if (!formData.city.trim()) newErrors.city = "Вкажіть місто";
    if (formData.deliveryType === 'nova-poshta' && !formData.department.trim()) {
      newErrors.department = "Вкажіть відділення";
    }
    if (formData.deliveryType === 'address' && !formData.address.trim()) {
      newErrors.address = "Вкажіть адресу";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);

    const orderNumber = 'ORD-' + Date.now().toString().slice(-6);

    const { error } = await supabase.from('orders').insert({
      order_number: orderNumber,
      customer_name: formData.fullName.trim(),
      customer_phone: formData.phone.trim(),
      customer_email: formData.email.trim(),
      city: formData.city.trim(),
      delivery_type: formData.deliveryType,
      department: formData.deliveryType === 'nova-poshta' ? formData.department.trim() : null,
      address: formData.deliveryType === 'address' ? formData.address.trim() : null,
      comment: formData.comment.trim() || null,
      total_amount: totalAmount,
      items: cart.map(item => ({
        product_id: item.product.id,
        name: item.product.name,
        price: item.product.price,
        quantity: item.quantity,
        image: item.product.image,
      })),
      status: 'new',
    });

    if (error) {
      console.error('Помилка збереження замовлення в Supabase:', error);
      alert('Помилка відправки замовлення. Перевірте консоль або спробуйте пізніше.');
    } else {
      onOrderSuccess(orderNumber);
    }

    setIsSubmitting(false);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-4xl font-black text-slate-900 mb-10 text-center">Оформлення замовлення</h1>

      <div className="grid lg:grid-cols-3 gap-10">
        {/* Ліва частина — форма */}
        <div className="lg:col-span-2">
          <h2 className="text-2xl font-black mb-6">Ваші дані та доставка</h2>
          <form onSubmit={handleSubmit} className="space-y-6 bg-white rounded-3xl p-8 shadow-lg border border-slate-100">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-black mb-2">ПІБ *</label>
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={e => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
                  className={`w-full px-4 py-3 rounded-xl border ${errors.fullName ? 'border-red-500' : 'border-slate-200'} focus:border-yellow-500 outline-none`}
                  placeholder="Іванов Іван Іванович"
                />
                {errors.fullName && <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>}
              </div>

              <div>
                <label className="block text-sm font-black mb-2">Телефон *</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={e => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  className={`w-full px-4 py-3 rounded-xl border ${errors.phone ? 'border-red-500' : 'border-slate-200'}`}
                  placeholder="+380"
                />
                {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
              </div>
            </div>

            <div>
              <label className="block text-sm font-black mb-2">Email *</label>
              <input
                type="email"
                value={formData.email}
                onChange={e => setFormData(prev => ({ ...prev, email: e.target.value }))}
                className={`w-full px-4 py-3 rounded-xl border ${errors.email ? 'border-red-500' : 'border-slate-200'}`}
                placeholder="ivan@example.com"
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-sm font-black mb-2">Місто *</label>
              <input
                type="text"
                value={formData.city}
                onChange={e => setFormData(prev => ({ ...prev, city: e.target.value }))}
                className={`w-full px-4 py-3 rounded-xl border ${errors.city ? 'border-red-500' : 'border-slate-200'}`}
                placeholder="Київ"
              />
              {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
            </div>

            <div>
              <label className="block text-sm font-black mb-2">Спосіб доставки</label>
              <select
                value={formData.deliveryType}
                onChange={e => setFormData(prev => ({ ...prev, deliveryType: e.target.value as 'nova-poshta' | 'address' }))}
                className="w-full px-4 py-3 rounded-xl border border-slate-200"
              >
                <option value="nova-poshta">Нова Пошта (відділення)</option>
                <option value="address">Кур'єр на адресу</option>
              </select>
            </div>

            {formData.deliveryType === 'nova-poshta' ? (
              <div>
                <label className="block text-sm font-black mb-2">Відділення Нової Пошти *</label>
                <input
                  type="text"
                  value={formData.department}
                  onChange={e => setFormData(prev => ({ ...prev, department: e.target.value }))}
                  className={`w-full px-4 py-3 rounded-xl border ${errors.department ? 'border-red-500' : 'border-slate-200'}`}
                  placeholder="№12, вул. Шевченка"
                />
                {errors.department && <p className="text-red-500 text-sm mt-1">{errors.department}</p>}
              </div>
            ) : (
              <div>
                <label className="block text-sm font-black mb-2">Адреса доставки *</label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={e => setFormData(prev => ({ ...prev, address: e.target.value }))}
                  className={`w-full px-4 py-3 rounded-xl border ${errors.address ? 'border-red-500' : 'border-slate-200'}`}
                  placeholder="вул. Незалежності 5, кв. 10"
                />
                {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
              </div>
            )}

            <div>
              <label className="block text-sm font-black mb-2">Коментар до замовлення (необов'язково)</label>
              <textarea
                value={formData.comment}
                onChange={e => setFormData(prev => ({ ...prev, comment: e.target.value }))}
                rows={4}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 resize-none"
                placeholder="Наприклад: передзвонити після 18:00"
              />
            </div>

            <div className="flex gap-4 pt-6">
              <button
                type="button"
                onClick={onBackToCart}
                className="flex-1 bg-white border border-slate-300 text-slate-900 py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-slate-100 transition"
              >
                Назад до кошика
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 bg-yellow-500 text-slate-900 py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-yellow-400 transition shadow-lg disabled:opacity-70"
              >
                {isSubmitting ? 'Відправляємо...' : 'Оформити замовлення'}
              </button>
            </div>
          </form>
        </div>

        {/* Права частина — підсумок замовлення */}
        <div className="lg:col-span-1">
          <h2 className="text-2xl font-black mb-6">Ваше замовлення</h2>
          <div className="bg-slate-50 rounded-3xl p-6 space-y-6 border border-slate-200">
            {cart.map(item => (
              <div key={item.product.id} className="flex gap-4 pb-6 border-b border-slate-200 last:border-0 last:pb-0">
                <img
                  src={item.product.image}
                  alt={item.product.name}
                  className="w-20 h-20 object-cover rounded-2xl flex-shrink-0"
                />
                <div className="flex-grow">
                  <h4 className="font-bold text-slate-900">{item.product.name}</h4>
                  <p className="text-sm text-slate-500 mt-1">
                    {item.product.price.toLocaleString()} ₴ × {item.quantity} шт.
                  </p>
                  <p className="font-black text-lg text-slate-900 mt-2">
                    {(item.product.price * item.quantity).toLocaleString()} ₴
                  </p>
                </div>
              </div>
            ))}

            <div className="pt-6 border-t-2 border-slate-300">
              <div className="flex justify-between text-2xl font-black text-slate-900">
                <span>Разом:</span>
                <span>{totalAmount.toLocaleString()} ₴</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
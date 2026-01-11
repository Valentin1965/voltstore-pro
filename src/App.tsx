// src/App.tsx
import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout.tsx';
import { Calculator } from './components/Calculator.tsx';
import { AdminPanel } from './components/AdminPanel.tsx';
import { CartPage } from './components/CartPage.tsx';
import { CheckoutForm } from './components/CheckoutForm.tsx';
import { OrderSuccess } from './components/OrderSuccess.tsx';
import { ProductModal } from './components/ProductModal.tsx';
import { CatalogSection } from './components/CatalogSection.tsx';
import { MOCK_PRODUCTS, CATEGORIES } from './constants.tsx';
import { UserRole, Product, CartItem } from './types.ts';
import { useAuth } from './services/auth.tsx';
import { supabase } from './services/supabase.ts';
import { useCart } from './hooks/useCart.ts';
import { useProductFilters } from './hooks/useProductFilters.ts';

const App: React.FC = () => {
  const { user, login, logout, isAdmin } = useAuth();

  const [products, setProducts] = useState<Product[]>([]);
  const [view, setView] = useState<'catalog' | 'admin' | 'cart' | 'checkout' | 'orderSuccess'>('catalog');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [currentOrderId, setCurrentOrderId] = useState<string>('');

  const { cart, addToCart, updateQuantity, removeFromCart, clearCart, totalItems, totalAmount } = useCart();
  const { activeCategory, setActiveCategory, searchQuery, setSearchQuery, filteredProducts } = useProductFilters(products);

  // Завантаження товарів
  useEffect(() => {
    const load = async () => {
      try {
        const { data, error } = await supabase.from('products').select('*');
        if (error) throw error;
        if (data?.length) {
          setProducts(data);
          console.log(`Supabase: ${data.length} товарів`);
          return;
        }
      } catch (e) {
        console.warn('Supabase error:', e);
      }

      try {
        const res = await fetch('/products.csv');
        if (res.ok) {
          const text = await res.text();
          const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
          if (lines.length > 1) {
            const h = lines[0].split(',').map(s => s.trim().replace(/^"|"$/g, ''));
            const items = lines.slice(1).map(l => {
              const v = l.split(',').map(s => s.trim().replace(/^"|"$/g, ''));
              return {
                id: v[h.indexOf('id')] || `csv_${Date.now()}`,
                name: v[h.indexOf('name')] || 'Без назви',
                category: v[h.indexOf('category')] as Product['category'] || 'inverter',
                subCategory: v[h.indexOf('subCategory')] || undefined,
                price: Number(v[h.indexOf('price')]) || null,
                description: v[h.indexOf('description')] || '',
                image: v[h.indexOf('image')] || 'https://via.placeholder.com/400',
                specs: v[h.indexOf('specs')] || undefined,
                detailedTechSpecs: v[h.indexOf('detailedTechSpecs')] || undefined,
                datasheet: v[h.indexOf('datasheet')] || undefined,
                stock: 10,
              } as Product;
            });
            setProducts(items);
            console.log(`CSV: ${items.length} товарів`);
            return;
          }
        }
      } catch (e) {
        console.warn('CSV error:', e);
      }

      setProducts(MOCK_PRODUCTS);
      console.log('MOCK');
    };

    load();
  }, []);

  if (!products.length) return <div className="min-h-screen flex items-center justify-center text-slate-500">Завантаження...</div>;

  return (
    <Layout cartCount={totalItems} onCartClick={() => setView('cart')}>
      <div
        className="bg-slate-900 text-white py-2 text-[10px] font-black uppercase text-center cursor-pointer"
        onClick={() => (user ? logout() : login('admin@voltstore.pro', UserRole.ADMIN))}
      >
        {user ? `ПРИВІТ, ${user.name.toUpperCase()} • ВИЙТИ` : 'ВХІД ДЛЯ ПАРТНЕРІВ'}
      </div>

      {isAdmin && (
        <div className="max-w-7xl mx-auto px-4 mt-6 flex gap-2 justify-center">
          <button
            onClick={() => setView('catalog')}
            className={`px-6 py-3 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${
              view === 'catalog' ? 'bg-slate-900 text-white' : 'bg-white text-slate-900 border'
            }`}
          >
            Магазин
          </button>
          <button
            onClick={() => setView('admin')}
            className={`px-6 py-3 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${
              view === 'admin' ? 'bg-yellow-500 text-slate-900' : 'bg-white text-slate-900 border'
            }`}
          >
            Адмін-панель
          </button>
        </div>
      )}

      {view === 'orderSuccess' ? (
        <OrderSuccess orderId={currentOrderId} onNewOrder={() => { clearCart(); setView('catalog'); }} />
      ) : view === 'checkout' ? (
        <CheckoutForm
          cart={cart}
          totalAmount={totalAmount}
          onBackToCart={() => setView('cart')}
          onOrderSuccess={id => { setCurrentOrderId(id); setView('orderSuccess'); }}
        />
      ) : view === 'admin' && isAdmin ? (
        <div className="max-w-7xl mx-auto px-4 py-10">
          <AdminPanel products={products} onUpdateProducts={setProducts} />
        </div>
      ) : view === 'cart' ? (
        <CartPage
          cart={cart}
          onUpdateQuantity={updateQuantity}
          onRemoveItem={removeFromCart}
          onClearCart={clearCart}
          onBackToCatalog={() => setView('catalog')}
          onCheckout={() => setView('checkout')}
        />
      ) : (
        <div className="max-w-7xl mx-auto px-4 py-10 text-slate-900">
          <div id="calculator" className="mb-16">
            <Calculator />
          </div>

          <div className="max-w-xl mx-auto mb-12">
            <input
              type="text"
              placeholder="Пошук за назвою або моделлю..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full px-6 py-4 rounded-2xl border border-slate-200 focus:border-yellow-500 focus:outline-none text-base shadow-sm"
            />
          </div>

          <div className="flex flex-wrap gap-3 mb-12 justify-center">
            {CATEGORIES.map(cat => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-6 py-3 rounded-2xl text-xs font-black transition-all flex items-center gap-2 ${
                  activeCategory === cat.id ? 'bg-slate-900 text-white shadow-xl scale-105' : 'bg-white text-slate-400 border border-slate-100'
                }`}
              >
                {cat.icon} {cat.name}
              </button>
            ))}
          </div>

          <CatalogSection filteredProducts={filteredProducts} onSelect={setSelectedProduct} onAddToCart={addToCart} />
        </div>
      )}

      {selectedProduct && (
        <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} onAddToCart={addToCart} />
      )}
    </Layout>
  );
};

export default App;
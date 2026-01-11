// src/App.tsx
import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout.tsx';
import { Calculator } from './components/Calculator.tsx';
import { AdminPanel } from './components/AdminPanel.tsx';
import { CartPage } from './components/CartPage.tsx';
import { CheckoutForm } from './components/CheckoutForm.tsx';
import { OrderSuccess } from './components/OrderSuccess.tsx';
import { MOCK_PRODUCTS, CATEGORIES } from './constants.tsx';
import { UserRole, Product, CartItem } from './types.ts';
import { useAuth } from './services/auth.tsx';
import { supabase } from './services/supabase.ts';

const App: React.FC = () => {
  const { user, login, logout, isAdmin } = useAuth();

  const [products, setProducts] = useState<Product[]>([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const [view, setView] = useState<'catalog' | 'admin' | 'cart' | 'checkout' | 'orderSuccess'>('catalog');
  const [searchQuery, setSearchQuery] = useState('');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [currentOrderId, setCurrentOrderId] = useState<string>('');
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  // Кошик
  useEffect(() => {
    const saved = localStorage.getItem('voltstore_cart');
    if (saved) setCart(JSON.parse(saved) || []);
  }, []);

  useEffect(() => {
    localStorage.setItem('voltstore_cart', JSON.stringify(cart));
  }, [cart]);

  // Завантаження товарів
  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await supabase.from('products').select('*');
        if (data?.length) {
          setProducts(data);
          console.log(`Supabase: ${data.length} товарів`);
          setIsDataLoaded(true);
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
              };
            });
            setProducts(items);
            console.log(`CSV: ${items.length} товарів`);
            setIsDataLoaded(true);
            return;
          }
        }
      } catch (e) {
        console.warn('CSV error:', e);
      }

      setProducts(MOCK_PRODUCTS);
      console.log('MOCK');
      setIsDataLoaded(true);
    };

    load();
  }, []);

  // Безпечний фільтр
  const filteredProducts = useMemo(() => {
    const lower = searchQuery.toLowerCase();

    return products.filter(p => {
      const catMatch = activeCategory === 'all' || p.category === activeCategory;
      const nameMatch = p.name?.toLowerCase().includes(lower) ?? false;
      const subMatch = p.subCategory?.toLowerCase().includes(lower) ?? false;
      return catMatch && (searchQuery === '' || nameMatch || subMatch);
    });
  }, [products, activeCategory, searchQuery]);

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      return existing
        ? prev.map(item =>
            item.product.id === product.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          )
        : [...prev, { product, quantity: 1 }];
  };

  const updateQuantity = (productId: string, quantity: number) => {
    setCart(prev =>
      quantity <= 0
        ? prev.filter(item => item.product.id !== productId)
        : prev.map(item =>
            item.product.id === productId ? { ...item, quantity } : item
          )
    );
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
  };

  const clearCart = () => setCart([]);

  const cartTotalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotalAmount = cart.reduce((sum, item) => sum + (item.product.price ?? 0) * item.quantity, 0);

  if (!isDataLoaded) return <div className="min-h-screen flex items-center justify-center text-slate-500">Завантаження...</div>;

  return (
    <Layout cartCount={cartTotalItems} onCartClick={() => setView('cart')}>
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

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredProducts.length === 0 ? (
              <div className="col-span-full text-center py-20">
                <p className="text-2xl font-black text-slate-500">Товари не знайдено</p>
                <p className="text-slate-400 mt-4">Спробуйте змінити категорію або пошук</p>
              </div>
            ) : (
              filteredProducts.map(product => (
                <div
                  key={product.id}
                  className="bg-white rounded-[40px] p-5 border border-slate-100 flex flex-col cursor-pointer hover:shadow-2xl transition-all group"
                  onClick={() => setSelectedProduct(product)}
                >
                  <div className="relative overflow-hidden rounded-[30px] mb-6 aspect-square bg-slate-100">
                    <img
                      src={product.image || 'https://via.placeholder.com/400'}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      alt={product.name}
                    />
                  </div>
                  <h3 className="font-bold text-slate-900 text-base mb-4 h-12 line-clamp-2">
                    {product.name}
                  </h3>
                  <div className="mt-auto flex justify-between items-center bg-slate-50 p-3 rounded-2xl">
                    <span className="font-black text-lg text-slate-900">
                      {product.price ?? 'Ціна за запитом'} ₴
                    </span>
                    <button
                      onClick={e => {
                        e.stopPropagation();
                        addToCart(product);
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
        </div>
      )}

      {selectedProduct && (
        <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} onAddToCart={addToCart} />
      )}
    </Layout>
  );
};

export default App;
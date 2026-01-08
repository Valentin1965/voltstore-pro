// src/App.tsx
import React, { useState, useMemo, useEffect } from 'react';
import { Layout } from './components/Layout.tsx';
import { Calculator } from './components/Calculator.tsx';
import { KitBundleVisualizer } from './components/KitBundleVisualizer.tsx';
import { AdminPanel } from './components/AdminPanel.tsx';
import { CartPage } from './components/CartPage.tsx';
import { CheckoutForm } from './components/CheckoutForm.tsx';
import { OrderSuccess } from './components/OrderSuccess.tsx';
import { MOCK_PRODUCTS, CATEGORIES } from './constants.tsx';
import { UserRole, Product, CartItem } from './types.ts';
import { useAuth } from './services/auth.tsx';

const App: React.FC = () => {
  const { user, login, logout, isAdmin } = useAuth();

  const [products, setProducts] = useState<Product[]>(MOCK_PRODUCTS);
  const [activeCategory, setActiveCategory] = useState('all');
  const [view, setView] = useState<'catalog' | 'admin' | 'cart' | 'checkout' | 'orderSuccess'>('catalog');
  const [searchQuery, setSearchQuery] = useState('');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null); // Змінив з selectedKit на selectedProduct
  const [currentOrderId, setCurrentOrderId] = useState<string>('');
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  // Завантаження з localStorage (для тестування без Supabase)
  useEffect(() => {
    const savedCart = localStorage.getItem('voltstore_cart');
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (e) {
        console.warn('Помилка завантаження кошика');
      }
    }

    const savedProducts = localStorage.getItem('voltstore_products');
    if (savedProducts) {
      try {
        setProducts(JSON.parse(savedProducts));
      } catch (e) {
        console.warn('Помилка завантаження товарів');
      }
    }
  }, []);

  // Збереження в localStorage
  useEffect(() => {
    localStorage.setItem('voltstore_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('voltstore_products', JSON.stringify(products));
  }, [products]);

  // Завантаження CSV (якщо потрібно — залиш на майбутнє для Supabase)
  useEffect(() => {
    setIsDataLoaded(true); // Для локального режиму — одразу готово
  }, []);

  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchesCategory = activeCategory === 'all' || p.category === activeCategory;
      const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            p.subCategory?.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [products, activeCategory, searchQuery]);

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  const updateQuantity = (productId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(prev =>
      prev.map(item =>
        item.product.id === productId
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
  };

  const clearCart = () => setCart([]);

  const cartTotalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotalAmount = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  if (!isDataLoaded) return null;

  return (
    <Layout cartCount={cartTotalItems} onCartClick={() => setView('cart')}>
      {/* Панель входу */}
      <div
        className="bg-slate-900 text-white py-2 text-[10px] font-black uppercase text-center cursor-pointer"
        onClick={() => (user ? logout() : login('admin@voltstore.pro', UserRole.ADMIN))}
      >
        {user ? `ПРИВІТ, ${user.name.toUpperCase()} • ВИЙТИ` : 'ВХІД ДЛЯ ПАРТНЕРІВ'}
      </div>

      {/* Перемикання адмін/магазин */}
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

      {/* Основний контент */}
      {view === 'orderSuccess' ? (
        <OrderSuccess
          orderId={currentOrderId}
          onNewOrder={() => {
            clearCart();
            setView('catalog');
          }}
        />
      ) : view === 'checkout' ? (
        <CheckoutForm
          cart={cart}
          totalAmount={cartTotalAmount}
          onBackToCart={() => setView('cart')}
          onOrderSuccess={(orderId) => {
            setCurrentOrderId(orderId);
            setView('orderSuccess');
          }}
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
        /* Каталог */
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
                  activeCategory === cat.id
                    ? 'bg-slate-900 text-white shadow-xl scale-105'
                    : 'bg-white text-slate-400 border border-slate-100'
                }`}
              >
                {cat.icon} {cat.name}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredProducts.map(product => (
              <div
                key={product.id}
                className="bg-white rounded-[40px] p-5 border border-slate-100 flex flex-col cursor-pointer hover:shadow-2xl transition-all group"
                onClick={() => setSelectedProduct(product)}
              >
                <div className="relative overflow-hidden rounded-[30px] mb-6 aspect-square bg-slate-100">
                  <img
                    src={product.image}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    alt={product.name}
                  />
                  {product.category === 'kit' && (
                    <span className="absolute top-4 left-4 bg-yellow-400 text-slate-900 text-[9px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest">
                      ХІТ
                    </span>
                  )}
                </div>
                <h3 className="font-bold text-slate-900 text-base mb-4 h-12 line-clamp-2">
                  {product.name}
                </h3>
                <div className="mt-auto flex justify-between items-center bg-slate-50 p-3 rounded-2xl">
                  <span className="font-black text-lg text-slate-900">
                    {product.price.toLocaleString()} ₴
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
            ))}
          </div>
        </div>
      )}

      {/* Модалка товару */}
      {selectedProduct && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="bg-white text-slate-900 w-full max-w-5xl rounded-[50px] overflow-hidden flex flex-col md:flex-row max-h-[95vh] shadow-2xl relative">
            <button
              onClick={() => setSelectedProduct(null)}
              className="absolute top-6 right-6 z-10 w-10 h-10 bg-white/80 rounded-full flex items-center justify-center font-bold shadow-lg"
            >
              ✕
            </button>

            <div className="w-full md:w-1/2 bg-slate-100">
              <img
                src={selectedProduct.image}
                className="w-full h-full object-cover"
                alt={selectedProduct.name}
              />
            </div>

            <div className="w-full md:w-1/2 p-12 overflow-y-auto">
              <h2 className="text-3xl font-black mb-6">{selectedProduct.name}</h2>
              <p className="text-slate-500 mb-8 leading-relaxed">{selectedProduct.description}</p>

              {/* Короткі характеристики */}
              {selectedProduct.specs && (
                <div className="mb-10 bg-slate-50 rounded-3xl p-6">
                  <h3 className="text-xl font-black mb-4">Короткі характеристики</h3>
                  <div className="space-y-3">
                    {selectedProduct.specs.split(',').map((spec, i) => {
                      const parts = spec.split(':');
                      if (parts.length < 2) return null;
                      return (
                        <div key={i} className="flex justify-between">
                          <span className="text-slate-600">{parts[0].trim()}:</span>
                          <span className="font-bold text-slate-900">{parts.slice(1).join(':').trim()}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Повні характеристики */}
              {selectedProduct.detailedTechSpecs && (
                <div className="mb-10">
                  <h3 className="text-xl font-black mb-4">Повні технічні характеристики</h3>
                  <p className="text-sm text-slate-700 whitespace-pre-line leading-relaxed">
                    {selectedProduct.detailedTechSpecs}
                  </p>
                </div>
              )}

              {/* Datasheet */}
              {selectedProduct.datasheet && (
                <a
                  href={selectedProduct.datasheet}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block bg-slate-900 text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-slate-700 transition mb-8"
                >
                  Завантажити datasheet (PDF)
                </a>
              )}

              {selectedProduct.category === 'kit' && <KitBundleVisualizer product={selectedProduct} />}

              <div className="mt-auto pt-10 border-t flex justify-between items-center gap-6">
                <div>
                  <p className="text-[10px] uppercase text-slate-400 font-black mb-1">Вартість</p>
                  <span className="text-3xl font-black">{selectedProduct.price.toLocaleString()} ₴</span>
                </div>
                <button
                  onClick={() => {
                    addToCart(selectedProduct);
                    setSelectedProduct(null);
                  }}
                  className="bg-slate-900 text-white px-12 py-5 rounded-2xl font-black uppercase hover:bg-yellow-500 hover:text-slate-900 transition-all shadow-xl"
                >
                  Додати до кошика
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default App;
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

  // Завантаження кошика з localStorage
  useEffect(() => {
    const savedCart = localStorage.getItem('voltstore_cart');
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (e) {
        console.warn('Помилка завантаження кошика');
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('voltstore_cart', JSON.stringify(cart));
  }, [cart]);

  // Завантаження товарів з Supabase з fallback
  useEffect(() => {
    const loadProducts = async () => {
      try {
        const { data, error } = await supabase.from('products').select('*');

        if (error) throw error;

        if (data && data.length > 0) {
          setProducts(data);
          console.log(`Завантажено ${data.length} товарів з Supabase`);
          setIsDataLoaded(true);
          return;
        }
      } catch (supabaseError) {
        console.warn('Помилка Supabase, пробуємо CSV', supabaseError);
      }

      try {
        const response = await fetch('/products.csv');
        if (response.ok) {
          const text = await response.text();
          const lines = text.split('\n').map(l => l.trim()).filter(l => l);
          if (lines.length > 1) {
            const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''));
            const productsFromCSV: Product[] = lines.slice(1).map(line => {
              const values = line.split(',').map(v => v.trim().replace(/^"|"$/g, ''));
              return {
                id: values[headers.indexOf('id')] || `csv_${Date.now()}`,
                name: values[headers.indexOf('name')] || 'Без назви',
                category: values[headers.indexOf('category')] as Product['category'] || 'inverter',
                subCategory: values[headers.indexOf('subCategory')] || undefined,
                price: Number(values[headers.indexOf('price')]) || 0,
                description: values[headers.indexOf('description')] || '',
                image: values[headers.indexOf('image')] || 'https://via.placeholder.com/400',
                specs: values[headers.indexOf('specs')] || undefined,
                detailedTechSpecs: values[headers.indexOf('detailedTechSpecs')] || undefined,
                datasheet: values[headers.indexOf('datasheet')] || undefined,
                stock: 10,
              };
            });
            setProducts(productsFromCSV);
            console.log(`Завантажено ${productsFromCSV.length} товарів з CSV`);
            setIsDataLoaded(true);
            return;
          }
        }
      } catch (csvError) {
        console.warn('CSV не знайдено або помилка парсингу', csvError);
      }

      console.warn('Використовуємо MOCK_PRODUCTS як останній варіант');
      setProducts(MOCK_PRODUCTS);
      setIsDataLoaded(true);
    };

    loadProducts();
  }, []);

  // Безпечний фільтр пошуку
  const filteredProducts = useMemo(() => {
    const searchLower = searchQuery.toLowerCase();

    return products.filter(p => {
      const matchesCategory = activeCategory === 'all' || p.category === activeCategory;

      const nameMatch = p.name && p.name.toLowerCase().includes(searchLower);
      const subCategoryMatch = p.subCategory ? p.subCategory.toLowerCase().includes(searchLower) : false;

      return matchesCategory && (searchQuery === '' || nameMatch || subCategoryMatch);
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
  const cartTotalAmount = cart.reduce((sum, item) => sum + (item.product.price ?? 0) * item.quantity, 0);

  if (!isDataLoaded) return null;

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
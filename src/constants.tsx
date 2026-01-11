// src/constants.tsx
import { Product } from './types.ts';

// Іконки для категорій (можна замінити на реальні SVG або зображення)
export const CATEGORIES = [
  { id: 'all', name: 'Всі товари', icon: '🌐' },
  { id: 'inverter', name: 'Інвертори', icon: '🔌' },
  { id: 'battery', name: 'Акумулятори', icon: '🔋' },
  { id: 'solar_panel', name: 'Сонячні панелі', icon: '☀️' },
  { id: 'kit', name: 'Комплекти', icon: '🏠' },
] as const;

// Початкові мок-данні (якщо Supabase або CSV недоступні)
export const MOCK_PRODUCTS: Product[] = [
  {
    id: 'mock1',
    name: 'Deye SUN-5K-G',
    category: 'inverter',
    price: 19999,
    description: 'Однофазний інвертор 5 кВт',
    image: 'https://via.placeholder.com/400?text=Deye+5K',
    specs: 'Потужність: 5 кВт, Ефективність: 97.5%',
    stock: 10,
  },
  {
    id: 'mock2',
    name: 'LiFePO4 100Ah',
    category: 'battery',
    price: 15000,
    description: 'Акумулятор LiFePO4 100Ah',
    image: 'https://via.placeholder.com/400?text=Battery+100Ah',
    specs: 'Ємність: 100Ah, Напруга: 12V',
    stock: 20,
  },
  // ... додай ще, якщо потрібно
];
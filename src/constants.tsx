
import { Product, BatteryType } from './types';

export const MOCK_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Deye SUN-5K-SG03LP1-EU',
    category: 'inverter',
    price: 42000,
    power: 5,
    image: 'https://images.unsplash.com/photo-1613665813446-82a78c468a1d?auto=format&fit=crop&q=80&w=400',
    description: 'Гібридний інвертор преміум класу з підтримкою сонячних панелей та АКБ.',
    stock: 12
  },
  {
    id: '2',
    name: 'Pylontech US5000',
    category: 'battery',
    price: 58000,
    capacity: 4.8,
    batteryType: BatteryType.LIFEP04,
    image: 'https://images.unsplash.com/photo-1620714223084-8fcacc6dfd8d?auto=format&fit=crop&q=80&w=400',
    description: 'Акумуляторний блок LiFePO4 48V для систем енергонезалежності.',
    stock: 25
  },
  {
    id: 'k1',
    name: 'Комплект "Економ 3кВт"',
    category: 'kit',
    price: 31500, // Знижена ціна
    originalPrice: 35000, // Повна вартість компонентів
    power: 3,
    image: 'https://images.unsplash.com/photo-1592833159155-c62df1b65634?auto=format&fit=crop&q=80&w=400',
    description: 'Готове рішення для квартири: базовий захист при відключеннях зі знижкою 10%.',
    stock: 8,
    bundleItems: [
      { name: 'Інвертор Must 3кВт', quantity: 1 },
      { name: 'АКБ AGM 100Ah 12V', quantity: 1 },
      { name: 'Комплект кабелів', quantity: 1 }
    ]
  },
  {
    id: 'k2',
    name: 'Комплект "Автономність Pro 5кВт"',
    category: 'kit',
    price: 89000, // Велика знижка на набір
    originalPrice: 98000,
    power: 5,
    image: 'https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?auto=format&fit=crop&q=80&w=400',
    description: 'Преміальний набір для дому. Купуючи комплектом, ви економите 9000 грн.',
    stock: 5,
    bundleItems: [
      { name: 'Інвертор Deye 5кВт', quantity: 1 },
      { name: 'АКБ Pylontech 4.8кВтг', quantity: 1 },
      { name: 'Силові перемички', quantity: 2 }
    ]
  },
  {
    id: '3',
    name: 'Victron MultiPlus-II',
    category: 'inverter',
    price: 38500,
    power: 3,
    image: 'https://images.unsplash.com/photo-1544724569-5f546fa6629d?auto=format&fit=crop&q=80&w=400',
    description: 'Професійне європейське рішення для автономності оселі.',
    stock: 5
  },
  {
    id: '4',
    name: 'Must PH18-5048 Plus',
    category: 'inverter',
    price: 24000,
    power: 5.5,
    image: 'https://images.unsplash.com/photo-1558449028-b53a39d100fc?auto=format&fit=crop&q=80&w=400',
    description: 'Надійний та бюджетний інвертор для приватного будинку.',
    stock: 30
  },
  {
    id: '5',
    name: 'Dyness A48100',
    category: 'battery',
    price: 45000,
    capacity: 4.8,
    batteryType: BatteryType.LIFEP04,
    image: 'https://images.unsplash.com/photo-1611333523274-f97452e161aa?auto=format&fit=crop&q=80&w=400',
    description: 'Сучасний літієвий акумулятор з ресурсом понад 6000 циклів.',
    stock: 15
  }
];

export const CATEGORIES = [
  { id: 'all', name: 'Всі товари', icon: '🛍️' },
  { id: 'inverter', name: 'Інвертори', icon: '🔌' },
  { id: 'battery', name: 'Акумулятори', icon: '🔋' },
  { id: 'kit', name: 'Комплекти для оселі', icon: '🏠' }
];

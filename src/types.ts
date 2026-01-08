// src/types.ts
export enum UserRole {
  ADMIN = 'ADMIN',
  MANAGER = 'MANAGER',
  CLIENT = 'CLIENT'
}

export enum BatteryType {
  LIFEP04 = 'LiFePO4',
  GEL = 'Gel',
  AGM = 'AGM',
  LI_ION = 'Li-ion'
}

export interface BundleItem {
  name: string;
  quantity: number;
}

// src/types.ts
export interface Product {
  id: string;
  name: string;
  category: 'inverter' | 'battery' | 'kit' | 'solar_panel';
  subCategory?: string;
  price: number;
  description: string;
  image: string;               // Одне зображення
  specs?: string;              // Рядок з характеристиками через кому
  detailedTechSpecs?: string;  // Повний текст
  datasheet?: string;          // PDF посилання
  stock?: number;
}

export interface User {
  id: string;
  email: string;
  role: UserRole;
  name: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}
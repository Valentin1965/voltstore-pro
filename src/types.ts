// src/types.ts
export enum UserRole {
  ADMIN = 'ADMIN',
  MANAGER = 'MANAGER',
  CLIENT = 'CLIENT'
}

export interface BundleItem {
  name: string;
  quantity: number;
}

export interface Product {
  id: string;
  name: string;
  category: 'inverter' | 'battery' | 'solar_panel' | 'kit';
  subCategory?: string;
  price: number | null;          // Дозволяємо null для "Ціна за запитом"
  description: string;
  image: string;
  specs?: string;
  detailedTechSpecs?: string;
  datasheet?: string;
  stock?: number;
  bundleItems?: BundleItem[];    // Для комплектів
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
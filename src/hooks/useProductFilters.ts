// src/hooks/useProductFilters.ts
import { useState, useMemo } from 'react';
import { Product } from '../types.ts';

export const useProductFilters = (products: Product[] = []) => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredProducts = useMemo(() => {
    const lower = searchQuery.toLowerCase();

    return products.filter(p => {
      const catMatch = activeCategory === 'all' || p.category === activeCategory;
      const nameMatch = p.name?.toLowerCase().includes(lower) ?? false;
      const subMatch = p.subCategory?.toLowerCase().includes(lower) ?? false;

      return catMatch && (searchQuery === '' || nameMatch || subMatch);
    });
  }, [products, activeCategory, searchQuery]);

  return {
    activeCategory,
    setActiveCategory,
    searchQuery,
    setSearchQuery,
    filteredProducts,
  } as const;
};
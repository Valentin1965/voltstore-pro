
import { Product } from '../types';

export const parseCSVToProducts = (csvText: string): Product[] => {
  const lines = csvText.split(/\r?\n/);
  if (lines.length < 2) return [];

  // Robust regex for CSV that handles quotes and escaped characters
  const regex = /,(?=(?:(?:[^"]*"){2})*[^"]*$)/;

  return lines.slice(1).filter(line => line.trim() !== '').map(line => {
    const values = line.split(regex);
    const cleanValues = values.map(v => v.trim().replace(/^"|"$/g, '').replace(/""/g, '"'));

    const specsObj: Record<string, string> = {};
    const specsStr = cleanValues[7] || '';
    specsStr.split(';').forEach(s => {
      const parts = s.split(':');
      if (parts.length >= 2) {
        const k = parts[0].trim();
        const v = parts.slice(1).join(':').trim();
        specsObj[k] = v;
      }
    });

    const allImages = cleanValues[6]?.split(';').filter(i => i.trim() !== '') || [];

    return {
      id: cleanValues[0] || Math.random().toString(36).substr(2, 9),
      name: cleanValues[1] || 'Без назви',
      category: (cleanValues[2] as any) || 'inverter',
      subCategory: cleanValues[3] || '',
      price: parseFloat(cleanValues[4]) || 0,
      description: cleanValues[5] || '',
      image: allImages[0] || 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=400',
      images: allImages,
      specs: specsObj,
      detailedTechSpecs: cleanValues[8] || '',
      datasheet: cleanValues[9] || '',
      stock: 10
    };
  });
};

export const parseCSVToKits = (csvText: string): Product[] => {
  const baseProducts = parseCSVToProducts(csvText);
  return baseProducts.map(p => {
    let items = [{ name: 'Монтажний набір', quantity: 1 }];
    const description = p.description;
    
    if (description.includes('+')) {
      items = description.split('+').map(i => ({ 
        name: i.trim().replace(/^Гібридний інвертор\s+/i, '').replace(/^АКБ\s+/i, ''), 
        quantity: 1 
      }));
    } else if (description.includes(',')) {
      items = description.split(',').map(i => ({ name: i.trim(), quantity: 1 }));
    }

    return {
      ...p,
      category: 'kit',
      bundleItems: items
    };
  });
};

export const exportProductsToCSV = (products: Product[]) => {
  const headers = ['id', 'name', 'category', 'subCategory', 'price', 'description', 'images', 'specs', 'detailedTechSpecs', 'datasheet'];
  const rows = products.map(p => {
    const specs = p.specs ? Object.entries(p.specs).map(([k,v]) => `${k}:${v}`).join(';') : '';
    const images = p.images ? p.images.join(';') : p.image;
    
    const escape = (str: string) => `"${(str || '').toString().replace(/"/g, '""')}"`;

    return [
      p.id,
      escape(p.name),
      p.category,
      escape(p.subCategory || ''),
      p.price,
      escape(p.description),
      escape(images),
      escape(specs),
      escape(p.detailedTechSpecs || ''),
      p.datasheet || ''
    ].join(',');
  });
  
  const csv = [headers.join(','), ...rows].join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `voltstore_export_${new Date().toISOString().slice(0,10)}.csv`;
  link.click();
};

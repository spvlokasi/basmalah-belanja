import React from 'react';
import { StoreProduct } from '../../types/storeTypes';

interface CategoryFilterTabsProps {
  selectedCategory: string;
  onSelectCategory: (cat: string) => void;
}

export const CategoryFilterTabs: React.FC<CategoryFilterTabsProps> = ({
  selectedCategory, onSelectCategory
}) => {
  const categories = [
    { id: 'all', label: '🌟 Semua Promo' },
    { id: 'sembako', label: '🌾 Sembako & Beras' },
    { id: 'minuman_snack', label: '☕ Kopi & Minuman' },
    { id: 'promo_kasir', label: '⚡ Tebus Murah Kasir' },
    { id: 'kebersihan', label: '🧼 Sabun & Deterjen' }
  ];

  return (
    <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar text-xs">
      {categories.map((c) => {
        const isActive = selectedCategory === c.id;
        return (
          <button
            key={c.id}
            type="button"
            onClick={() => onSelectCategory(c.id)}
            className={`px-3.5 py-2 rounded-xl font-bold whitespace-nowrap transition-all ${
              isActive
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-950/60'
                : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800'
            }`}
          >
            {c.label}
          </button>
        );
      })}
    </div>
  );
};

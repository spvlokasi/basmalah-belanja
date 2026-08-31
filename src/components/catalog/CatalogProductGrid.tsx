import React from 'react';
import { StoreProduct, StoreVoucher } from '../../types/storeTypes';
import { ProductCard } from './ProductCard';

interface CatalogProductGridProps {
  products: StoreProduct[];
  vouchers: StoreVoucher[];
  cartCounts: Record<string, number>;
  searchQuery: string;
  onResetSearch: () => void;
  onAddToCart: (p: StoreProduct) => void;
}

export const CatalogProductGrid: React.FC<CatalogProductGridProps> = ({
  products, vouchers, cartCounts, searchQuery, onResetSearch, onAddToCart
}) => {
  const isProductHasVoucher = (product: StoreProduct) => {
    const nameLower = product.name.toLowerCase();
    return vouchers.some((v) => {
      if (v.isActive === false) return false;
      if (v.applicableProductIds && v.applicableProductIds.length > 0) return v.applicableProductIds.includes(product.id);
      if (v.sponsorName) return nameLower.includes(v.sponsorName.toLowerCase());
      if (v.applicableCategory && v.applicableCategory !== 'all') return product.category === v.applicableCategory;
      if (!v.applicableProductIds?.length && !v.sponsorName && (!v.applicableCategory || v.applicableCategory === 'all')) return true;
      return false;
    });
  };

  if (products.length === 0) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center space-y-2">
        <p className="text-xs text-slate-400">Tidak ada produk yang cocok dengan pencarian <strong>"{searchQuery}"</strong></p>
        <button
          type="button"
          onClick={onResetSearch}
          className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-400 text-xs font-bold border border-slate-700"
        >
          Reset Filter Pencarian
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
      {products.map((p) => (
        <ProductCard
          key={p.id}
          product={p}
          cartCount={cartCounts[p.id] || 0}
          hasVoucher={isProductHasVoucher(p)}
          onAddToCart={onAddToCart}
        />
      ))}
    </div>
  );
};

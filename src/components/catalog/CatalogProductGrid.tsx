import React from 'react';
import { ShoppingBag } from 'lucide-react';
import { StoreProduct, StoreVoucher } from '../../types/storeTypes';
import { ProductCard } from './ProductCard';

interface CatalogProductGridProps {
  products: StoreProduct[];
  vouchers: StoreVoucher[];
  cartCounts: Record<string, number>;
  searchQuery: string;
  isLoading?: boolean;
  onResetSearch: () => void;
  onAddToCart: (p: StoreProduct) => void;
}

export const CatalogProductGrid: React.FC<CatalogProductGridProps> = ({
  products, vouchers, cartCounts, searchQuery, isLoading = false, onResetSearch, onAddToCart
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

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="bg-slate-900 border border-slate-800/80 rounded-2xl overflow-hidden p-3 space-y-3 animate-pulse">
            <div className="aspect-square bg-slate-800/60 rounded-xl" />
            <div className="space-y-1.5">
              <div className="h-3 bg-slate-800 rounded w-3/4" />
              <div className="h-2.5 bg-slate-800/60 rounded w-1/2" />
            </div>
            <div className="h-7 bg-slate-800 rounded-xl" />
          </div>
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-10 text-center space-y-3 shadow-inner">
        <div className="w-12 h-12 rounded-2xl bg-slate-800/80 text-emerald-400 flex items-center justify-center mx-auto">
          <ShoppingBag className="w-6 h-6" />
        </div>
        <div>
          <h4 className="text-sm font-bold text-white">
            {searchQuery ? 'Produk Tidak Ditemukan' : 'Belum Ada Promo Aktif'}
          </h4>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            {searchQuery
              ? `Tidak ada produk yang cocok dengan kata kunci "${searchQuery}".`
              : 'Daftar promo sembako untuk gerai ini sedang dipersiapkan oleh toko.'}
          </p>
        </div>
        {searchQuery && (
          <button
            type="button"
            onClick={onResetSearch}
            className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-emerald-400 text-xs font-bold border border-slate-700 transition-colors"
          >
            Reset Pencarian
          </button>
        )}
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

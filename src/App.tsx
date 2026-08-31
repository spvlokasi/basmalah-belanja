import React, { useState } from 'react';
import { StoreNavbar } from './components/layout/StoreNavbar';
import { BranchSelectorModal } from './components/layout/BranchSelectorModal';
import { PromoHeroBanner } from './components/promo/PromoHeroBanner';
import { InstallAppBanner } from './components/layout/InstallAppBanner';
import { SearchBar } from './components/catalog/SearchBar';
import { CatalogProductGrid } from './components/catalog/CatalogProductGrid';
import { CartDrawer } from './components/cart/CartDrawer';
import { FloatingCartBar } from './components/cart/FloatingCartBar';
import { StoreFooter } from './components/layout/StoreFooter';
import { useStoreData } from './hooks/useStoreData';
import { useStoreCart } from './hooks/useStoreCart';

export const App: React.FC = () => {
  const { branches, currentBranch, isLockedBranch, isLoading, products, vouchers, setCurrentBranch } = useStoreData();
  const { cart, appliedVoucher, isCartOpen, cartCounts, totalItems, subtotal, setAppliedVoucher, setIsCartOpen, handleAddToCart, handleUpdateQty } = useStoreCart();

  const [searchQuery, setSearchQuery] = useState('');
  const [isBranchModalOpen, setIsBranchModalOpen] = useState(false);

  const filteredProducts = products.filter((p) => {
    const q = searchQuery.toLowerCase().trim();
    return !q || p.name.toLowerCase().includes(q) || p.unit.toLowerCase().includes(q);
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <StoreNavbar currentBranch={currentBranch} isLockedBranch={isLockedBranch} onOpenBranchPicker={() => setIsBranchModalOpen(true)} />
      <main className="flex-1 max-w-4xl w-full mx-auto p-4 sm:p-6 space-y-4">
        <InstallAppBanner />
        <PromoHeroBanner branch={currentBranch} />
        <SearchBar value={searchQuery} onChange={setSearchQuery} onClear={() => setSearchQuery('')} totalResults={filteredProducts.length} />

        <div className="space-y-3 pt-1">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-black text-white tracking-tight">Katalog Promo:</h3>
            <span className="text-[11px] text-emerald-400 font-semibold">{filteredProducts.length} Produk</span>
          </div>
          <CatalogProductGrid
            products={filteredProducts}
            vouchers={vouchers}
            cartCounts={cartCounts}
            searchQuery={searchQuery}
            isLoading={isLoading}
            onResetSearch={() => setSearchQuery('')}
            onAddToCart={handleAddToCart}
          />
        </div>
        <StoreFooter branch={currentBranch} />
      </main>

      <FloatingCartBar totalItems={totalItems} subtotal={subtotal} onOpenCart={() => setIsCartOpen(true)} />
      {!isLockedBranch && isBranchModalOpen && <BranchSelectorModal branches={branches} currentBranchId={currentBranch.id} onSelectBranch={setCurrentBranch} onClose={() => setIsBranchModalOpen(false)} />}
      {isCartOpen && (
        <CartDrawer
          branch={currentBranch}
          items={cart}
          vouchers={vouchers}
          appliedVoucher={appliedVoucher}
          onSelectVoucher={setAppliedVoucher}
          onUpdateQty={handleUpdateQty}
          onClose={() => setIsCartOpen(false)}
        />
      )}
    </div>
  );
};

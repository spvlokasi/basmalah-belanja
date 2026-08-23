import React, { useState, useEffect } from 'react';
import { StoreBranch, StoreProduct, StoreVoucher, CartItem } from './types/storeTypes';
import { fetchStoreBranches, FALLBACK_BRANCHES, FALLBACK_PRODUCTS, FALLBACK_VOUCHERS } from './services/storeFetchService';
import { StoreNavbar } from './components/layout/StoreNavbar';
import { BranchSelectorModal } from './components/layout/BranchSelectorModal';
import { PromoHeroBanner } from './components/promo/PromoHeroBanner';
import { VoucherClaimCard } from './components/promo/VoucherClaimCard';
import { CategoryFilterTabs } from './components/catalog/CategoryFilterTabs';
import { ProductCard } from './components/catalog/ProductCard';
import { CartDrawer } from './components/cart/CartDrawer';
import { FloatingCartBar } from './components/cart/FloatingCartBar';
import { StoreFooter } from './components/layout/StoreFooter';

export const App: React.FC = () => {
  const [branches, setBranches] = useState<StoreBranch[]>(FALLBACK_BRANCHES);
  const [currentBranch, setCurrentBranch] = useState<StoreBranch>(FALLBACK_BRANCHES[0]);
  const [products, setProducts] = useState<StoreProduct[]>(FALLBACK_PRODUCTS);
  const [vouchers, setVouchers] = useState<StoreVoucher[]>(FALLBACK_VOUCHERS);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [appliedVoucher, setAppliedVoucher] = useState<StoreVoucher | null>(FALLBACK_VOUCHERS[0]);
  const [isBranchModalOpen, setIsBranchModalOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    fetchStoreBranches().then((list) => {
      setBranches(list);
      // Auto pick branch from URL param e.g. ?toko=M3017 or default to first
      const params = new URLSearchParams(window.location.search);
      const tokoCode = params.get('toko') || params.get('cabang');
      if (tokoCode) {
        const found = list.find((b) => b.code.toLowerCase() === tokoCode.toLowerCase());
        if (found) setCurrentBranch(found);
      }
    });
  }, []);

  const handleAddToCart = (product: StoreProduct) => {
    const existing = cart.find((i) => i.product.id === product.id);
    if (existing) setCart(cart.map((i) => (i.product.id === product.id ? { ...i, quantity: i.quantity + 1 } : i)));
    else setCart([...cart, { product, quantity: 1 }]);
  };

  const handleUpdateQty = (prodId: string, qty: number) => {
    if (qty <= 0) setCart(cart.filter((i) => i.product.id !== prodId));
    else setCart(cart.map((i) => (i.product.id === prodId ? { ...i, quantity: qty } : i)));
  };

  const filteredProducts = products.filter((p) => selectedCategory === 'all' || p.category === selectedCategory);
  const cartCounts = cart.reduce((acc, i) => ({ ...acc, [i.product.id]: i.quantity }), {} as Record<string, number>);
  const totalItems = cart.reduce((sum, i) => sum + i.quantity, 0);
  const subtotal = cart.reduce((sum, i) => sum + i.product.promoPrice * i.quantity, 0);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <StoreNavbar currentBranch={currentBranch} onOpenBranchPicker={() => setIsBranchModalOpen(true)} />
      <main className="flex-1 max-w-4xl w-full mx-auto p-4 sm:p-6 space-y-5">
        <PromoHeroBanner branch={currentBranch} />
        <VoucherClaimCard vouchers={vouchers} appliedCode={appliedVoucher?.code || null} onApplyVoucher={(v) => setAppliedVoucher(v)} />
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between"><h3 className="text-sm font-black text-white tracking-tight">Katalog Sembako & Promo Hemat:</h3><span className="text-[11px] text-emerald-400 font-semibold">{filteredProducts.length} Produk</span></div>
          <CategoryFilterTabs selectedCategory={selectedCategory} onSelectCategory={setSelectedCategory} />
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {filteredProducts.map((p) => (<ProductCard key={p.id} product={p} cartCount={cartCounts[p.id] || 0} onAddToCart={handleAddToCart} />))}
          </div>
        </div>
        <StoreFooter branch={currentBranch} />
      </main>

      <FloatingCartBar totalItems={totalItems} subtotal={subtotal} onOpenCart={() => setIsCartOpen(true)} />
      {isBranchModalOpen && <BranchSelectorModal branches={branches} currentBranchId={currentBranch.id} onSelectBranch={setCurrentBranch} onClose={() => setIsBranchModalOpen(false)} />}
      {isCartOpen && <CartDrawer branch={currentBranch} items={cart} appliedVoucher={appliedVoucher} onUpdateQty={handleUpdateQty} onClose={() => setIsCartOpen(false)} />}
    </div>
  );
};

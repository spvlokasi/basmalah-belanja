import React, { useState, useEffect } from 'react';
import { StoreBranch, StoreProduct, StoreVoucher, CartItem } from './types/storeTypes';
import { fetchStoreBranches, fetchStoreProducts, fetchStoreVouchers, FALLBACK_BRANCHES, FALLBACK_PRODUCTS, FALLBACK_VOUCHERS } from './services/storeFetchService';
import { StoreNavbar } from './components/layout/StoreNavbar';
import { BranchSelectorModal } from './components/layout/BranchSelectorModal';
import { PromoHeroBanner } from './components/promo/PromoHeroBanner';
import { VoucherClaimCard } from './components/promo/VoucherClaimCard';
import { SearchBar } from './components/catalog/SearchBar';
import { CategoryFilterTabs } from './components/catalog/CategoryFilterTabs';
import { ProductCard } from './components/catalog/ProductCard';
import { CartDrawer } from './components/cart/CartDrawer';
import { FloatingCartBar } from './components/cart/FloatingCartBar';
import { StoreFooter } from './components/layout/StoreFooter';

export const App: React.FC = () => {
  const [branches, setBranches] = useState<StoreBranch[]>(FALLBACK_BRANCHES);
  const [currentBranch, setCurrentBranch] = useState<StoreBranch>(FALLBACK_BRANCHES[0]);
  const [isLockedBranch, setIsLockedBranch] = useState(false);
  const [products, setProducts] = useState<StoreProduct[]>(FALLBACK_PRODUCTS);
  const [vouchers, setVouchers] = useState<StoreVoucher[]>(FALLBACK_VOUCHERS);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [appliedVoucher, setAppliedVoucher] = useState<StoreVoucher | null>(null);
  const [isBranchModalOpen, setIsBranchModalOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tokoCode = params.get('toko') || params.get('cabang');
    if (tokoCode) {
      setIsLockedBranch(true);
    }

    fetchStoreBranches().then((list) => {
      setBranches(list);
      if (tokoCode) {
        const found = list.find((b) => b.code.toLowerCase() === tokoCode.toLowerCase());
        if (found) setCurrentBranch(found);
      }
    });
  }, []);

  useEffect(() => {
    if (currentBranch) {
      fetchStoreProducts(currentBranch.id).then((pList) => setProducts(pList));
      fetchStoreVouchers(currentBranch.id).then((vList) => setVouchers(vList));
    }
  }, [currentBranch]);

  const handleAddToCart = (product: StoreProduct) => {
    const existing = cart.find((i) => i.product.id === product.id);
    if (existing) setCart(cart.map((i) => (i.product.id === product.id ? { ...i, quantity: i.quantity + 1 } : i)));
    else setCart([...cart, { product, quantity: 1 }]);
  };

  const handleUpdateQty = (prodId: string, qty: number) => {
    if (qty <= 0) setCart(cart.filter((i) => i.product.id !== prodId));
    else setCart(cart.map((i) => (i.product.id === prodId ? { ...i, quantity: qty } : i)));
  };

  // Filter gabungan Kategori & Pencarian Kata Kunci
  const filteredProducts = products.filter((p) => {
    const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch = !q || p.name.toLowerCase().includes(q) || p.unit.toLowerCase().includes(q);
    return matchesCategory && matchesSearch;
  });

  const cartCounts = cart.reduce((acc, i) => ({ ...acc, [i.product.id]: i.quantity }), {} as Record<string, number>);
  const totalItems = cart.reduce((sum, i) => sum + i.quantity, 0);
  const subtotal = cart.reduce((sum, i) => sum + i.product.promoPrice * i.quantity, 0);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <StoreNavbar currentBranch={currentBranch} isLockedBranch={isLockedBranch} onOpenBranchPicker={() => setIsBranchModalOpen(true)} />
      <main className="flex-1 max-w-4xl w-full mx-auto p-4 sm:p-6 space-y-4">
        <PromoHeroBanner branch={currentBranch} />
        <VoucherClaimCard vouchers={vouchers} appliedCode={appliedVoucher?.code || null} onApplyVoucher={(v) => setAppliedVoucher(v)} />
        
        {/* Kolom Pencarian Cepat Produk */}
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          onClear={() => setSearchQuery('')}
          totalResults={filteredProducts.length}
        />

        <div className="space-y-3 pt-1">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-black text-white tracking-tight">Katalog Sembako & Promo Hemat:</h3>
            <span className="text-[11px] text-emerald-400 font-semibold">{filteredProducts.length} Produk</span>
          </div>
          <CategoryFilterTabs selectedCategory={selectedCategory} onSelectCategory={setSelectedCategory} />
          {filteredProducts.length === 0 ? (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center space-y-2">
              <p className="text-xs text-slate-400">Tidak ada produk yang cocok dengan pencarian <strong>"{searchQuery}"</strong></p>
              <button
                type="button"
                onClick={() => { setSearchQuery(''); setSelectedCategory('all'); }}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-400 text-xs font-bold border border-slate-700"
              >
                Reset Filter Pencarian
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {filteredProducts.map((p) => (
                <ProductCard key={p.id} product={p} cartCount={cartCounts[p.id] || 0} onAddToCart={handleAddToCart} />
              ))}
            </div>
          )}
        </div>
        <StoreFooter branch={currentBranch} />
      </main>

      <FloatingCartBar totalItems={totalItems} subtotal={subtotal} onOpenCart={() => setIsCartOpen(true)} />
      {!isLockedBranch && isBranchModalOpen && <BranchSelectorModal branches={branches} currentBranchId={currentBranch.id} onSelectBranch={setCurrentBranch} onClose={() => setIsBranchModalOpen(false)} />}
      {isCartOpen && <CartDrawer branch={currentBranch} items={cart} appliedVoucher={appliedVoucher} onUpdateQty={handleUpdateQty} onClose={() => setIsCartOpen(false)} />}
    </div>
  );
};

import React from 'react';
import { ShoppingBag } from 'lucide-react';
import { formatRupiah } from '../../utils/formatters';

interface FloatingCartBarProps {
  totalItems: number;
  subtotal: number;
  onOpenCart: () => void;
}

export const FloatingCartBar: React.FC<FloatingCartBarProps> = ({
  totalItems, subtotal, onOpenCart
}) => {
  if (totalItems === 0) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-40 max-w-md mx-auto animate-in slide-in-from-bottom-5">
      <button
        type="button"
        onClick={onOpenCart}
        className="w-full py-3.5 px-5 rounded-2xl bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-500 text-white font-bold flex items-center justify-between shadow-2xl shadow-emerald-950/80 active:scale-95 transition-all border border-emerald-400/30"
      >
        <div className="flex items-center gap-2.5">
          <ShoppingBag className="w-5 h-5" />
          <span className="text-xs bg-white text-emerald-950 px-2 py-0.5 rounded-full font-black font-mono shadow">{totalItems}</span>
          <span className="text-sm font-extrabold tracking-tight">Lihat Keranjang</span>
        </div>
        <strong className="font-mono text-sm sm:text-base font-black">{formatRupiah(subtotal)}</strong>
      </button>
    </div>
  );
};

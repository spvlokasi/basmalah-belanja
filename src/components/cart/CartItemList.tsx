import React from 'react';
import { Plus, Minus } from 'lucide-react';
import { CartItem } from '../../types/storeTypes';
import { formatRupiah } from '../../utils/formatters';

interface CartItemListProps {
  items: CartItem[];
  onUpdateQty: (prodId: string, qty: number) => void;
}

export const CartItemList: React.FC<CartItemListProps> = ({ items, onUpdateQty }) => {
  if (items.length === 0) {
    return <p className="text-center text-xs text-slate-500 py-10">Keranjang belanja Anda masih kosong.</p>;
  }

  return (
    <div className="space-y-2">
      {items.map((i) => (
        <div key={i.product.id} className="bg-slate-850 p-2.5 rounded-xl border border-slate-800 flex items-center justify-between gap-2">
          <div className="min-w-0 flex-1">
            <h5 className="text-xs font-bold text-slate-200 truncate">{i.product.name}</h5>
            <div className="text-[11px] text-emerald-400 font-mono font-semibold">{formatRupiah(i.product.promoPrice)}</div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => onUpdateQty(i.product.id, i.quantity - 1)} className="p-1 rounded-lg bg-slate-800 text-slate-300 hover:text-white">
              <Minus className="w-3 h-3" />
            </button>
            <span className="text-xs font-bold text-white font-mono">{i.quantity}</span>
            <button onClick={() => onUpdateQty(i.product.id, i.quantity + 1)} className="p-1 rounded-lg bg-slate-800 text-slate-300 hover:text-white">
              <Plus className="w-3 h-3" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

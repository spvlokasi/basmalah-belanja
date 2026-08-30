import React from 'react';
import { Send, Tag } from 'lucide-react';
import { StoreVoucher } from '../../types/storeTypes';
import { formatRupiah } from '../../utils/formatters';

interface CartSummaryFooterProps {
  subtotal: number;
  discount: number;
  grandTotal: number;
  appliedVoucher: StoreVoucher | null;
  itemsCount: number;
  onCheckout: () => void;
}

export const CartSummaryFooter: React.FC<CartSummaryFooterProps> = ({
  subtotal, discount, grandTotal, appliedVoucher, itemsCount, onCheckout
}) => {
  return (
    <div className="pt-3 border-t border-slate-800 space-y-2 text-xs">
      <div className="flex justify-between text-slate-400">
        <span>Subtotal:</span>
        <strong className="text-slate-200 font-mono">{formatRupiah(subtotal)}</strong>
      </div>
      {discount > 0 && (
        <div className="flex justify-between text-emerald-400">
          <span className="flex items-center gap-1"><Tag className="w-3.5 h-3.5" /> Kupon ({appliedVoucher?.code}):</span>
          <strong className="font-mono">-{formatRupiah(discount)}</strong>
        </div>
      )}
      <div className="flex justify-between text-sm font-bold text-white pt-1 border-t border-slate-800">
        <span>Total Tagihan:</span>
        <strong className="text-emerald-400 font-mono text-base">{formatRupiah(grandTotal)}</strong>
      </div>
      <button
        onClick={onCheckout}
        disabled={itemsCount === 0}
        className="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 disabled:opacity-50 text-white rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/60 active:scale-95 transition-all"
      >
        <Send className="w-4 h-4" />
        <span>Kirim Pesanan via WhatsApp (COD)</span>
      </button>
    </div>
  );
};

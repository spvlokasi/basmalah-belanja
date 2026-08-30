import React, { useState } from 'react';
import { Tag, Sparkles, ChevronDown, ChevronUp } from 'lucide-react';
import { StoreVoucher, CartItem } from '../../types/storeTypes';
import { formatRupiah } from '../../utils/formatters';

interface CartVoucherSelectorProps {
  vouchers: StoreVoucher[];
  items: CartItem[];
  subtotal: number;
  appliedVoucher: StoreVoucher | null;
  onSelectVoucher: (voucher: StoreVoucher | null) => void;
}

export const CartVoucherSelector: React.FC<CartVoucherSelectorProps> = ({
  vouchers, items, subtotal, appliedVoucher, onSelectVoucher
}) => {
  const [isOpen, setIsOpen] = useState(true);
  const activeVouchers = vouchers.filter((v) => v.isActive !== false);

  if (activeVouchers.length === 0 || items.length === 0) return null;

  const checkEligibility = (v: StoreVoucher) => {
    if (v.sponsorName) {
      const sLower = v.sponsorName.toLowerCase();
      const hasSponsorItem = items.some((i) => i.product.name.toLowerCase().includes(sLower));
      if (!hasSponsorItem) {
        return { isEligible: false, reason: `Khusus produk ${v.sponsorName}` };
      }
    }
    if (v.applicableCategory && v.applicableCategory !== 'all') {
      const hasCat = items.some((i) => i.product.category === v.applicableCategory);
      if (!hasCat) return { isEligible: false, reason: `Khusus kategori ${v.applicableCategory}` };
    }
    if (subtotal < v.minSpend) {
      return { isEligible: false, reason: `Belanja ${formatRupiah(v.minSpend - subtotal)} lagi` };
    }
    return { isEligible: true, reason: `✓ Hemat ${formatRupiah(v.discountAmount)}` };
  };

  return (
    <div className="bg-slate-850 rounded-2xl border border-slate-800 p-3 space-y-2">
      <div className="flex items-center justify-between cursor-pointer" onClick={() => setIsOpen(!isOpen)}>
        <span className="font-extrabold text-xs text-amber-400 flex items-center gap-1.5">
          <Tag className="w-3.5 h-3.5 text-amber-400" />
          <span>Kupon Diskon ({activeVouchers.length})</span>
        </span>
        <div className="flex items-center gap-1 text-[11px] text-slate-400">
          {appliedVoucher ? <span className="text-emerald-400 font-bold font-mono">-{formatRupiah(appliedVoucher.discountAmount)}</span> : <span>Pilih</span>}
          {isOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </div>
      </div>

      {isOpen && (
        <div className="space-y-1.5 pt-1 border-t border-slate-800">
          {activeVouchers.map((v) => {
            const check = checkEligibility(v);
            const isSelected = appliedVoucher?.code === v.code && check.isEligible;
            return (
              <div
                key={v.id}
                className={`p-2 rounded-xl border flex items-center justify-between gap-2 transition-all ${
                  isSelected ? 'bg-emerald-950/70 border-emerald-500 text-white' : check.isEligible ? 'bg-slate-900 border-slate-700' : 'bg-slate-900/60 border-slate-800/80 opacity-70'
                }`}
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="px-1.5 py-0.5 rounded bg-amber-400 text-slate-950 font-mono font-black text-[9px]">{v.code}</span>
                    <strong className="text-emerald-400 font-black text-[11px]">Hemat {formatRupiah(v.discountAmount)}</strong>
                    {v.sponsorName && (
                      <span className="text-[9px] text-blue-300 bg-blue-950/80 px-1 py-0.2 rounded font-bold flex items-center gap-0.5">
                        <Sparkles className="w-2.5 h-2.5 text-blue-400" /> {v.sponsorName}
                      </span>
                    )}
                  </div>
                  <p className={`text-[10px] mt-0.5 ${check.isEligible ? 'text-emerald-400 font-semibold' : 'text-slate-400'}`}>{check.reason}</p>
                </div>
                <button
                  type="button"
                  disabled={!check.isEligible}
                  onClick={() => onSelectVoucher(isSelected ? null : v)}
                  className={`px-3 py-1.5 rounded-xl text-[10px] font-black transition-all ${
                    isSelected ? 'bg-emerald-500 text-slate-950 shadow-md' : check.isEligible ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-md' : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                  }`}
                >
                  {isSelected ? '✓ Terpakai' : 'Gunakan'}
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

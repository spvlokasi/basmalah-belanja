import React from 'react';
import { Truck, Tag, MessageCircle } from 'lucide-react';
import { StoreBranch } from '../../types/storeTypes';

interface PromoHeroBannerProps {
  branch: StoreBranch;
}

export const PromoHeroBanner: React.FC<PromoHeroBannerProps> = ({ branch: _branch }) => {
  return (
    <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1 text-[11px] font-semibold text-slate-300">
      <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-950/60 border border-emerald-800/60 text-emerald-300 flex-shrink-0 shadow-sm">
        <Truck className="w-3.5 h-3.5 text-emerald-400" />
        <span>Bayar di Tempat (COD)</span>
      </div>
      <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-950/40 border border-amber-800/60 text-amber-300 flex-shrink-0 shadow-sm">
        <Tag className="w-3.5 h-3.5 text-amber-400" />
        <span>Harga Coret Murah</span>
      </div>
      <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-teal-950/40 border border-teal-800/60 text-teal-300 flex-shrink-0 shadow-sm">
        <MessageCircle className="w-3.5 h-3.5 text-teal-400" />
        <span>Proses Cepat via WA</span>
      </div>
    </div>
  );
};

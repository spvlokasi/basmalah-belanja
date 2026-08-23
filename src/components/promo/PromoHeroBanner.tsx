import React from 'react';
import { Sparkles, Truck, Tag, Clock } from 'lucide-react';
import { StoreBranch } from '../../types/storeTypes';

interface PromoHeroBannerProps {
  branch: StoreBranch;
}

export const PromoHeroBanner: React.FC<PromoHeroBannerProps> = ({ branch }) => {
  return (
    <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 border border-emerald-500/40 rounded-3xl p-5 sm:p-6 text-white space-y-3 shadow-xl relative overflow-hidden">
      <div className="flex items-center gap-2 text-amber-300 text-xs font-bold uppercase tracking-wider">
        <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
        <span>Promo Hemat & Berkah TokoBASMALAH</span>
      </div>

      <h2 className="text-lg sm:text-2xl font-black tracking-tight leading-tight">
        Belanja Sembako Murah, <br className="hidden sm:inline" />
        <span className="text-emerald-300">Pesan Antar Sampai Depan Pintu!</span>
      </h2>

      <p className="text-xs sm:text-sm text-slate-200 leading-relaxed max-w-xl">
        Klaim voucher diskon hari ini dan nikmati kemudahan pesan antar sembako, minyak goreng, dan kebutuhan harian dari gerai <strong>{branch.name}</strong>.
      </p>

      <div className="flex items-center gap-3 pt-1 flex-wrap text-[11px] font-semibold text-emerald-200">
        <span className="flex items-center gap-1 bg-emerald-950/80 px-2.5 py-1 rounded-lg border border-emerald-700/60"><Truck className="w-3.5 h-3.5 text-emerald-400" /> Bayar di Tempat (COD)</span>
        <span className="flex items-center gap-1 bg-emerald-950/80 px-2.5 py-1 rounded-lg border border-emerald-700/60"><Tag className="w-3.5 h-3.5 text-amber-400" /> Harga Coret Murah</span>
        <span className="flex items-center gap-1 bg-emerald-950/80 px-2.5 py-1 rounded-lg border border-emerald-700/60"><Clock className="w-3.5 h-3.5 text-blue-400" /> Proses Cepat via WA</span>
      </div>
    </div>
  );
};

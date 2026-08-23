import React from 'react';
import { ShieldCheck, Heart } from 'lucide-react';
import { StoreBranch } from '../../types/storeTypes';

interface StoreFooterProps {
  branch: StoreBranch;
}

export const StoreFooter: React.FC<StoreFooterProps> = ({ branch }) => {
  return (
    <footer className="mt-12 pt-6 pb-16 border-t border-slate-800/80 text-center text-xs text-slate-500 space-y-2">
      <div className="flex items-center justify-center gap-1 text-slate-400 font-semibold">
        <ShieldCheck className="w-4 h-4 text-emerald-400" />
        <span>Layanan Resmi Pesan Antar {branch.name}</span>
      </div>
      <p className="text-[11px] text-slate-500 max-w-sm mx-auto">
        Belanja sembako hemat, amanah & terpercaya. Pembayaran mudah langsung di tempat (COD) saat barang sampai.
      </p>
      <div className="text-[10px] text-slate-600 pt-2 flex items-center justify-center gap-1">
        <span>© 2026 TokoBASMALAH • Mitra Usaha Sidogiri</span>
      </div>
    </footer>
  );
};

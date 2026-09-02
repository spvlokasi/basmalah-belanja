import React from 'react';
import { ShieldCheck } from 'lucide-react';
import { StoreBranch } from '../../types/storeTypes';

interface StoreFooterProps {
  branch: StoreBranch;
}

export const StoreFooter: React.FC<StoreFooterProps> = ({ branch }) => {
  return (
    <footer className="mt-12 pt-6 pb-16 border-t border-slate-800/80 text-center text-xs text-slate-500 space-y-2">
      <div className="flex items-center justify-center gap-1 text-slate-400 font-semibold">
        <ShieldCheck className="w-4 h-4 text-emerald-400" />
        <span>Layanan {branch.name}</span>
      </div>
      <div className="text-[10px] text-slate-600 pt-2 flex items-center justify-center gap-1">
        <span>&copy; 2026 TokoBASMALAH tempat belanja yang baik</span>
      </div>
    </footer>
  );
};

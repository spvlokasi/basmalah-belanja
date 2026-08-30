import React from 'react';
import { MapPin, ChevronDown, ShieldCheck } from 'lucide-react';
import { StoreBranch } from '../../types/storeTypes';

interface StoreNavbarProps {
  currentBranch: StoreBranch;
  isLockedBranch?: boolean;
  onOpenBranchPicker: () => void;
}

export const StoreNavbar: React.FC<StoreNavbarProps> = ({ currentBranch, isLockedBranch = false, onOpenBranchPicker }) => {
  return (
    <header className="sticky top-0 z-30 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 px-4 py-3 shadow-md">
      <div className="max-w-4xl mx-auto flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <img src="/logo.png" alt="TokoBasmalah" className="h-10 w-auto bg-white p-1 rounded-xl shadow object-contain" />
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-sm sm:text-base font-extrabold text-white tracking-tight">TokoBASMALAH</span>
              <span className="px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-400 text-[10px] font-bold border border-emerald-800 flex items-center gap-0.5"><ShieldCheck className="w-3 h-3" />Resmi</span>
            </div>
            <span className="text-[10px] text-emerald-400 font-semibold block tracking-wider uppercase">Katalog Belanja Sembako Hemat</span>
          </div>
        </div>

        {isLockedBranch ? (
          <div
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/80 border border-slate-700/80 text-slate-200 text-xs font-semibold text-left shadow-sm"
            title={`TokoBASMALAH ${currentBranch.name}`}
          >
            <MapPin className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
            <div className="min-w-0 max-w-[130px] sm:max-w-[200px]">
              <span className="text-[9px] text-emerald-400 font-bold block leading-none">TokoBASMALAH</span>
              <span className="text-xs font-bold text-white truncate block">{currentBranch.name.replace(/^TokoBASMALAH\s+/i, '')}</span>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={onOpenBranchPicker}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 text-xs font-semibold border border-slate-700 transition-all text-left"
            title="Klik untuk ganti cabang toko terdekat"
          >
            <MapPin className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
            <div className="min-w-0 max-w-[120px] sm:max-w-[180px]">
              <span className="text-[9px] text-slate-400 block leading-none">Pilih Cabang:</span>
              <span className="text-xs font-bold text-white truncate block">{currentBranch.name.replace(/^TokoBASMALAH\s+/i, '')}</span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
          </button>
        )}
      </div>
    </header>
  );
};

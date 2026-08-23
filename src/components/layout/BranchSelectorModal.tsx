import React from 'react';
import { MapPin, X, Check } from 'lucide-react';
import { StoreBranch } from '../../types/storeTypes';

interface BranchSelectorModalProps {
  branches: StoreBranch[];
  currentBranchId: string;
  onSelectBranch: (branch: StoreBranch) => void;
  onClose: () => void;
}

export const BranchSelectorModal: React.FC<BranchSelectorModalProps> = ({
  branches, currentBranchId, onSelectBranch, onClose
}) => {
  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-md rounded-2xl p-5 space-y-4 shadow-2xl animate-in zoom-in-95">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-emerald-400" />
            <h3 className="text-sm font-bold text-white">Pilih Gerai TokoBASMALAH Terdekat</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1 rounded-lg"><X className="w-4 h-4" /></button>
        </div>

        <div className="space-y-2 max-h-[360px] overflow-y-auto pr-1">
          {branches.map((b) => {
            const isSelected = b.id === currentBranchId;
            return (
              <button
                key={b.id}
                type="button"
                onClick={() => { onSelectBranch(b); onClose(); }}
                className={`w-full p-3 rounded-xl text-left flex items-center justify-between gap-2 border transition-all ${
                  isSelected
                    ? 'bg-emerald-950/60 border-emerald-500 text-white shadow-md'
                    : 'bg-slate-800/60 hover:bg-slate-800 border-slate-700/80 text-slate-200'
                }`}
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-[10px] font-mono font-bold text-emerald-400">{b.code}</span>
                    <h5 className="text-xs font-bold truncate">{b.name}</h5>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1 truncate">{b.address || 'Jawa Timur'}</p>
                </div>
                {isSelected && <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

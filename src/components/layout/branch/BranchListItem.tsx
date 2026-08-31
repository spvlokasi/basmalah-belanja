import React from 'react';
import { MapPin, Check, Phone } from 'lucide-react';
import { StoreBranch } from '../../../types/storeTypes';

interface BranchListItemProps {
  branch: StoreBranch;
  isSelected: boolean;
  onSelect: (b: StoreBranch) => void;
}

export const BranchListItem: React.FC<BranchListItemProps> = ({
  branch: b, isSelected, onSelect
}) => {
  return (
    <button
      type="button"
      onClick={() => onSelect(b)}
      className={`w-full text-left p-3.5 rounded-2xl border transition-all flex items-start justify-between gap-3 ${
        isSelected
          ? 'bg-emerald-950/40 border-emerald-500 shadow-md shadow-emerald-950/50'
          : 'bg-slate-800/60 border-slate-700/60 hover:bg-slate-800 hover:border-slate-600'
      }`}
    >
      <div className="space-y-1 min-w-0 flex-1">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-bold text-white tracking-tight">{b.name}</span>
          <span className="px-1.5 py-0.5 rounded bg-slate-700 text-slate-300 font-mono text-[9px] font-bold">{b.code}</span>
          {b.distanceKm !== undefined && (
            <span className="px-2 py-0.5 rounded-full bg-amber-950/80 border border-amber-500/80 text-amber-300 font-mono text-[9px] font-extrabold flex items-center gap-1">
              <span>📍 {b.distanceKm} km</span>
            </span>
          )}
        </div>
        <p className="text-[11px] text-slate-400 line-clamp-1">{b.address}</p>
        <div className="flex items-center gap-2 text-[10px] text-slate-400">
          <span>{b.city}</span>
          <span>•</span>
          <span className="flex items-center gap-1"><Phone className="w-3 h-3 text-emerald-400" />{b.phone}</span>
        </div>
      </div>
      <div className="mt-1 flex-shrink-0">
        {isSelected ? (
          <div className="w-5 h-5 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center"><Check className="w-3.5 h-3.5 stroke-[3]" /></div>
        ) : (
          <div className="w-5 h-5 rounded-full border border-slate-600 group-hover:border-slate-400" />
        )}
      </div>
    </button>
  );
};

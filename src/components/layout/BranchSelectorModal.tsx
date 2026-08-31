import React, { useState } from 'react';
import { MapPin, X } from 'lucide-react';
import { StoreBranch } from '../../types/storeTypes';
import { useBranchGeo } from './branch/useBranchGeo';
import { BranchSearchHeader } from './branch/BranchSearchHeader';
import { BranchListItem } from './branch/BranchListItem';

interface BranchSelectorModalProps {
  branches: StoreBranch[];
  currentBranchId: string;
  onSelectBranch: (branch: StoreBranch) => void;
  onClose: () => void;
}

export const BranchSelectorModal: React.FC<BranchSelectorModalProps> = ({
  branches, currentBranchId, onSelectBranch, onClose
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const { isLocating, locationSuccess, locationError, sortedBranches, handleDetectLocation } = useBranchGeo(branches);

  const filteredBranches = sortedBranches.filter((b) => {
    const q = searchQuery.toLowerCase();
    return b.name.toLowerCase().includes(q) || b.code.toLowerCase().includes(q) || b.city.toLowerCase().includes(q) || b.address.toLowerCase().includes(q);
  });

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-md rounded-3xl p-5 sm:p-6 space-y-4 shadow-2xl animate-in zoom-in-95">
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-emerald-400" />
            <h3 className="text-sm sm:text-base font-extrabold text-white">Pilih Gerai Toko Terdekat</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1 rounded-lg"><X className="w-4 h-4" /></button>
        </div>

        <BranchSearchHeader
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          isLocating={isLocating}
          locationSuccess={locationSuccess}
          locationError={locationError}
          onDetectLocation={handleDetectLocation}
        />

        <div className="max-h-[50vh] overflow-y-auto space-y-2 pr-1 no-scrollbar">
          {filteredBranches.length === 0 ? (
            <div className="p-6 text-center text-xs text-slate-500">Toko tidak ditemukan untuk kata kunci "{searchQuery}"</div>
          ) : (
            filteredBranches.map((b) => (
              <BranchListItem
                key={b.id}
                branch={b}
                isSelected={b.id === currentBranchId}
                onSelect={(selected) => {
                  onSelectBranch(selected);
                  onClose();
                }}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

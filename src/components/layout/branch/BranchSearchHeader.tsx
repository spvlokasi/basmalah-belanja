import React from 'react';
import { Search, Navigation, Loader2, Sparkles, AlertCircle } from 'lucide-react';

interface BranchSearchHeaderProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  isLocating: boolean;
  locationSuccess: boolean;
  locationError: string | null;
  onDetectLocation: () => void;
}

export const BranchSearchHeader: React.FC<BranchSearchHeaderProps> = ({
  searchQuery, onSearchChange, isLocating, locationSuccess, locationError, onDetectLocation
}) => {
  return (
    <div className="space-y-2.5">
      <button
        type="button"
        onClick={onDetectLocation}
        disabled={isLocating}
        className="w-full py-2.5 px-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/50 transition-all active:scale-[0.98]"
      >
        {isLocating ? <Loader2 className="w-4 h-4 animate-spin" /> : locationSuccess ? <Sparkles className="w-4 h-4 text-amber-300" /> : <Navigation className="w-4 h-4" />}
        <span>{isLocating ? 'Mendeteksi Posisi Anda...' : locationSuccess ? 'Lokasi Berhasil Dideteksi (Toko Terurut Jarak)' : '📍 Cari Toko Terdekat dari Posisi Saya'}</span>
      </button>

      {locationError && (
        <div className="p-2.5 rounded-xl bg-rose-950/50 border border-rose-800/80 text-rose-300 text-[11px] flex items-center gap-1.5">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{locationError}</span>
        </div>
      )}

      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Ketik nama toko, kode, atau kota..."
          className="w-full bg-slate-800 border border-slate-700 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
        />
      </div>
    </div>
  );
};

import React from 'react';
import { Search, X } from 'lucide-react';

interface SearchBarProps {
  value: string;
  onChange: (val: string) => void;
  onClear: () => void;
  totalResults: number;
}

export const SearchBar: React.FC<SearchBarProps> = ({ value, onChange, onClear, totalResults }) => {
  return (
    <div className="relative w-full">
      <div className="relative flex items-center">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Cari sembako, beras, minyak, Yakult, Kanzler..."
          className="w-full bg-slate-900 border border-slate-800 focus:border-emerald-500 rounded-2xl pl-10 pr-10 py-2.5 text-xs text-slate-100 placeholder-slate-500 shadow-inner focus:outline-none transition-all"
        />
        {value && (
          <button
            type="button"
            onClick={onClear}
            className="absolute right-3 p-1 rounded-lg text-slate-400 hover:text-white"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
      {value && (
        <div className="text-[10px] text-slate-400 mt-1.5 px-2 flex items-center justify-between">
          <span>Hasil pencarian: <strong className="text-emerald-400 font-semibold">"{value}"</strong></span>
          <span className="text-slate-300 font-bold">{totalResults} Produk Ditemukan</span>
        </div>
      )}
    </div>
  );
};

import React from 'react';
import { Truck, Tag, MessageCircle, Clock } from 'lucide-react';
import { StoreBranch } from '../../types/storeTypes';

interface PromoHeroBannerProps {
  branch: StoreBranch;
}

export const PromoHeroBanner: React.FC<PromoHeroBannerProps> = ({ branch }) => {
  const deliveryHours = branch.deliveryHours || '07.00–20.30';

  const parseHour = (timeStr: string, defaultHour: number): number => {
    if (!timeStr) return defaultHour;
    const parts = timeStr.trim().split(/[:.]/);
    const h = parseInt(parts[0], 10);
    const m = parseInt(parts[1] || '0', 10);
    if (isNaN(h)) return defaultHour;
    return h + (isNaN(m) ? 0 : m) / 60;
  };

  const timeParts = deliveryHours.split(/[-–]/);
  const openDec = parseHour(timeParts[0], 7.0);
  const closeDec = parseHour(timeParts[1], 20.5);

  const now = new Date();
  const currentDec = now.getHours() + now.getMinutes() / 60;
  const isOpen = currentDec >= openDec && currentDec <= closeDec;

  const displayHours = deliveryHours.replace('-', '–').replace(/:/g, '.');

  const renderBadgeGroup = (keyPrefix: string) => (
    <div key={keyPrefix} className="flex items-center gap-2 pr-2">
      <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border flex-shrink-0 shadow-sm ${
        isOpen
          ? 'bg-emerald-950/60 border-emerald-800/60 text-emerald-300'
          : 'bg-rose-950/40 border-rose-800/60 text-rose-300'
      }`}>
        <Clock className="w-3.5 h-3.5 text-emerald-400" />
        <span>Antar {displayHours}</span>
        <span className={`px-1.5 py-0.2 rounded-full text-[9px] font-black uppercase ${
          isOpen ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'
        }`}>
          {isOpen ? '● Buka' : '○ Tutup'}
        </span>
      </div>

      <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 flex-shrink-0 shadow-sm">
        <Truck className="w-3.5 h-3.5 text-emerald-400" />
        <span>Bayar di Tempat (COD)</span>
      </div>

      <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-amber-300 flex-shrink-0 shadow-sm">
        <Tag className="w-3.5 h-3.5 text-amber-400" />
        <span>Harga Coret Hemat</span>
      </div>

      <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-teal-300 flex-shrink-0 shadow-sm">
        <MessageCircle className="w-3.5 h-3.5 text-teal-400" />
        <span>Pesan via WA</span>
      </div>
    </div>
  );

  return (
    <div className="overflow-hidden py-0.5 text-[11px] font-semibold text-slate-300 select-none relative">
      <div className="animate-marquee-smooth">
        {renderBadgeGroup('g1')}
        {renderBadgeGroup('g2')}
      </div>
    </div>
  );
};

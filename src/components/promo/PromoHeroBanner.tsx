import React from 'react';
import { Truck, Tag, MessageCircle, Clock } from 'lucide-react';
import { StoreBranch } from '../../types/storeTypes';

interface PromoHeroBannerProps {
  branch: StoreBranch;
}

export const PromoHeroBanner: React.FC<PromoHeroBannerProps> = ({ branch }) => {
  // Cek jam operasional pesan antar (07:00 - 20:30 WIB)
  const now = new Date();
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();
  const currentTimeDec = currentHour + currentMinute / 60;
  const isOpen = currentTimeDec >= 7.0 && currentTimeDec <= 20.5;

  return (
    <div className="space-y-2">
      {/* Banner Status Jam Layanan Antar Gerai */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-2.5 sm:p-3 flex items-center justify-between gap-2 text-xs shadow-md">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-xl bg-emerald-950/80 border border-emerald-800/60 flex items-center justify-center flex-shrink-0">
            <Clock className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div>
            <div className="text-[11px] font-extrabold text-white flex items-center gap-1.5">
              <span>Layanan Pesan Antar ({branch.name})</span>
              <span className={`px-1.5 py-0.2 rounded-full text-[9px] font-black uppercase ${
                isOpen ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
              }`}>
                {isOpen ? '● Buka' : '○ Tutup'}
              </span>
            </div>
            <p className="text-[10px] text-slate-400">Pukul 07.00 – 20.30 WIB (Pesan sekarang langsung diantar)</p>
          </div>
        </div>
        <div className="text-right hidden sm:block">
          <span className="text-[10px] text-emerald-400 font-bold bg-emerald-950/60 px-2 py-1 rounded-lg border border-emerald-800/60">
            🛵 Gratis Ongkir Wilayah Sekitar
          </span>
        </div>
      </div>

      {/* Trust Chips Bar */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5 text-[11px] font-semibold text-slate-300">
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-950/60 border border-emerald-800/60 text-emerald-300 flex-shrink-0 shadow-sm">
          <Truck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Bayar di Tempat (COD)</span>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-950/40 border border-amber-800/60 text-amber-300 flex-shrink-0 shadow-sm">
          <Tag className="w-3.5 h-3.5 text-amber-400" />
          <span>Harga Coret Murah</span>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-teal-950/40 border border-teal-800/60 text-teal-300 flex-shrink-0 shadow-sm">
          <MessageCircle className="w-3.5 h-3.5 text-teal-400" />
          <span>Proses Cepat via WA</span>
        </div>
      </div>
    </div>
  );
};

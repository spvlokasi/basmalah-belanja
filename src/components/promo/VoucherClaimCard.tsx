import React from 'react';
import { Ticket, CheckCircle2 } from 'lucide-react';
import { StoreVoucher } from '../../types/storeTypes';
import { formatRupiah } from '../../utils/formatters';

interface VoucherClaimCardProps {
  vouchers: StoreVoucher[];
  appliedCode: string | null;
  onApplyVoucher: (voucher: StoreVoucher) => void;
}

export const VoucherClaimCard: React.FC<VoucherClaimCardProps> = ({
  vouchers, appliedCode, onApplyVoucher
}) => {
  if (vouchers.length === 0) return null;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
          <Ticket className="w-4 h-4 text-amber-400" />
          <span>Klaim Kupon Diskon Belanja Spesial:</span>
        </h3>
        <span className="text-[10px] text-slate-400">Klik klaim kupon</span>
      </div>

      <div className="flex gap-2.5 overflow-x-auto pb-1 no-scrollbar">
        {vouchers.map((v) => {
          const isApplied = appliedCode === v.code;
          return (
            <div key={v.id} className="bg-gradient-to-r from-amber-950/40 via-slate-900 to-slate-900 border border-amber-500/40 rounded-2xl p-3.5 flex-shrink-0 min-w-[240px] flex items-center justify-between gap-3 shadow-lg">
              <div className="space-y-0.5">
                <div className="flex items-center gap-1.5">
                  <span className="px-2 py-0.5 rounded-md bg-amber-400 text-slate-950 font-mono font-black text-[10px] tracking-wider">{v.code}</span>
                  <span className="text-xs font-bold text-emerald-400">Hemat {formatRupiah(v.discountAmount)}</span>
                </div>
                <p className="text-[10px] text-slate-400">Min. Belanja: {formatRupiah(v.minSpend)}</p>
              </div>

              <button
                type="button"
                onClick={() => onApplyVoucher(v)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shadow ${
                  isApplied
                    ? 'bg-emerald-600 text-white'
                    : 'bg-amber-500 hover:bg-amber-400 text-slate-950 active:scale-95'
                }`}
              >
                {isApplied ? '✓ Dipakai' : 'Klaim'}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

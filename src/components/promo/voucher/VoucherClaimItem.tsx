import React from 'react';
import { Clock, CheckCircle2, Users, Sparkles } from 'lucide-react';
import { StoreVoucher } from '../../../types/storeTypes';
import { formatRupiah } from '../../../utils/formatters';
import { ClaimRecord, CLAIM_DURATION_MS } from './useVoucherClaims';

interface VoucherClaimItemProps {
  voucher: StoreVoucher;
  isApplied: boolean;
  userClaim?: ClaimRecord;
  onClaim: (v: StoreVoucher) => void;
  onApply: (v: StoreVoucher) => void;
}

export const VoucherClaimItem: React.FC<VoucherClaimItemProps> = ({
  voucher: v, isApplied, userClaim, onClaim, onApply
}) => {
  const isClaimedByUser = Boolean(userClaim && Date.now() - userClaim.claimedAt <= CLAIM_DURATION_MS);
  const totalQuota = v.quota || 50;
  const remainingQuota = Math.max(0, totalQuota - (v.claimedCount || 0));
  const isQuotaEmpty = remainingQuota === 0 && !isClaimedByUser;

  let hoursLeft = 24;
  if (userClaim) {
    const msElapsed = Date.now() - userClaim.claimedAt;
    hoursLeft = Math.max(1, Math.ceil((CLAIM_DURATION_MS - msElapsed) / (1000 * 60 * 60)));
  }

  return (
    <div className={`bg-gradient-to-r from-amber-950/40 via-slate-900 to-slate-900 border rounded-2xl p-3.5 flex-shrink-0 min-w-[260px] flex items-center justify-between gap-3 shadow-lg transition-all ${
      isQuotaEmpty ? 'border-slate-800 opacity-60' : isApplied || isClaimedByUser ? 'border-emerald-500/80 bg-emerald-950/20' : 'border-amber-500/50 hover:border-amber-400'
    }`}>
      <div className="space-y-1 min-w-0 flex-1">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="px-2 py-0.5 rounded-md bg-amber-400 text-slate-950 font-mono font-black text-[10px] tracking-wider">{v.code}</span>
          <span className="text-xs font-black text-emerald-400">Hemat {formatRupiah(v.discountAmount)}</span>
          {v.sponsorName && (
            <span className="px-1.5 py-0.5 rounded bg-blue-950/80 text-blue-300 border border-blue-800/80 text-[9px] font-bold flex items-center gap-0.5">
              <Sparkles className="w-2.5 h-2.5 text-blue-400" />{v.sponsorName}
            </span>
          )}
        </div>
        <p className="text-[10px] text-slate-300">Min. Belanja: <strong>{formatRupiah(v.minSpend)}</strong></p>
        <div className="flex items-center gap-2 text-[9px]">
          {isClaimedByUser ? (
            <span className="text-emerald-400 font-bold flex items-center gap-0.5"><Clock className="w-3 h-3" />Sisa: ~{hoursLeft} jam</span>
          ) : (
            <span className="text-slate-400 flex items-center gap-1"><Users className="w-3 h-3 text-amber-400" />Sisa: <strong className="text-amber-300 font-mono">{remainingQuota}</strong></span>
          )}
        </div>
      </div>
      <div>
        {isQuotaEmpty ? (
          <button disabled type="button" className="px-3 py-1.5 rounded-xl text-[11px] font-bold bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700">Habis</button>
        ) : isClaimedByUser || isApplied ? (
          <button type="button" onClick={() => onApply(v)} className="px-3 py-1.5 rounded-xl text-[11px] font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-md flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" /><span>Dipakai</span>
          </button>
        ) : (
          <button type="button" onClick={() => onClaim(v)} className="px-3 py-1.5 rounded-xl text-[11px] font-black bg-gradient-to-r from-amber-500 to-amber-400 text-slate-950 shadow-md transition-all">Klaim</button>
        )}
      </div>
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { Ticket, Clock, CheckCircle2, Users, Sparkles } from 'lucide-react';
import { StoreVoucher } from '../../types/storeTypes';
import { formatRupiah } from '../../utils/formatters';

interface VoucherClaimCardProps {
  vouchers: StoreVoucher[];
  appliedCode: string | null;
  onApplyVoucher: (voucher: StoreVoucher) => void;
}

interface ClaimRecord {
  claimedAt: number; // Timestamp ms
  isUsed: boolean;
}

const STORAGE_KEY = 'basmalah_claimed_vouchers';
const CLAIM_DURATION_MS = 24 * 60 * 60 * 1000; // 24 Jam dalam milidetik

export const VoucherClaimCard: React.FC<VoucherClaimCardProps> = ({
  vouchers, appliedCode, onApplyVoucher
}) => {
  const [claims, setClaims] = useState<Record<string, ClaimRecord>>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  });

  // Cek masa aktif 24 jam setiap kali render atau interval
  useEffect(() => {
    const now = Date.now();
    let hasChanges = false;
    const updatedClaims = { ...claims };

    Object.keys(updatedClaims).forEach((code) => {
      const rec = updatedClaims[code];
      // Jika sudah lewat 24 jam dan belum dipakai checkout, otomatis hangus (Auto-Release)
      if (now - rec.claimedAt > CLAIM_DURATION_MS && !rec.isUsed) {
        delete updatedClaims[code];
        hasChanges = true;
      }
    });

    if (hasChanges) {
      setClaims(updatedClaims);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedClaims));
    }
  }, []);

  const handleClaim = (v: StoreVoucher) => {
    const now = Date.now();
    const newClaims = {
      ...claims,
      [v.code]: { claimedAt: now, isUsed: false }
    };
    setClaims(newClaims);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newClaims));
    onApplyVoucher(v);
  };

  // Filter voucher yang aktif dan belum lewat masa berlaku
  const nowDay = new Date().setHours(0, 0, 0, 0);
  const activeVouchers = vouchers.filter((v) => {
    if (v.isActive === false) return false;
    const expTime = new Date(v.validUntil).getTime();
    return expTime >= nowDay;
  });

  if (activeVouchers.length === 0) return null;

  return (
    <div className="space-y-2.5">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-extrabold text-amber-400 flex items-center gap-1.5">
          <Ticket className="w-4 h-4 text-amber-400" />
          <span>Klaim Kupon Diskon Belanja Spesial:</span>
        </h3>
        <span className="text-[10px] text-emerald-400 font-semibold bg-emerald-950/60 px-2 py-0.5 rounded-md border border-emerald-800/60">
          ⏳ Aktif 24 Jam / Kupon
        </span>
      </div>

      <div className="flex gap-3 overflow-x-auto pb-1.5 no-scrollbar">
        {activeVouchers.map((v) => {
          const isApplied = appliedCode === v.code;
          const userClaim = claims[v.code];
          const isClaimedByUser = Boolean(userClaim && Date.now() - userClaim.claimedAt <= CLAIM_DURATION_MS);
          const totalQuota = v.quota || 50;
          const claimedCount = v.claimedCount || 0;
          const remainingQuota = Math.max(0, totalQuota - claimedCount);
          const isQuotaEmpty = remainingQuota === 0 && !isClaimedByUser;

          // Hitung sisa jam klaim
          let hoursLeft = 24;
          if (userClaim) {
            const msElapsed = Date.now() - userClaim.claimedAt;
            hoursLeft = Math.max(1, Math.ceil((CLAIM_DURATION_MS - msElapsed) / (1000 * 60 * 60)));
          }

          return (
            <div
              key={v.id}
              className={`bg-gradient-to-r from-amber-950/40 via-slate-900 to-slate-900 border rounded-2xl p-3.5 flex-shrink-0 min-w-[260px] flex items-center justify-between gap-3 shadow-lg transition-all ${
                isQuotaEmpty
                  ? 'border-slate-800 opacity-60'
                  : isApplied || isClaimedByUser
                  ? 'border-emerald-500/80 bg-emerald-950/20'
                  : 'border-amber-500/50 hover:border-amber-400'
              }`}
            >
              <div className="space-y-1 min-w-0 flex-1">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="px-2 py-0.5 rounded-md bg-amber-400 text-slate-950 font-mono font-black text-[10px] tracking-wider">
                    {v.code}
                  </span>
                  <span className="text-xs font-black text-emerald-400">
                    Hemat {formatRupiah(v.discountAmount)}
                  </span>
                  {v.sponsorName && (
                    <span className="px-1.5 py-0.5 rounded bg-blue-950/80 text-blue-300 border border-blue-800/80 text-[9px] font-bold flex items-center gap-0.5">
                      <Sparkles className="w-2.5 h-2.5 text-blue-400" />
                      {v.sponsorName}
                    </span>
                  )}
                </div>

                <p className="text-[10px] text-slate-300">
                  Min. Belanja: <strong>{formatRupiah(v.minSpend)}</strong>
                </p>

                <div className="flex items-center gap-2 text-[9px]">
                  {isClaimedByUser ? (
                    <span className="text-emerald-400 font-bold flex items-center gap-0.5">
                      <Clock className="w-3 h-3" />
                      Sisa waktu: ~{hoursLeft} jam
                    </span>
                  ) : (
                    <span className="text-slate-400 flex items-center gap-1">
                      <Users className="w-3 h-3 text-amber-400" />
                      Sisa kuota: <strong className="text-amber-300 font-mono">{remainingQuota}</strong>
                    </span>
                  )}
                </div>
              </div>

              <div>
                {isQuotaEmpty ? (
                  <button
                    disabled
                    type="button"
                    className="px-3 py-1.5 rounded-xl text-[11px] font-bold bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700"
                  >
                    Habis
                  </button>
                ) : isClaimedByUser || isApplied ? (
                  <button
                    type="button"
                    onClick={() => onApplyVoucher(v)}
                    className="px-3 py-1.5 rounded-xl text-[11px] font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-950/60 flex items-center gap-1"
                  >
                    <CheckCircle2 className="w-3 h-3" />
                    <span>Dipakai</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleClaim(v)}
                    className="px-3 py-1.5 rounded-xl text-[11px] font-black bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 shadow-md shadow-amber-950/60 active:scale-95 transition-all"
                  >
                    Klaim
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

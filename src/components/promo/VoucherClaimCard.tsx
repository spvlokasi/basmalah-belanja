import React from 'react';
import { Ticket } from 'lucide-react';
import { StoreVoucher } from '../../types/storeTypes';
import { useVoucherClaims } from './voucher/useVoucherClaims';
import { VoucherClaimItem } from './voucher/VoucherClaimItem';

interface VoucherClaimCardProps {
  vouchers: StoreVoucher[];
  appliedCode: string | null;
  onApplyVoucher: (voucher: StoreVoucher) => void;
}

export const VoucherClaimCard: React.FC<VoucherClaimCardProps> = ({
  vouchers, appliedCode, onApplyVoucher
}) => {
  const { claims, handleClaim } = useVoucherClaims(onApplyVoucher);

  const nowDay = new Date().setHours(0, 0, 0, 0);
  const activeVouchers = vouchers.filter((v) => {
    if (v.isActive === false) return false;
    return new Date(v.validUntil).getTime() >= nowDay;
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
        {activeVouchers.map((v) => (
          <VoucherClaimItem
            key={v.id}
            voucher={v}
            isApplied={appliedCode === v.code}
            userClaim={claims[v.code]}
            onClaim={handleClaim}
            onApply={onApplyVoucher}
          />
        ))}
      </div>
    </div>
  );
};

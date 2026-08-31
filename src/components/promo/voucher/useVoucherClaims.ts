import { useState, useEffect } from 'react';
import { StoreVoucher } from '../../../types/storeTypes';
import { supabase } from '../../../services/supabaseClient';

export interface ClaimRecord {
  claimedAt: number;
  isUsed: boolean;
}

export const STORAGE_KEY = 'basmalah_claimed_vouchers';
export const CLAIM_DURATION_MS = 24 * 60 * 60 * 1000;

export const useVoucherClaims = (onApplyVoucher: (v: StoreVoucher) => void) => {
  const [claims, setClaims] = useState<Record<string, ClaimRecord>>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  });

  useEffect(() => {
    const now = Date.now();
    let hasChanges = false;
    const updatedClaims = { ...claims };

    Object.keys(updatedClaims).forEach((code) => {
      const rec = updatedClaims[code];
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
    const newClaims = { ...claims, [v.code]: { claimedAt: now, isUsed: false } };
    setClaims(newClaims);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newClaims));
    onApplyVoucher(v);

    // Sinkronisasi realtime ke cloud: tambah claimed_count
    try {
      const nextClaimed = (v.claimedCount || 0) + 1;
      supabase.from('promo_vouchers').update({
        claimed_count: nextClaimed,
        updated_at: new Date().toISOString()
      }).eq('id', v.id).then();
    } catch {
      // Local fallback
    }
  };

  return { claims, handleClaim };
};

import { supabase } from '../supabaseClient';
import { StoreVoucher } from '../../types/storeTypes';

export const FALLBACK_VOUCHERS: StoreVoucher[] = [
  { id: 'v-yakult', branchId: 'all', code: 'YAKUL2K', discountAmount: 2000, minSpend: 25000, quota: 100, claimedCount: 14, usedCount: 8, validUntil: '2026-12-31', isActive: true, description: 'Potongan Rp 2.000 produk sehat keluarga', sponsorName: 'Yakult' },
  { id: 'v-kanzler', branchId: 'all', code: 'KANZL3K', discountAmount: 3500, minSpend: 35000, quota: 150, claimedCount: 22, usedCount: 15, validUntil: '2026-12-31', isActive: true, description: 'Diskon Rp 3.500 festival frozen food', sponsorName: 'Kanzler' },
  { id: 'v-toko', branchId: 'all', code: 'BERKAH5K', discountAmount: 5000, minSpend: 50000, quota: 50, claimedCount: 8, usedCount: 4, validUntil: '2026-12-31', isActive: true, description: 'Potongan Rp 5.000 belanja sembako' }
];

export const fetchStoreVouchers = async (branchId?: string): Promise<StoreVoucher[]> => {
  try {
    const { data, error } = await supabase.from('promo_vouchers').select('*');
    if (error || !data) return FALLBACK_VOUCHERS;

    const mapped: StoreVoucher[] = data.map((v) => ({
      id: v.id,
      branchId: v.branch_id || v.branchId || 'all',
      code: v.code,
      discountAmount: Number(v.discount_amount || v.discountAmount || 0),
      minSpend: Number(v.min_spend || v.minSpend || 0),
      quota: Number(v.quota || 50),
      claimedCount: Number(v.claimed_count || v.claimedCount || 0),
      usedCount: Number(v.used_count || v.usedCount || 0),
      validUntil: v.valid_until || v.validUntil || '2026-12-31',
      isActive: v.is_active ?? v.isActive ?? true,
      description: v.description || '',
      fundingSource: v.funding_source || v.fundingSource || 'store',
      sponsorName: v.sponsor_name || v.sponsorName || '',
      applicableCategory: v.applicable_category || v.applicableCategory || 'all',
      applicableProductIds: v.applicable_product_ids || v.applicableProductIds || []
    }));

    if (mapped.length === 0) return [];
    if (!branchId || branchId === 'all') return mapped;
    const branchOnly = mapped.filter((v) => v.branchId === branchId || v.branchId === 'all');
    return branchOnly.length > 0 ? branchOnly : mapped;
  } catch (e) {
    console.error('Error di fetchStoreVouchers:', e);
    return FALLBACK_VOUCHERS;
  }
};

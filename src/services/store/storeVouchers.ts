import { supabase } from '../supabaseClient';
import { StoreVoucher } from '../../types/storeTypes';

export const FALLBACK_VOUCHERS: StoreVoucher[] = [
  { id: 'v-yakult', branchId: 'all', code: 'YAKUL2K', discountAmount: 2000, minSpend: 25000, quota: 100, claimedCount: 14, usedCount: 8, validUntil: '2026-12-31', isActive: true, description: 'Potongan Rp 2.000 produk sehat keluarga', sponsorName: 'Yakult' },
  { id: 'v-kanzler', branchId: 'all', code: 'KANZL3K', discountAmount: 3500, minSpend: 35000, quota: 150, claimedCount: 22, usedCount: 15, validUntil: '2026-12-31', isActive: true, description: 'Diskon Rp 3.500 festival frozen food', sponsorName: 'Kanzler' },
  { id: 'v-toko', branchId: 'all', code: 'BERKAH5K', discountAmount: 5000, minSpend: 50000, quota: 50, claimedCount: 8, usedCount: 4, validUntil: '2026-12-31', isActive: true, description: 'Potongan Rp 5.000 belanja sembako' }
];

export const fetchStoreVouchers = async (branchId?: string): Promise<StoreVoucher[]> => {
  try {
    let query = supabase.from('promo_vouchers').select('id, branch_id, code, discount_amount, min_spend, quota, claimed_count, used_count, valid_until, is_active, description, funding_source, sponsor_name, applicable_category, applicable_product_ids');
    if (branchId && branchId !== 'all') {
      query = query.or(`branch_id.eq.${branchId},branch_id.eq.all`);
    }
    const { data, error } = await query;
    if (error || !data) return FALLBACK_VOUCHERS;

    return data.map((v) => ({
      id: v.id,
      branchId: v.branch_id || 'all',
      code: v.code,
      discountAmount: Number(v.discount_amount || 0),
      minSpend: Number(v.min_spend || 0),
      quota: Number(v.quota || 50),
      claimedCount: Number(v.claimed_count || 0),
      usedCount: Number(v.used_count || 0),
      validUntil: v.valid_until || '2026-12-31',
      isActive: v.is_active ?? true,
      description: v.description || '',
      fundingSource: v.funding_source || 'store',
      sponsorName: v.sponsor_name || '',
      applicableCategory: v.applicable_category || 'all',
      applicableProductIds: v.applicable_product_ids || []
    }));
  } catch (e) {
    console.error('Error di fetchStoreVouchers:', e);
    return FALLBACK_VOUCHERS;
  }
};

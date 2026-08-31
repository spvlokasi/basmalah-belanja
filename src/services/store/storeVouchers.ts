import { supabase } from '../supabaseClient';
import { StoreVoucher } from '../../types/storeTypes';

export const FALLBACK_VOUCHERS: StoreVoucher[] = [];

export const fetchStoreVouchers = async (branchId?: string): Promise<StoreVoucher[]> => {
  try {
    let query = supabase.from('promo_vouchers').select('id, branch_id, code, discount_amount, min_spend, quota, claimed_count, used_count, valid_until, is_active, description, funding_source, sponsor_name, applicable_category, applicable_product_ids');
    if (branchId && branchId !== 'all') {
      query = query.or(`branch_id.eq.${branchId},branch_id.eq.all`);
    }
    const { data, error } = await query;
    if (error || !data) return [];

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

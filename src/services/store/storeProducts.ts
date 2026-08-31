import { supabase } from '../supabaseClient';
import { StoreProduct } from '../../types/storeTypes';

export const FALLBACK_PRODUCTS: StoreProduct[] = [];

export const fetchStoreProducts = async (branchId?: string): Promise<StoreProduct[]> => {
  try {
    let query = supabase.from('promo_products').select('id, branch_id, name, category, original_price, promo_price, unit, image_url, in_stock, is_featured');
    if (branchId && branchId !== 'all') {
      query = query.or(`branch_id.eq.${branchId},branch_id.eq.all`);
    }
    const { data, error } = await query;
    if (error || !data) return [];
    
    return data.map((p) => ({
      id: p.id,
      branchId: p.branch_id || 'all',
      name: p.name,
      category: p.category || 'sembako',
      originalPrice: Number(p.original_price || 0),
      promoPrice: Number(p.promo_price || 0),
      unit: p.unit || 'Pcs',
      imageUrl: p.image_url || '',
      inStock: p.in_stock ?? true,
      isFeatured: p.is_featured ?? true
    }));
  } catch (e) {
    console.error('Error di fetchStoreProducts:', e);
    return FALLBACK_PRODUCTS;
  }
};

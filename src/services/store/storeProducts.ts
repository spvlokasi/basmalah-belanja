import { supabase } from '../supabaseClient';
import { StoreProduct } from '../../types/storeTypes';

export const FALLBACK_PRODUCTS: StoreProduct[] = [
  { id: 'p1', branchId: 'all', name: 'Beras Premium Basmalah 5 KG', category: 'sembako', originalPrice: 74000, promoPrice: 68500, unit: '5 Kg / Sak', imageUrl: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=500&auto=format&fit=crop&q=60', inStock: true, isFeatured: true },
  { id: 'p2', branchId: 'all', name: 'Minyak Goreng Pouch 2 Liter', category: 'sembako', originalPrice: 37000, promoPrice: 33500, unit: 'Pouch 2L', imageUrl: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=500&auto=format&fit=crop&q=60', inStock: true, isFeatured: true },
  { id: 'p3', branchId: 'all', name: 'Gula Pasir Kristal Putih 1 KG', category: 'sembako', originalPrice: 18500, promoPrice: 16900, unit: 'Bungkus 1 Kg', imageUrl: 'https://images.unsplash.com/photo-1587735243615-c03f25aaff15?w=500&auto=format&fit=crop&q=60', inStock: true, isFeatured: true },
  { id: 'p4', branchId: 'all', name: 'Kopi Bubuk Asli Sidogiri Basmalah', category: 'minuman_snack', originalPrice: 12500, promoPrice: 9900, unit: 'Pack 150g', imageUrl: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=500&auto=format&fit=crop&q=60', inStock: true, isFeatured: true },
  { id: 'p5', branchId: 'all', name: 'Yakult Minuman Probiotik (5 Botol)', category: 'minuman_snack', originalPrice: 11000, promoPrice: 9000, unit: 'Pack 5x65ml', imageUrl: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=500&auto=format&fit=crop&q=60', inStock: true, isFeatured: true },
  { id: 'p6', branchId: 'all', name: 'Kanzler Singles Sausage Original', category: 'minuman_snack', originalPrice: 9500, promoPrice: 6500, unit: 'Pcs 65g', imageUrl: 'https://images.unsplash.com/photo-1599599810769-bcde5a160d32?w=500&auto=format&fit=crop&q=60', inStock: true, isFeatured: true }
];

export const fetchStoreProducts = async (branchId?: string): Promise<StoreProduct[]> => {
  try {
    const { data, error } = await supabase.from('promo_products').select('*');
    if (error || !data) return FALLBACK_PRODUCTS;
    
    const mapped: StoreProduct[] = data.map((p) => ({
      id: p.id,
      branchId: p.branch_id || p.branchId || 'all',
      name: p.name,
      category: p.category || 'sembako',
      originalPrice: Number(p.original_price || p.originalPrice || 0),
      promoPrice: Number(p.promo_price || p.promoPrice || 0),
      unit: p.unit || 'Pcs',
      imageUrl: p.image_url || p.imageUrl || '',
      inStock: p.in_stock ?? p.inStock ?? true,
      isFeatured: p.is_featured ?? p.isFeatured ?? true
    }));

    if (mapped.length === 0) return [];
    if (!branchId || branchId === 'all') return mapped;
    const branchOnly = mapped.filter((p) => p.branchId === branchId || p.branchId === 'all');
    return branchOnly.length > 0 ? branchOnly : mapped;
  } catch (e) {
    console.error('Error di fetchStoreProducts:', e);
    return FALLBACK_PRODUCTS;
  }
};

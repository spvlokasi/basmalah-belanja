import { supabase } from './supabaseClient';
import { StoreBranch, StoreProduct, StoreVoucher } from '../types/storeTypes';

export const FALLBACK_BRANCHES: StoreBranch[] = [
  { id: 'br-01', code: 'M3017', name: 'TokoBASMALAH Bugih', address: 'Jl. Dirgahayu, Bugih', phone: '081234567890', city: 'Pamekasan', lat: -7.1595, lng: 113.4735 },
  { id: 'br-02', code: 'M3019', name: 'TokoBASMALAH Pademawu', address: 'Jl. Raya Pademawu', phone: '081234567891', city: 'Pamekasan', lat: -7.1852, lng: 113.5187 },
  { id: 'br-03', code: 'M3021', name: 'TokoBASMALAH Sotabar', address: 'Jl. Raya Sotabar, Pasean', phone: '081234567892', city: 'Pamekasan', lat: -6.8833, lng: 113.5500 },
  { id: 'br-04', code: 'M4016', name: 'TokoBASMALAH Kalianget', address: 'Jl. Raya Kalianget', phone: '081234567893', city: 'Sumenep', lat: -7.0514, lng: 113.8964 },
  { id: 'br-05', code: 'M1025', name: 'TokoBASMALAH Tengket', address: 'Jl. Raya Arosbaya', phone: '081234567894', city: 'Bangkalan', lat: -6.9500, lng: 112.8333 },
  { id: 'br-06', code: 'M1026', name: 'TokoBASMALAH Tlangoh', address: 'Jl. Raya Tanjungbumi', phone: '081234567895', city: 'Bangkalan', lat: -6.8833, lng: 112.9667 },
  { id: 'br-07', code: 'W1001', name: 'TokoBASMALAH Sidayu', address: 'Jl. Raya Sidayu', phone: '081234567896', city: 'Gresik', lat: -6.9833, lng: 112.5667 }
];

export const FALLBACK_PRODUCTS: StoreProduct[] = [
  { id: 'p1', branchId: 'all', name: 'Beras Premium Basmalah 5 KG', category: 'sembako', originalPrice: 74000, promoPrice: 68500, unit: '5 Kg / Sak', imageUrl: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=500&auto=format&fit=crop&q=60', inStock: true, isFeatured: true },
  { id: 'p2', branchId: 'all', name: 'Minyak Goreng Pouch 2 Liter', category: 'sembako', originalPrice: 37000, promoPrice: 33500, unit: 'Pouch 2L', imageUrl: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=500&auto=format&fit=crop&q=60', inStock: true, isFeatured: true },
  { id: 'p3', branchId: 'all', name: 'Gula Pasir Kristal Putih 1 KG', category: 'sembako', originalPrice: 18500, promoPrice: 16900, unit: 'Bungkus 1 Kg', imageUrl: 'https://images.unsplash.com/photo-1587735243615-c03f25aaff15?w=500&auto=format&fit=crop&q=60', inStock: true, isFeatured: true },
  { id: 'p4', branchId: 'all', name: 'Kopi Bubuk Asli Sidogiri Basmalah', category: 'minuman_snack', originalPrice: 12500, promoPrice: 9900, unit: 'Pack 150g', imageUrl: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=500&auto=format&fit=crop&q=60', inStock: true, isFeatured: true },
  { id: 'p5', branchId: 'all', name: 'Yakult Minuman Probiotik (5 Botol)', category: 'minuman_snack', originalPrice: 11000, promoPrice: 9000, unit: 'Pack 5x65ml', imageUrl: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=500&auto=format&fit=crop&q=60', inStock: true, isFeatured: true },
  { id: 'p6', branchId: 'all', name: 'Kanzler Singles Sausage Original', category: 'minuman_snack', originalPrice: 9500, promoPrice: 6500, unit: 'Pcs 65g', imageUrl: 'https://images.unsplash.com/photo-1599599810769-bcde5a160d32?w=500&auto=format&fit=crop&q=60', inStock: true, isFeatured: true }
];

export const FALLBACK_VOUCHERS: StoreVoucher[] = [
  { id: 'v-yakult', branchId: 'all', code: 'YAKUL2K', discountAmount: 2000, minSpend: 25000, quota: 100, claimedCount: 14, usedCount: 8, validUntil: '2026-12-31', isActive: true, description: 'Potongan Rp 2.000 produk sehat keluarga', sponsorName: 'Yakult' },
  { id: 'v-kanzler', branchId: 'all', code: 'KANZL3K', discountAmount: 3500, minSpend: 35000, quota: 150, claimedCount: 22, usedCount: 15, validUntil: '2026-12-31', isActive: true, description: 'Diskon Rp 3.500 festival frozen food', sponsorName: 'Kanzler' },
  { id: 'v-toko', branchId: 'all', code: 'BERKAH5K', discountAmount: 5000, minSpend: 50000, quota: 50, claimedCount: 8, usedCount: 4, validUntil: '2026-12-31', isActive: true, description: 'Potongan Rp 5.000 belanja sembako' }
];

export const fetchStoreBranches = async (): Promise<StoreBranch[]> => {
  try {
    const { data, error } = await supabase.from('branches').select('id, code, name, address, phone, city, lat, lng');
    if (error || !data || data.length === 0) return FALLBACK_BRANCHES;
    return data.map((b) => {
      const fallback = FALLBACK_BRANCHES.find((fb) => fb.code.toLowerCase() === (b.code || '').toLowerCase());
      return {
        id: b.id,
        code: b.code,
        name: b.name,
        address: b.address || fallback?.address || '',
        phone: b.phone || fallback?.phone || '081234567890',
        city: b.city || fallback?.city || 'Jawa Timur',
        lat: b.lat ?? fallback?.lat,
        lng: b.lng ?? fallback?.lng
      };
    });
  } catch { return FALLBACK_BRANCHES; }
};

export const fetchStoreProducts = async (branchId?: string): Promise<StoreProduct[]> => {
  try {
    const { data, error } = await supabase.from('promo_products').select('*');
    if (error || !data || data.length === 0) return FALLBACK_PRODUCTS;
    const mapped: StoreProduct[] = data.map((p) => ({
      id: p.id,
      branchId: p.branch_id || p.branchId || 'all',
      name: p.name,
      category: p.category || 'sembako',
      originalPrice: Number(p.original_price || p.originalPrice || 0),
      promoPrice: Number(p.promo_price || p.promoPrice || 0),
      unit: p.unit || 'Pcs',
      imageUrl: p.image_url || p.imageUrl,
      inStock: p.in_stock ?? p.inStock ?? true,
      isFeatured: p.is_featured ?? p.isFeatured ?? true
    }));
    if (!branchId || branchId === 'all') return mapped;
    const branchOnly = mapped.filter((p) => p.branchId === branchId || p.branchId === 'all');
    return branchOnly.length > 0 ? branchOnly : mapped;
  } catch {
    return FALLBACK_PRODUCTS;
  }
};

export const fetchStoreVouchers = async (branchId?: string): Promise<StoreVoucher[]> => {
  try {
    const { data, error } = await supabase.from('promo_vouchers').select('*');
    if (error || !data || data.length === 0) return FALLBACK_VOUCHERS;
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
      fundingSource: v.funding_source || v.fundingSource,
      sponsorName: v.sponsor_name || v.sponsorName
    }));
    if (!branchId || branchId === 'all') return mapped;
    const branchOnly = mapped.filter((v) => v.branchId === branchId || v.branchId === 'all');
    return branchOnly.length > 0 ? branchOnly : mapped;
  } catch {
    return FALLBACK_VOUCHERS;
  }
};

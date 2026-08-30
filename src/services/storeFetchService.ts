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
  { id: 'p5', branchId: 'all', name: 'Tebus Murah Wafer Coklat Renyah', category: 'promo_kasir', originalPrice: 9500, promoPrice: 4500, unit: 'Kaleng/Box', imageUrl: 'https://images.unsplash.com/photo-1599599810769-bcde5a160d32?w=500&auto=format&fit=crop&q=60', inStock: true, isFeatured: true }
];

export const FALLBACK_VOUCHERS: StoreVoucher[] = [
  { id: 'v1', branchId: 'all', code: 'BERKAH5K', discountAmount: 5000, minSpend: 50000, quota: 50, claimedCount: 8, usedCount: 4, validUntil: '2026-12-31', isActive: true, description: 'Potongan Rp 5.000 min. belanja Rp 50.000' },
  { id: 'v2', branchId: 'all', code: 'JUMATHEMAT', discountAmount: 3000, minSpend: 35000, quota: 30, claimedCount: 5, usedCount: 2, validUntil: '2026-12-31', isActive: true, description: 'Voucher hemat belanja akhir pekan min. Rp 35.000' }
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

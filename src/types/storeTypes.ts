export interface StoreBranch {
  id: string;
  code: string;
  name: string;
  address: string;
  phone: string;
  city: string;
  lat?: number;
  lng?: number;
  distanceKm?: number;
}

export interface StoreProduct {
  id: string;
  branchId: string;
  name: string;
  category: 'sembako' | 'minuman_snack' | 'kebersihan' | 'promo_kasir' | 'all';
  originalPrice: number;
  promoPrice: number;
  unit: string;
  imageUrl?: string;
  inStock: boolean;
  isFeatured?: boolean;
}

export interface StoreVoucher {
  id: string;
  branchId: string;
  code: string;
  discountAmount: number;
  minSpend: number;
  quota: number;
  claimedCount?: number;
  usedCount?: number;
  validUntil: string;
  isActive?: boolean;
  description: string;
  fundingSource?: 'store' | 'supplier' | 'joint';
  sponsorName?: string;
  applicableCategory?: string;
  applicableProductIds?: string[];
}

export interface CartItem {
  product: StoreProduct;
  quantity: number;
}

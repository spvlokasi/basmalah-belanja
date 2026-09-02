import { supabase } from '../supabaseClient';
import { StoreBranch } from '../../types/storeTypes';

export const FALLBACK_BRANCHES: StoreBranch[] = [];

export const fetchStoreBranches = async (): Promise<StoreBranch[]> => {
  try {
    const { data, error } = await supabase.from('branches').select('*');
    if (error || !data) return [];
    return data.map((b: any) => ({
      id: b.id,
      code: b.code || '',
      name: b.name || '',
      address: b.address || '',
      phone: (b.phone || '').trim(),
      deliveryHours: b.delivery_hours || '',
      city: b.city || '',
      lat: b.lat != null ? Number(b.lat) : undefined,
      lng: b.lng != null ? Number(b.lng) : undefined
    }));
  } catch (e) {
    console.error('Error di fetchStoreBranches:', e);
    return [];
  }
};

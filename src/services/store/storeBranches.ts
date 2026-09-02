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
      deliveryHours: b.delivery_hours || '07:00 - 20:30',
      city: b.city || 'Jawa Timur',
      lat: b.lat != null ? Number(b.lat) : -7.1595,
      lng: b.lng != null ? Number(b.lng) : 113.4735
    }));
  } catch (e) {
    console.error('Error di fetchStoreBranches:', e);
    return [];
  }
};

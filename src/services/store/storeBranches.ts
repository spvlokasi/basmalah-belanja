import { supabase } from '../supabaseClient';
import { StoreBranch } from '../../types/storeTypes';

export const FALLBACK_BRANCHES: StoreBranch[] = [
  { id: 'br-01', code: 'M3017', name: 'TokoBASMALAH Bugih', address: 'Jl. Dirgahayu, Bugih', phone: '081234567890', city: 'Pamekasan', lat: -7.1595, lng: 113.4735 },
  { id: 'br-1787160879162', code: 'M3019', name: 'TokoBASMALAH Pademawu', address: 'Jl. Raya Pademawu', phone: '082338465308', city: 'Pamekasan', lat: -7.1852, lng: 113.5187 },
  { id: 'br-1787368386910', code: 'M3021', name: 'TokoBASMALAH Sotabar', address: 'Jl. Raya Sotabar, Pasean', phone: '081234567892', city: 'Pamekasan', lat: -6.8833, lng: 113.5500 },
  { id: 'br-1787368904811', code: 'M4016', name: 'TokoBASMALAH Kalianget', address: 'Jl. Raya Kalianget', phone: '081234567893', city: 'Sumenep', lat: -7.0514, lng: 113.8964 },
  { id: 'br-1787368822218', code: 'M1025', name: 'TokoBASMALAH Tengket', address: 'Jl. Raya Arosbaya', phone: '081234567894', city: 'Bangkalan', lat: -6.9500, lng: 112.8333 },
  { id: 'br-1787368545312', code: 'M1026', name: 'TokoBASMALAH Tlangoh', address: 'Jl. Raya Tanjungbumi', phone: '081234567895', city: 'Bangkalan', lat: -6.8833, lng: 112.9667 },
  { id: 'br-1787336617789', code: 'W1001', name: 'TokoBASMALAH Sidayu', address: 'Jl. Raya Sidayu', phone: '081234567896', city: 'Gresik', lat: -6.9833, lng: 112.5667 }
];

export const fetchStoreBranches = async (): Promise<StoreBranch[]> => {
  try {
    const { data, error } = await supabase.from('branches').select('id, code, name, address, phone, delivery_hours, city, lat, lng');
    if (error || !data || data.length === 0) return FALLBACK_BRANCHES;
    return data.map((b) => {
      const fallback = FALLBACK_BRANCHES.find((fb) => fb.code.toLowerCase() === (b.code || '').toLowerCase());
      return {
        id: b.id,
        code: b.code,
        name: b.name,
        address: b.address || fallback?.address || '',
        phone: b.phone || fallback?.phone || '081234567890',
        deliveryHours: b.delivery_hours || fallback?.deliveryHours || '07:00 - 20:30',
        city: b.city || fallback?.city || 'Jawa Timur',
        lat: b.lat ?? fallback?.lat,
        lng: b.lng ?? fallback?.lng
      };
    });
  } catch {
    return FALLBACK_BRANCHES;
  }
};

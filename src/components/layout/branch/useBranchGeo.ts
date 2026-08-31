import { useState } from 'react';
import { StoreBranch } from '../../../types/storeTypes';

export function calculateDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

export const useBranchGeo = (branches: StoreBranch[]) => {
  const [isLocating, setIsLocating] = useState(false);
  const [locationSuccess, setLocationSuccess] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [sortedBranches, setSortedBranches] = useState<StoreBranch[]>(branches);

  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      setLocationError('Browser HP Anda belum mendukung fitur GPS otomatis.');
      return;
    }
    setIsLocating(true);
    setLocationError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const userLat = position.coords.latitude;
        const userLng = position.coords.longitude;
        const updated = branches.map((b) => {
          if (b.lat && b.lng) {
            return { ...b, distanceKm: calculateDistanceKm(userLat, userLng, b.lat, b.lng) };
          }
          return b;
        });
        updated.sort((a, b) => (a.distanceKm ?? 9999) - (b.distanceKm ?? 9999));
        setSortedBranches(updated);
        setIsLocating(false);
        setLocationSuccess(true);
      },
      (error) => {
        setIsLocating(false);
        setLocationError(error.code === error.PERMISSION_DENIED
          ? 'Izin akses lokasi ditolak. Silakan cari nama toko secara manual.'
          : 'Tidak dapat mendeteksi lokasi. Silakan pilih secara manual.');
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  return { isLocating, locationSuccess, locationError, sortedBranches, handleDetectLocation };
};

import React, { useState } from 'react';
import { MapPin, X, Check, Navigation, Search, Loader2, Sparkles, AlertCircle } from 'lucide-react';
import { StoreBranch } from '../../types/storeTypes';

interface BranchSelectorModalProps {
  branches: StoreBranch[];
  currentBranchId: string;
  onSelectBranch: (branch: StoreBranch) => void;
  onClose: () => void;
}

// Rumus Haversine untuk menghitung jarak antara 2 titik koordinat (km)
function calculateDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Radius bumi dalam km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10; // 1 angka desimal (contoh: 1.2 km)
}

export const BranchSelectorModal: React.FC<BranchSelectorModalProps> = ({
  branches, currentBranchId, onSelectBranch, onClose
}) => {
  const [searchQuery, setSearchQuery] = useState('');
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
            const dist = calculateDistanceKm(userLat, userLng, b.lat, b.lng);
            return { ...b, distanceKm: dist };
          }
          return b;
        });

        // Urutkan toko berdasarkan yang terdekat
        updated.sort((a, b) => (a.distanceKm ?? 9999) - (b.distanceKm ?? 9999));

        setSortedBranches(updated);
        setIsLocating(false);
        setLocationSuccess(true);

        // Jika toko terdekat ditemukan dan belum terpilih, kita bisa otomatis sorot
        if (updated.length > 0 && updated[0].distanceKm !== undefined) {
          // Tetap biarkan pengguna mengonfirmasi pilihannya
        }
      },
      (error) => {
        setIsLocating(false);
        if (error.code === error.PERMISSION_DENIED) {
          setLocationError('Izin akses lokasi ditolak. Silakan cari nama toko secara manual di bawah.');
        } else {
          setLocationError('Tidak dapat mendeteksi lokasi saat ini. Silakan pilih secara manual.');
        }
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  const filteredBranches = sortedBranches.filter((b) => {
    const query = searchQuery.toLowerCase();
    return (
      b.name.toLowerCase().includes(query) ||
      b.code.toLowerCase().includes(query) ||
      b.city.toLowerCase().includes(query) ||
      b.address.toLowerCase().includes(query)
    );
  });

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-md rounded-3xl p-5 sm:p-6 space-y-4 shadow-2xl animate-in zoom-in-95">
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-emerald-400" />
            <h3 className="text-sm sm:text-base font-extrabold text-white">Pilih Gerai Toko Terdekat</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1 rounded-lg">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tombol Deteksi GPS Otomatis (Nomor 2) */}
        <button
          type="button"
          onClick={handleDetectLocation}
          disabled={isLocating}
          className="w-full py-2.5 px-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white text-xs font-bold shadow-lg shadow-emerald-950/60 flex items-center justify-center gap-2 active:scale-98 transition-all disabled:opacity-50"
        >
          {isLocating ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-white" />
              <span>Mencari Toko Terdekat...</span>
            </>
          ) : (
            <>
              <Navigation className="w-4 h-4 text-emerald-100" />
              <span>🎯 Deteksi Toko Terdekat Saya</span>
            </>
          )}
        </button>

        {locationSuccess && (
          <div className="p-2.5 rounded-xl bg-emerald-950/60 border border-emerald-700/60 text-emerald-300 text-[11px] flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span>Toko berhasil diurutkan dari yang paling dekat dengan Anda!</span>
          </div>
        )}

        {locationError && (
          <div className="p-2.5 rounded-xl bg-rose-950/40 border border-rose-800 text-rose-300 text-[11px] flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
            <span>{locationError}</span>
          </div>
        )}

        {/* Kotak Pencarian Manual */}
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari nama toko, kecamatan, atau kota..."
            className="w-full bg-slate-800/80 border border-slate-700 text-slate-100 text-xs rounded-xl pl-9 pr-3 py-2.5 focus:outline-none focus:border-emerald-500"
          />
        </div>

        {/* Daftar Toko */}
        <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
          {filteredBranches.length === 0 ? (
            <div className="text-center py-6 text-xs text-slate-400">
              Toko dengan kata kunci "{searchQuery}" tidak ditemukan.
            </div>
          ) : (
            filteredBranches.map((b, idx) => {
              const isSelected = b.id === currentBranchId;
              const isNearest = locationSuccess && idx === 0 && b.distanceKm !== undefined;

              return (
                <button
                  key={b.id}
                  type="button"
                  onClick={() => {
                    onSelectBranch(b);
                    onClose();
                  }}
                  className={`w-full p-3 rounded-2xl text-left flex items-center justify-between gap-2.5 border transition-all ${
                    isSelected
                      ? 'bg-emerald-950/60 border-emerald-500 text-white shadow-md'
                      : 'bg-slate-800/60 hover:bg-slate-800 border-slate-700/80 text-slate-200'
                  }`}
                >
                  <div className="min-w-0 flex-1 space-y-0.5">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-[10px] font-mono font-bold text-emerald-400">
                        {b.code}
                      </span>
                      <h5 className="text-xs font-bold truncate text-white">{b.name}</h5>
                      {isNearest && (
                        <span className="px-1.5 py-0.5 rounded-full bg-emerald-500 text-slate-950 text-[9px] font-extrabold flex items-center gap-0.5">
                          ⭐ Terdekat
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-400 truncate">{b.address || b.city || 'Jawa Timur'}</p>
                    {b.distanceKm !== undefined && (
                      <div className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1 pt-0.5">
                        <MapPin className="w-3 h-3" />
                        <span>Jarak: <strong>~{b.distanceKm} km</strong> dari lokasi Anda</span>
                      </div>
                    )}
                  </div>

                  {isSelected && <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />}
                </button>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

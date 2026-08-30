import React, { useState } from 'react';
import { Navigation, Loader2, Check, ExternalLink } from 'lucide-react';

interface CartDeliveryFormProps {
  buyerName: string;
  address: string;
  coords: { lat: number; lng: number } | null;
  onBuyerNameChange: (val: string) => void;
  onAddressChange: (val: string) => void;
  onCoordsChange: (coords: { lat: number; lng: number } | null) => void;
}

export const CartDeliveryForm: React.FC<CartDeliveryFormProps> = ({
  buyerName, address, coords, onBuyerNameChange, onAddressChange, onCoordsChange
}) => {
  const [isLocating, setIsLocating] = useState(false);
  const [locError, setLocError] = useState<string | null>(null);

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      setLocError('GPS tidak didukung browser Anda.');
      return;
    }
    setIsLocating(true);
    setLocError(null);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        onCoordsChange({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setIsLocating(false);
      },
      (err) => {
        setIsLocating(false);
        setLocError(err.code === err.PERMISSION_DENIED ? 'Izin akses lokasi ditolak.' : 'Gagal mendeteksi titik GPS.');
      },
      { enableHighAccuracy: true, timeout: 12000 }
    );
  };

  const mapsUrl = coords ? `https://maps.google.com/?q=${coords.lat},${coords.lng}` : null;

  return (
    <div className="space-y-2 text-xs">
      <input
        type="text"
        value={buyerName}
        onChange={(e) => onBuyerNameChange(e.target.value)}
        placeholder="Nama Lengkap Anda..."
        className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-emerald-500"
      />
      <input
        type="text"
        value={address}
        onChange={(e) => onAddressChange(e.target.value)}
        placeholder="Alamat Pengiriman (Jalan, RT/RW, Patokan)..."
        className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-emerald-500"
      />
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <button
          type="button"
          onClick={handleGetLocation}
          disabled={isLocating}
          className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all ${
            coords ? 'bg-emerald-950/80 border border-emerald-500/80 text-emerald-300' : 'bg-slate-800 hover:bg-slate-750 border border-slate-700 text-emerald-400'
          }`}
        >
          {isLocating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : coords ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Navigation className="w-3.5 h-3.5 text-emerald-400" />}
          <span>{isLocating ? 'Mencari GPS...' : coords ? '✓ Titik Rumah Terkunci' : '🎯 Pin Titik Rumah (GPS)'}</span>
        </button>
        {coords && (
          <a href={mapsUrl || '#'} target="_blank" rel="noopener noreferrer" className="text-[10px] text-blue-400 hover:underline flex items-center gap-1">
            <ExternalLink className="w-3 h-3" />
            <span>Lihat di Maps</span>
          </a>
        )}
      </div>
      {locError && <p className="text-[10px] text-rose-400">{locError}</p>}
    </div>
  );
};

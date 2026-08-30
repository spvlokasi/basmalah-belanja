import React, { useState } from 'react';
import { ShoppingBag, X, Plus, Minus, Send, Tag } from 'lucide-react';
import { StoreBranch, CartItem, StoreVoucher } from '../../types/storeTypes';
import { formatRupiah } from '../../utils/formatters';

interface CartDrawerProps {
  branch: StoreBranch;
  items: CartItem[];
  appliedVoucher: StoreVoucher | null;
  onUpdateQty: (prodId: string, qty: number) => void;
  onClose: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  branch, items, appliedVoucher, onUpdateQty, onClose
}) => {
  const [buyerName, setBuyerName] = useState('');
  const [address, setAddress] = useState('');

  const subtotal = items.reduce((sum, i) => sum + i.product.promoPrice * i.quantity, 0);
  const discount = appliedVoucher && subtotal >= appliedVoucher.minSpend ? appliedVoucher.discountAmount : 0;
  const grandTotal = Math.max(0, subtotal - discount);

  const handleCheckoutWA = () => {
    if (!buyerName.trim() || !address.trim()) {
      alert('Silakan masukkan nama dan alamat pengiriman Anda terlebih dahulu.');
      return;
    }

    // Tandai voucher telah resmi dipakai belanja di localStorage
    if (appliedVoucher) {
      try {
        const raw = localStorage.getItem('basmalah_claimed_vouchers');
        const claims = raw ? JSON.parse(raw) : {};
        claims[appliedVoucher.code] = { claimedAt: Date.now(), isUsed: true };
        localStorage.setItem('basmalah_claimed_vouchers', JSON.stringify(claims));
      } catch (e) {
        console.error('Error saving used voucher state:', e);
      }
    }

    const lines = items.map((i) => `• ${i.quantity}x ${i.product.name} (${formatRupiah(i.product.promoPrice * i.quantity)})`);
    let msg = `*PESANAN BELANJA ONLINE TOKOBASMALAH*\n` +
      `🏪 Gerai: ${branch.name}\n` +
      `👤 Pembeli: ${buyerName.trim()}\n` +
      `📍 Alamat Antar: ${address.trim()}\n\n` +
      `*Daftar Belanja:*\n${lines.join('\n')}\n\n` +
      `Subtotal: ${formatRupiah(subtotal)}\n`;
    if (discount > 0) msg += `🏷️ Kupon Diskon (${appliedVoucher?.code}): -${formatRupiah(discount)}\n`;
    msg += `*TOTAL BAYAR: ${formatRupiah(grandTotal)} (COD/Bayar di Tempat)*\n\n` +
      `Mohon segera diproses dan diantar ya TokoBasmalah. Terima kasih!`;

    const phone = (branch.phone || '6281234567890').replace(/\D/g, '');
    const cleanPhone = phone.startsWith('0') ? '62' + phone.slice(1) : phone;
    window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex justify-end">
      <div className="bg-slate-900 border-l border-slate-800 w-full max-w-md h-full flex flex-col justify-between p-4 sm:p-5 shadow-2xl animate-in slide-in-from-right">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-emerald-400" />
            <h3 className="text-sm font-bold text-white">Keranjang Belanja ({items.length})</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1 rounded-lg">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-3 space-y-2.5">
          {items.length === 0 ? (
            <p className="text-center text-xs text-slate-500 py-10">Keranjang belanja Anda masih kosong.</p>
          ) : (
            items.map((i) => (
              <div key={i.product.id} className="bg-slate-850 p-2.5 rounded-xl border border-slate-800 flex items-center justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <h5 className="text-xs font-bold text-slate-200 truncate">{i.product.name}</h5>
                  <div className="text-[11px] text-emerald-400 font-mono font-semibold">{formatRupiah(i.product.promoPrice)}</div>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => onUpdateQty(i.product.id, i.quantity - 1)} className="p-1 rounded-lg bg-slate-800 text-slate-300">
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="text-xs font-bold text-white font-mono">{i.quantity}</span>
                  <button onClick={() => onUpdateQty(i.product.id, i.quantity + 1)} className="p-1 rounded-lg bg-slate-800 text-slate-300">
                    <Plus className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="pt-3 border-t border-slate-800 space-y-2.5 text-xs">
          <input
            type="text"
            value={buyerName}
            onChange={(e) => setBuyerName(e.target.value)}
            placeholder="Nama Lengkap Anda..."
            className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-emerald-500"
          />
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Alamat Pengiriman Lengkap (Jalan, RT/RW, Patokan)..."
            className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-emerald-500"
          />
          <div className="flex justify-between text-slate-400">
            <span>Subtotal:</span>
            <strong className="text-slate-200 font-mono">{formatRupiah(subtotal)}</strong>
          </div>
          {discount > 0 && (
            <div className="flex justify-between text-emerald-400">
              <span className="flex items-center gap-1"><Tag className="w-3.5 h-3.5" /> Kupon ({appliedVoucher?.code}):</span>
              <strong className="font-mono">-{formatRupiah(discount)}</strong>
            </div>
          )}
          <div className="flex justify-between text-sm font-bold text-white pt-1 border-t border-slate-800">
            <span>Total Tagihan:</span>
            <strong className="text-emerald-400 font-mono text-base">{formatRupiah(grandTotal)}</strong>
          </div>
          <button
            onClick={handleCheckoutWA}
            disabled={items.length === 0}
            className="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 disabled:opacity-50 text-white rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/60 active:scale-95 transition-all"
          >
            <Send className="w-4 h-4" />
            <span>Kirim Pesanan via WhatsApp (COD)</span>
          </button>
        </div>
      </div>
    </div>
  );
};

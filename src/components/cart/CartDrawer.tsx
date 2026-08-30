import React, { useState } from 'react';
import { ShoppingBag, X, Plus, Minus, Send, Tag, Sparkles, Check, ChevronDown, ChevronUp, AlertCircle } from 'lucide-react';
import { StoreBranch, CartItem, StoreVoucher } from '../../types/storeTypes';
import { formatRupiah } from '../../utils/formatters';
import { supabase } from '../../services/supabaseClient';

interface CartDrawerProps {
  branch: StoreBranch;
  items: CartItem[];
  vouchers: StoreVoucher[];
  appliedVoucher: StoreVoucher | null;
  onSelectVoucher: (voucher: StoreVoucher | null) => void;
  onUpdateQty: (prodId: string, qty: number) => void;
  onClose: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  branch, items, vouchers, appliedVoucher, onSelectVoucher, onUpdateQty, onClose
}) => {
  const [buyerName, setBuyerName] = useState('');
  const [address, setAddress] = useState('');
  const [showVoucherSelector, setShowVoucherSelector] = useState(true);

  const subtotal = items.reduce((sum, i) => sum + i.product.promoPrice * i.quantity, 0);

  // Evaluasi Kelayakan Voucher secara Cerdas & Kontekstual
  const checkVoucherEligibility = (v: StoreVoucher) => {
    // 1. Cek Syarat Produk Sponsor Brand (misal: Yakult atau Kanzler)
    if (v.sponsorName) {
      const sLower = v.sponsorName.toLowerCase();
      const hasSponsorItem = items.some((i) => i.product.name.toLowerCase().includes(sLower));
      if (!hasSponsorItem) {
        return {
          isEligible: false,
          reason: `Khusus pembelian produk ${v.sponsorName} (Tambahkan produk ${v.sponsorName} ke keranjang)`
        };
      }
    }

    // 2. Cek Syarat Kategori Produk
    if (v.applicableCategory && v.applicableCategory !== 'all') {
      const hasCategoryItem = items.some((i) => i.product.category === v.applicableCategory);
      if (!hasCategoryItem) {
        return {
          isEligible: false,
          reason: `Khusus produk kategori ${v.applicableCategory}`
        };
      }
    }

    // 3. Cek Syarat Minimal Belanja
    if (subtotal < v.minSpend) {
      return {
        isEligible: false,
        reason: `Belanja ${formatRupiah(v.minSpend - subtotal)} lagi untuk pakai kupon ini`
      };
    }

    return {
      isEligible: true,
      reason: `✓ Syarat terpenuhi (Hemat ${formatRupiah(v.discountAmount)})`
    };
  };

  const currentVoucherCheck = appliedVoucher ? checkVoucherEligibility(appliedVoucher) : null;
  const isCurrentVoucherValid = currentVoucherCheck?.isEligible ?? false;
  const discount = isCurrentVoucherValid && appliedVoucher ? appliedVoucher.discountAmount : 0;
  const grandTotal = Math.max(0, subtotal - discount);

  const handleCheckoutWA = async () => {
    if (!buyerName.trim() || !address.trim()) {
      alert('Silakan masukkan nama dan alamat pengiriman Anda terlebih dahulu.');
      return;
    }

    // Tandai voucher telah resmi dipakai belanja di localStorage
    if (appliedVoucher && isCurrentVoucherValid) {
      try {
        const raw = localStorage.getItem('basmalah_claimed_vouchers');
        const claims = raw ? JSON.parse(raw) : {};
        claims[appliedVoucher.code] = { claimedAt: Date.now(), isUsed: true };
        localStorage.setItem('basmalah_claimed_vouchers', JSON.stringify(claims));
      } catch (e) {
        console.error('Error saving used voucher state:', e);
      }
    }

    // Catat Pesanan Masuk (Order Logs)
    const orderData = {
      id: `ORD-${Date.now().toString().slice(-6)}`,
      branch_id: branch.id,
      branch_code: branch.code,
      branch_name: branch.name,
      buyer_name: buyerName.trim(),
      address: address.trim(),
      items: items.map((i) => ({ name: i.product.name, qty: i.quantity, price: i.product.promoPrice })),
      subtotal,
      discount,
      voucher_code: isCurrentVoucherValid ? appliedVoucher?.code || null : null,
      grand_total: grandTotal,
      created_at: new Date().toISOString(),
      status: 'pending_delivery'
    };

    try {
      const rawOrders = localStorage.getItem('basmalah_customer_orders');
      const orderList = rawOrders ? JSON.parse(rawOrders) : [];
      localStorage.setItem('basmalah_customer_orders', JSON.stringify([orderData, ...orderList]));

      // Kirim juga ke Supabase jika tabel online_orders tersedia
      await supabase.from('online_orders').insert([orderData]).select().maybeSingle();
    } catch {
      // Graceful fallback
    }

    const lines = items.map((i) => `• ${i.quantity}x ${i.product.name} (${formatRupiah(i.product.promoPrice * i.quantity)})`);
    let msg = `*PESANAN BELANJA ONLINE TOKOBASMALAH*\n` +
      `🆔 No. Order: ${orderData.id}\n` +
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

  const activeVouchers = vouchers.filter((v) => v.isActive !== false);

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

        <div className="flex-1 overflow-y-auto py-3 space-y-3">
          {/* Daftar Barang */}
          {items.length === 0 ? (
            <p className="text-center text-xs text-slate-500 py-10">Keranjang belanja Anda masih kosong.</p>
          ) : (
            <div className="space-y-2">
              {items.map((i) => (
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
              ))}
            </div>
          )}

          {/* Pilihan Kupon Diskon Pintar di Dalam Keranjang */}
          {items.length > 0 && activeVouchers.length > 0 && (
            <div className="bg-slate-850 rounded-2xl border border-slate-800 p-3 space-y-2">
              <div
                className="flex items-center justify-between cursor-pointer"
                onClick={() => setShowVoucherSelector(!showVoucherSelector)}
              >
                <span className="font-extrabold text-xs text-amber-400 flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-amber-400" />
                  <span>Pilih Kupon Diskon ({activeVouchers.length})</span>
                </span>
                <div className="flex items-center gap-1 text-[11px] text-slate-400">
                  {appliedVoucher && isCurrentVoucherValid ? (
                    <span className="text-emerald-400 font-bold font-mono">-{formatRupiah(discount)}</span>
                  ) : (
                    <span>Lihat Kupon</span>
                  )}
                  {showVoucherSelector ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                </div>
              </div>

              {showVoucherSelector && (
                <div className="space-y-1.5 pt-1 border-t border-slate-800">
                  {activeVouchers.map((v) => {
                    const check = checkVoucherEligibility(v);
                    const isSelected = appliedVoucher?.code === v.code;
                    return (
                      <div
                        key={v.id}
                        className={`p-2.5 rounded-xl border flex items-center justify-between gap-2 transition-all ${
                          isSelected && check.isEligible
                            ? 'bg-emerald-950/70 border-emerald-500 text-white'
                            : check.isEligible
                            ? 'bg-slate-900 border-slate-700 hover:border-slate-600'
                            : 'bg-slate-900/60 border-slate-800/80 opacity-75'
                        }`}
                      >
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="px-1.5 py-0.5 rounded bg-amber-400 text-slate-950 font-mono font-black text-[9px]">
                              {v.code}
                            </span>
                            <strong className="text-emerald-400 font-black text-[11px]">
                              Hemat {formatRupiah(v.discountAmount)}
                            </strong>
                            {v.sponsorName && (
                              <span className="text-[9px] text-blue-300 bg-blue-950/80 px-1.5 py-0.2 rounded border border-blue-800/80 font-bold flex items-center gap-0.5">
                                <Sparkles className="w-2.5 h-2.5 text-blue-400" />
                                {v.sponsorName}
                              </span>
                            )}
                          </div>
                          <p className={`text-[10px] mt-1 ${check.isEligible ? 'text-emerald-400 font-semibold' : 'text-slate-400'}`}>
                            {check.reason}
                          </p>
                        </div>

                        <button
                          type="button"
                          disabled={!check.isEligible}
                          onClick={() => onSelectVoucher(isSelected ? null : v)}
                          className={`px-3 py-1.5 rounded-xl text-[10px] font-black transition-all flex-shrink-0 ${
                            isSelected && check.isEligible
                              ? 'bg-emerald-500 text-slate-950 shadow-md'
                              : check.isEligible
                              ? 'bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 shadow-md shadow-amber-950/60 active:scale-95'
                              : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                          }`}
                        >
                          {isSelected && check.isEligible ? '✓ Terpakai' : 'Gunakan'}
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
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

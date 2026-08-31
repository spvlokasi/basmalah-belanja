import { useState } from 'react';
import { StoreBranch, CartItem, StoreVoucher } from '../../types/storeTypes';
import { formatRupiah } from '../../utils/formatters';
import { supabase } from '../../services/supabaseClient';

export const useCartCheckout = (
  branch: StoreBranch,
  items: CartItem[],
  appliedVoucher: StoreVoucher | null
) => {
  const [buyerName, setBuyerName] = useState('');
  const [address, setAddress] = useState('');
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);

  const subtotal = items.reduce((sum, i) => sum + i.product.promoPrice * i.quantity, 0);
  const discount = appliedVoucher ? appliedVoucher.discountAmount : 0;
  const grandTotal = Math.max(0, subtotal - discount);
  const mapsUrl = coords ? `https://maps.google.com/?q=${coords.lat},${coords.lng}` : null;

  const handleCheckoutWA = async () => {
    if (!buyerName.trim() || (!address.trim() && !coords)) {
      alert('Silakan isi nama dan alamat pengiriman Anda (atau klik Pin GPS).');
      return;
    }

    const orderData = {
      id: `ORD-${Date.now().toString().slice(-6)}`,
      branch_id: branch.id,
      branch_code: branch.code,
      branch_name: branch.name,
      buyer_name: buyerName.trim(),
      address: address.trim() || 'Sesuai titik GPS Maps',
      maps_url: mapsUrl,
      lat: coords?.lat,
      lng: coords?.lng,
      items: items.map((i) => ({ name: i.product.name, qty: i.quantity, price: i.product.promoPrice })),
      subtotal,
      discount,
      voucher_code: appliedVoucher?.code || null,
      grand_total: grandTotal,
      created_at: new Date().toISOString(),
      status: 'pending_delivery'
    };

    try {
      const raw = localStorage.getItem('basmalah_customer_orders');
      const list = raw ? JSON.parse(raw) : [];
      localStorage.setItem('basmalah_customer_orders', JSON.stringify([orderData, ...list]));
      await supabase.from('online_orders').insert([orderData]).select().maybeSingle();

      // Trigger otomatis: Tambah statistik used_count pada voucher di Supabase
      if (appliedVoucher) {
        const nextUsed = (appliedVoucher.usedCount || 0) + 1;
        await supabase.from('promo_vouchers').update({
          used_count: nextUsed,
          updated_at: new Date().toISOString()
        }).eq('id', appliedVoucher.id);
      }
    } catch (e) {
      console.warn('Simpan order fallback:', e);
    }

    const lines = items.map((i) => `• ${i.quantity}x ${i.product.name} (${formatRupiah(i.product.promoPrice * i.quantity)})`);
    let msg = `*PESANAN BELANJA ONLINE TOKOBASMALAH*\n` +
      `🆔 No. Order: ${orderData.id}\n🏪 Gerai: ${branch.name}\n👤 Pembeli: ${buyerName.trim()}\n📍 Alamat: ${address.trim() || 'Sesuai Pin Maps'}\n`;
    if (mapsUrl) msg += `🗺️ Titik Navigasi Maps: ${mapsUrl}\n`;
    msg += `\n*Daftar Belanja:*\n${lines.join('\n')}\n\nSubtotal: ${formatRupiah(subtotal)}\n`;
    if (discount > 0) msg += `🏷️ Kupon Diskon (${appliedVoucher?.code}): -${formatRupiah(discount)}\n`;
    msg += `*TOTAL BAYAR: ${formatRupiah(grandTotal)} (COD)*\n\nMohon segera diproses dan diantar ya TokoBasmalah. Terima kasih!`;

    const phone = (branch.phone || '6281234567890').replace(/\D/g, '');
    const cleanPhone = phone.startsWith('0') ? '62' + phone.slice(1) : phone;
    window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  return {
    buyerName, address, coords, subtotal, discount, grandTotal,
    setBuyerName, setAddress, setCoords, handleCheckoutWA
  };
};

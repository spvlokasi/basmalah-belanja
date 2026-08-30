import React, { useState } from 'react';
import { ShoppingBag, X } from 'lucide-react';
import { StoreBranch, CartItem, StoreVoucher } from '../../types/storeTypes';
import { formatRupiah } from '../../utils/formatters';
import { supabase } from '../../services/supabaseClient';
import { CartItemList } from './CartItemList';
import { CartVoucherSelector } from './CartVoucherSelector';
import { CartDeliveryForm } from './CartDeliveryForm';
import { CartSummaryFooter } from './CartSummaryFooter';

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
    } catch {
      // Fallback local
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
          <CartItemList items={items} onUpdateQty={onUpdateQty} />
          <CartVoucherSelector vouchers={vouchers} items={items} subtotal={subtotal} appliedVoucher={appliedVoucher} onSelectVoucher={onSelectVoucher} />
        </div>

        <div className="pt-2 space-y-2">
          <CartDeliveryForm
            buyerName={buyerName}
            address={address}
            coords={coords}
            onBuyerNameChange={setBuyerName}
            onAddressChange={setAddress}
            onCoordsChange={setCoords}
          />
          <CartSummaryFooter
            subtotal={subtotal}
            discount={discount}
            grandTotal={grandTotal}
            appliedVoucher={appliedVoucher}
            itemsCount={items.length}
            onCheckout={handleCheckoutWA}
          />
        </div>
      </div>
    </div>
  );
};

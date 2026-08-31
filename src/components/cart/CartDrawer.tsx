import React from 'react';
import { ShoppingBag, X } from 'lucide-react';
import { StoreBranch, CartItem, StoreVoucher } from '../../types/storeTypes';
import { CartItemList } from './CartItemList';
import { CartVoucherSelector } from './CartVoucherSelector';
import { CartDeliveryForm } from './CartDeliveryForm';
import { CartSummaryFooter } from './CartSummaryFooter';
import { useCartCheckout } from './useCartCheckout';

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
  const {
    buyerName, address, coords, subtotal, discount, grandTotal,
    setBuyerName, setAddress, setCoords, handleCheckoutWA
  } = useCartCheckout(branch, items, appliedVoucher);

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

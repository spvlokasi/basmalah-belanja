import { useState } from 'react';
import { CartItem, StoreProduct, StoreVoucher } from '../types/storeTypes';

export const useStoreCart = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [appliedVoucher, setAppliedVoucher] = useState<StoreVoucher | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const handleAddToCart = (product: StoreProduct) => {
    const existing = cart.find((i) => i.product.id === product.id);
    if (existing) {
      setCart(cart.map((i) => (i.product.id === product.id ? { ...i, quantity: i.quantity + 1 } : i)));
    } else {
      setCart([...cart, { product, quantity: 1 }]);
    }
  };

  const handleUpdateQty = (prodId: string, qty: number) => {
    if (qty <= 0) setCart(cart.filter((i) => i.product.id !== prodId));
    else setCart(cart.map((i) => (i.product.id === prodId ? { ...i, quantity: qty } : i)));
  };

  const cartCounts = cart.reduce((acc, i) => ({ ...acc, [i.product.id]: i.quantity }), {} as Record<string, number>);
  const totalItems = cart.reduce((sum, i) => sum + i.quantity, 0);
  const subtotal = cart.reduce((sum, i) => sum + i.product.promoPrice * i.quantity, 0);

  return {
    cart, appliedVoucher, isCartOpen, cartCounts, totalItems, subtotal,
    setAppliedVoucher, setIsCartOpen, handleAddToCart, handleUpdateQty
  };
};

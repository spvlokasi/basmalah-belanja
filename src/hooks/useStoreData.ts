import { useState, useEffect } from 'react';
import { StoreBranch, StoreProduct, StoreVoucher } from '../types/storeTypes';
import { fetchStoreBranches, fetchStoreProducts, fetchStoreVouchers, FALLBACK_BRANCHES, FALLBACK_PRODUCTS, FALLBACK_VOUCHERS } from '../services/storeFetchService';
import { supabase } from '../services/supabaseClient';

export const useStoreData = () => {
  const [branches, setBranches] = useState<StoreBranch[]>(FALLBACK_BRANCHES);
  const [currentBranch, setCurrentBranch] = useState<StoreBranch>(FALLBACK_BRANCHES[0]);
  const [isLockedBranch, setIsLockedBranch] = useState(false);
  const [products, setProducts] = useState<StoreProduct[]>(FALLBACK_PRODUCTS);
  const [vouchers, setVouchers] = useState<StoreVoucher[]>(FALLBACK_VOUCHERS);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tokoCode = params.get('toko') || params.get('cabang');
    if (tokoCode) setIsLockedBranch(true);

    fetchStoreBranches().then((list) => {
      setBranches(list);
      if (tokoCode) {
        const found = list.find((b) => b.code.toLowerCase() === tokoCode.toLowerCase());
        if (found) setCurrentBranch(found);
      }
    });
  }, []);

  useEffect(() => {
    if (currentBranch) {
      fetchStoreProducts(currentBranch.id).then(setProducts);
      fetchStoreVouchers(currentBranch.id).then(setVouchers);

      const channel = supabase
        .channel(`public_catalog_sync_${currentBranch.id}`)
        .on('postgres_changes', { event: '*', schema: 'public', table: 'promo_products' }, () => {
          fetchStoreProducts(currentBranch.id).then(setProducts);
        })
        .on('postgres_changes', { event: '*', schema: 'public', table: 'promo_vouchers' }, () => {
          fetchStoreVouchers(currentBranch.id).then(setVouchers);
        })
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [currentBranch]);

  return { branches, currentBranch, isLockedBranch, products, vouchers, setCurrentBranch };
};

import { useState, useEffect } from 'react';
import { StoreBranch, StoreProduct, StoreVoucher } from '../types/storeTypes';
import { fetchStoreBranches, fetchStoreProducts, fetchStoreVouchers, FALLBACK_BRANCHES, FALLBACK_PRODUCTS, FALLBACK_VOUCHERS } from '../services/storeFetchService';
import { supabase } from '../services/supabaseClient';

const getInitialBranch = (): StoreBranch => {
  if (typeof window === 'undefined') return FALLBACK_BRANCHES[0];
  const params = new URLSearchParams(window.location.search);
  const tokoCode = params.get('toko') || params.get('cabang');
  if (tokoCode) {
    const cleanQuery = tokoCode.toLowerCase().replace(/[^a-z0-9]/g, '');
    const found = FALLBACK_BRANCHES.find((b) => {
      const cleanCode = b.code.toLowerCase().replace(/[^a-z0-9]/g, '');
      const cleanName = b.name.toLowerCase().replace(/[^a-z0-9]/g, '');
      return cleanCode === cleanQuery || cleanName.includes(cleanQuery) || cleanQuery.includes(cleanName) || cleanName.includes(cleanQuery.replace('tokobasmalah', ''));
    });
    if (found) return found;
  }
  return FALLBACK_BRANCHES[0];
};

const formatOfficialStoreParam = (name: string) => {
  const clean = name.replace(/\s+/g, '').replace(/tokobasmalah/i, '');
  return `TokoBasmalah${clean.charAt(0).toUpperCase() + clean.slice(1)}`;
};

export const useStoreData = () => {
  const [branches, setBranches] = useState<StoreBranch[]>(FALLBACK_BRANCHES);
  const [currentBranch, setCurrentBranch] = useState<StoreBranch>(getInitialBranch);
  const [isLockedBranch, setIsLockedBranch] = useState(() => {
    if (typeof window === 'undefined') return false;
    const params = new URLSearchParams(window.location.search);
    return Boolean(params.get('toko') || params.get('cabang'));
  });
  const [products, setProducts] = useState<StoreProduct[]>(FALLBACK_PRODUCTS);
  const [vouchers, setVouchers] = useState<StoreVoucher[]>(FALLBACK_VOUCHERS);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tokoCode = params.get('toko') || params.get('cabang');
    if (tokoCode) setIsLockedBranch(true);

    fetchStoreBranches().then((list) => {
      setBranches(list);
      if (tokoCode) {
        const cleanQuery = tokoCode.toLowerCase().replace(/[^a-z0-9]/g, '');
        const found = list.find((b) => {
          const cleanCode = b.code.toLowerCase().replace(/[^a-z0-9]/g, '');
          const cleanName = b.name.toLowerCase().replace(/[^a-z0-9]/g, '');
          return cleanCode === cleanQuery || cleanName.includes(cleanQuery) || cleanQuery.includes(cleanName) || cleanName.includes(cleanQuery.replace('tokobasmalah', ''));
        });
        if (found) {
          setCurrentBranch(found);
          const officialParam = formatOfficialStoreParam(found.name);
          if (tokoCode !== officialParam) {
            const newUrl = `${window.location.pathname}?toko=${officialParam}`;
            window.history.replaceState(null, '', newUrl);
          }
        }
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

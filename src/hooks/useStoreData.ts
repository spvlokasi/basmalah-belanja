import { useState, useEffect } from 'react';
import { StoreBranch, StoreProduct, StoreVoucher } from '../types/storeTypes';
import { fetchStoreBranches, fetchStoreProducts, fetchStoreVouchers } from '../services/storeFetchService';
import { supabase } from '../services/supabaseClient';

const EMPTY_BRANCH: StoreBranch = {
  id: '',
  code: '',
  name: 'TokoBASMALAH',
  address: '',
  phone: '',
  deliveryHours: '07:00 - 20:30',
  city: 'Jawa Timur',
  lat: -7.1595,
  lng: 113.4735
};

const formatOfficialStoreParam = (name: string) => {
  const clean = name.replace(/\s+/g, '').replace(/tokobasmalah/i, '');
  return `TokoBasmalah${clean.charAt(0).toUpperCase() + clean.slice(1)}`;
};

export const useStoreData = () => {
  const [branches, setBranches] = useState<StoreBranch[]>([]);
  const [currentBranch, setCurrentBranch] = useState<StoreBranch>(EMPTY_BRANCH);
  const [isLockedBranch, setIsLockedBranch] = useState(() => {
    if (typeof window === 'undefined') return false;
    const params = new URLSearchParams(window.location.search);
    return Boolean(params.get('toko') || params.get('cabang'));
  });
  const [isLoading, setIsLoading] = useState(true);
  const [products, setProducts] = useState<StoreProduct[]>([]);
  const [vouchers, setVouchers] = useState<StoreVoucher[]>([]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tokoCode = params.get('toko') || params.get('cabang');
    if (tokoCode) setIsLockedBranch(true);

    fetchStoreBranches().then((list) => {
      setBranches(list);
      if (list.length === 0) return;

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
        } else {
          setCurrentBranch(list[0]);
        }
      } else {
        setCurrentBranch(list[0]);
      }
    });
  }, []);

  useEffect(() => {
    if (currentBranch) {
      setIsLoading(true);
      Promise.all([
        fetchStoreProducts(currentBranch.id),
        fetchStoreVouchers(currentBranch.id)
      ]).then(([prods, pouchs]) => {
        setProducts(prods);
        setVouchers(pouchs);
        setIsLoading(false);
      }).catch(() => {
        setIsLoading(false);
      });

      const channel = supabase
        .channel(`public_catalog_sync_${currentBranch.id}`)
        .on('postgres_changes', { event: '*', schema: 'public', table: 'promo_products' }, () => {
          fetchStoreProducts(currentBranch.id).then(setProducts);
        })
        .on('postgres_changes', { event: '*', schema: 'public', table: 'promo_vouchers' }, () => {
          fetchStoreVouchers(currentBranch.id).then(setVouchers);
        })
        .on('postgres_changes', { event: '*', schema: 'public', table: 'branches' }, () => {
          fetchStoreBranches().then((list) => {
            setBranches(list);
            const found = list.find((b) => b.id === currentBranch.id || b.code.toLowerCase() === currentBranch.code.toLowerCase());
            if (found) setCurrentBranch(found);
          });
        })
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [currentBranch]);

  return { branches, currentBranch, isLockedBranch, isLoading, products, vouchers, setCurrentBranch };
};

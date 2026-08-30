import React from 'react';
import { Plus, Check, Image as ImageIcon, Tag } from 'lucide-react';
import { StoreProduct } from '../../types/storeTypes';
import { formatRupiah } from '../../utils/formatters';

interface ProductCardProps {
  product: StoreProduct;
  cartCount: number;
  hasVoucher?: boolean;
  onAddToCart: (p: StoreProduct) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product, cartCount, hasVoucher, onAddToCart
}) => {
  const diskonPct = Math.round(((product.originalPrice - product.promoPrice) / product.originalPrice) * 100);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-lg flex flex-col justify-between group hover:border-emerald-500/50 transition-all">
      <div className="relative aspect-square bg-slate-850 flex items-center justify-center overflow-hidden">
        {product.imageUrl ? (
          <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
        ) : (
          <ImageIcon className="w-10 h-10 text-slate-700" />
        )}
        {diskonPct > 0 && (
          <span className="absolute top-2 left-2 px-2 py-0.5 rounded-lg bg-rose-600 text-white font-black text-[10px] shadow">
            Hemat {diskonPct}%
          </span>
        )}
        {hasVoucher && (
          <span className="absolute bottom-2 left-2 px-1.5 py-0.5 rounded-md bg-amber-400 text-slate-950 font-black text-[9px] shadow-md flex items-center gap-0.5">
            <Tag className="w-2.5 h-2.5" />
            <span>Ada Kupon</span>
          </span>
        )}
      </div>

      <div className="p-3 space-y-2 flex-1 flex flex-col justify-between">
        <div>
          <h4 className="text-xs font-bold text-white line-clamp-2 leading-tight">{product.name}</h4>
          <span className="text-[10px] text-slate-400 block mt-0.5">{product.unit}</span>
        </div>

        <div className="space-y-2 pt-1 border-t border-slate-800/80">
          <div>
            <div className="text-[10px] text-slate-500 line-through font-mono">{formatRupiah(product.originalPrice)}</div>
            <div className="text-sm font-black text-emerald-400 font-mono">{formatRupiah(product.promoPrice)}</div>
          </div>

          <button
            type="button"
            onClick={() => onAddToCart(product)}
            className={`w-full py-2 px-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow ${
              cartCount > 0
                ? 'bg-emerald-600 text-white shadow-emerald-950/60'
                : 'bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700'
            }`}
          >
            {cartCount > 0 ? <Check className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
            <span>{cartCount > 0 ? `+${cartCount} di Keranjang` : '+ Beli'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

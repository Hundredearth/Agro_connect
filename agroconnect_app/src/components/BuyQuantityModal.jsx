import React, { useState } from 'react';
import { X, Check, AlertTriangle } from 'lucide-react';
import { useRole } from '../context/RoleContext';

// Props: open (bool), onClose (func), product (object), onPurchase (func)
const BuyQuantityModal = ({ open, onClose, product, onPurchase }) => {
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState('');
  const { t } = useRole();

  if (!open || !product) return null;

  const handleQuantityChange = (val) => {
    setError('');
    const num = Number(val);
    
    if (isNaN(num) || num < 1) {
      setQuantity(1);
      return;
    }

    if (num > product.stock) {
      setQuantity(product.stock);
      setError(t("Maximum available stock is {product.stock} units.").replace("{product.stock}", product.stock));
    } else {
      setQuantity(num);
    }
  };

  const handleConfirm = async () => {
    if (quantity > product.stock) {
      setError(t("Cannot buy more than available stock ({product.stock}).").replace("{product.stock}", product.stock));
      return;
    }
    try {
      await onPurchase(product.id, quantity);
      onClose();
    } catch (err) {
      console.error('Purchase error', err);
    }
  };

  return (
    <div className="fixed inset-0 z-[250] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
      <div className="glass-card w-full max-w-sm p-6 rounded-[36px] bg-white border border-white shadow-2xl space-y-5 relative">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="font-display-lg text-primary text-xl font-black">{t("Place Request")}</h3>
            <p className="text-[9px] text-on-surface-variant/40 font-black uppercase tracking-widest">{t("Select order volume")}</p>
          </div>
          <button 
            onClick={onClose} 
            className="bg-surface-container/50 text-primary p-2 rounded-full active:scale-90 transition-all hover:bg-error/5 hover:text-error"
          >
            <X size={16} />
          </button>
        </div>

        {/* Product Details Header */}
        <div className="p-4 rounded-2xl bg-surface-container/30 border border-outline-variant/10 space-y-1">
          <p className="text-[10px] text-on-surface-variant/50 font-black uppercase tracking-wider">{t("Product")}</p>
          <p className="text-sm font-black text-primary leading-snug">{product.name}</p>
          <div className="flex justify-between items-center pt-2">
            <span className="text-xs text-secondary font-black">${product.price} / {t("unit")}</span>
            <span className="px-2.5 py-1 bg-primary/10 text-primary rounded-lg text-[9px] font-black uppercase tracking-widest">
              {t("Stock: {product.stock} units").replace("{product.stock}", product.stock)}
            </span>
          </div>
        </div>

        {/* Quantity Select Input */}
        <div className="space-y-1.5">
          <div className="flex justify-between items-center px-1">
            <label className="text-[9px] font-black text-on-surface-variant uppercase tracking-widest">{t("Order Quantity")}</label>
            <span className="text-[9px] font-bold text-on-surface-variant/50">{t("Units")}</span>
          </div>
          <input
            type="number"
            min="1"
            max={product.stock}
            value={quantity}
            onChange={e => handleQuantityChange(e.target.value)}
            onBlur={() => handleQuantityChange(quantity)}
            className="w-full bg-surface-container/20 border border-outline-variant/10 rounded-2xl px-4 py-3 text-sm text-primary font-bold focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all focus:bg-white"
          />
        </div>

        {/* Warning messages */}
        {error && (
          <div className="p-3 rounded-2xl bg-error/15 border border-error/25 text-error text-[10px] font-bold flex items-center gap-2">
            <AlertTriangle size={14} className="shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {quantity === product.stock && !error && (
          <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-600 text-[10px] font-bold flex items-center gap-2">
            <AlertTriangle size={14} className="shrink-0" />
            <span>{t("Ordering full store stock listing.")}</span>
          </div>
        )}

        <button
          onClick={handleConfirm}
          disabled={product.stock === 0}
          className="w-full flex items-center justify-center gap-2 bg-primary text-on-primary py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-40 disabled:scale-100 disabled:shadow-none"
        >
          <Check size={14} /> {t("Confirm Purchase")}
        </button>
      </div>
    </div>
  );
};

export default BuyQuantityModal;

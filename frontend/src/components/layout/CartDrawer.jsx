import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, Tag, Truck, Check } from 'lucide-react';
import Drawer from '../ui/Drawer';
import Button from '../ui/Button';
import { useCart } from '../../context/CartContext';
import { useCurrency } from '../../context/CurrencyContext';

const CartDrawer = () => {
  const navigate = useNavigate();
  const {
    isCartOpen,
    closeCart,
    cartItems,
    subtotal,
    discountAmount,
    shipping,
    total,
    coupon,
    updateQty,
    removeFromCart,
    applyCoupon,
    removeCoupon,
  } = useCart();
  const { formatPrice } = useCurrency();

  const [couponCode, setCouponCode] = useState('');
  const [isApplying, setIsApplying] = useState(false);

  const freeShippingThreshold = 100;
  const amountNeededForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);
  const freeShippingProgress = Math.min(100, (subtotal / freeShippingThreshold) * 100);

  const handleApplyCoupon = async (e) => {
    e.preventDefault();
    if (!couponCode.trim()) return;
    setIsApplying(true);
    await applyCoupon(couponCode.trim());
    setIsApplying(false);
    setCouponCode('');
  };

  const handleCheckout = () => {
    closeCart();
    navigate('/checkout');
  };

  return (
    <Drawer isOpen={isCartOpen} onClose={closeCart} title="Your Shopping Bag">
      {cartItems.length === 0 ? (
        <div className="h-full flex flex-col items-center justify-center text-center p-6 gap-4">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-500 border border-amber-500/20">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <div>
            <h4 className="text-base font-bold text-slate-900 dark:text-white">
              Your luxury bag is empty
            </h4>
            <p className="text-xs text-slate-500 mt-1 max-w-xs">
              Explore our curated tech hardware, horology, and artisan ateliers to start acquiring.
            </p>
          </div>
          <Button
            variant="primary"
            size="md"
            className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold"
            onClick={() => {
              closeCart();
              navigate('/products');
            }}
          >
            Browse Atelier Catalog
          </Button>
        </div>
      ) : (
        <div className="flex flex-col h-full gap-4">
          {/* Free Shipping Progress */}
          <div className="bg-slate-50 dark:bg-slate-900/60 p-3.5 rounded-xl border border-slate-200/80 dark:border-white/10">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-800 dark:text-slate-200 mb-2">
              <Truck className="w-4 h-4 text-amber-500" />
              {amountNeededForFreeShipping === 0 ? (
                <span className="text-emerald-500 font-bold">
                  🎉 Free Concierge Express Courier Unlocked!
                </span>
              ) : (
                <span>
                  Acquire <strong className="text-amber-500 font-mono">{formatPrice(amountNeededForFreeShipping)}</strong> more for Free Courier
                </span>
              )}
            </div>
            <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-amber-500 to-emerald-500 transition-all duration-300"
                style={{ width: `${freeShippingProgress}%` }}
              />
            </div>
          </div>

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto space-y-3 pr-1">
            {cartItems.map((item) => (
              <div
                key={item.productId}
                className="flex gap-3 p-3 bg-white dark:bg-slate-900/40 border border-slate-100 dark:border-white/5 rounded-xl"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-16 h-16 rounded-lg object-cover bg-slate-100 dark:bg-slate-950 shrink-0"
                />
                <div className="flex-1 min-w-0 flex flex-col justify-between">
                  <div>
                    <h5 className="text-xs font-semibold text-slate-900 dark:text-slate-100 line-clamp-1">
                      {item.name}
                    </h5>
                    <p className="text-[10px] font-mono text-slate-400 mt-0.5 uppercase tracking-wider">
                      Atelier: {item.shopName}
                    </p>
                  </div>

                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs font-black text-amber-500 font-mono">
                      {formatPrice(item.price)}
                    </span>

                    {/* Quantity Selector */}
                    <div className="flex items-center gap-2 border border-slate-200 dark:border-slate-800 rounded-lg px-2 py-0.5 bg-slate-50 dark:bg-slate-900">
                      <button
                        onClick={() => updateQty(item.productId, item.qty - 1)}
                        aria-label={`Decrease quantity of ${item.name}`}
                        className="text-slate-500 hover:text-slate-800 dark:hover:text-white transition-colors"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-xs font-bold w-4 text-center text-slate-800 dark:text-slate-200 font-mono">
                        {item.qty}
                      </span>
                      <button
                        onClick={() => updateQty(item.productId, item.qty + 1)}
                        aria-label={`Increase quantity of ${item.name}`}
                        className="text-slate-500 hover:text-slate-800 dark:hover:text-white transition-colors"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <button
                      onClick={() => removeFromCart(item.productId)}
                      aria-label={`Remove ${item.name} from shopping bag`}
                      className="text-slate-400 hover:text-rose-500 transition-colors p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Coupon Input */}
          <div className="pt-2 border-t border-slate-100 dark:border-white/5">
            {coupon ? (
              <div className="flex items-center justify-between bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800/80 px-3 py-2 rounded-xl text-xs text-emerald-800 dark:text-emerald-300">
                <div className="flex items-center gap-1.5 font-semibold">
                  <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span>Coupon {coupon.code} applied (-{formatPrice(discountAmount)})</span>
                </div>
                <button
                  onClick={removeCoupon}
                  className="text-xs font-bold text-rose-500 hover:underline"
                >
                  Remove
                </button>
              </div>
            ) : (
              <form onSubmit={handleApplyCoupon} className="flex gap-2">
                <div className="relative flex-1">
                  <input
                    type="text"
                    placeholder="Coupon (e.g. POSH20)"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                    className="w-full pl-8 pr-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-amber-500 uppercase font-mono tracking-wider"
                  />
                  <Tag className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                </div>
                <Button
                  type="submit"
                  variant="outline"
                  size="sm"
                  isLoading={isApplying}
                  className="border-amber-500/30 text-amber-500 hover:bg-amber-500/10 font-mono text-xs uppercase"
                >
                  Apply
                </Button>
              </form>
            )}
          </div>

          {/* Totals Summary */}
          <div className="space-y-1.5 pt-2 border-t border-slate-100 dark:border-white/5 text-xs text-slate-600 dark:text-slate-300">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-semibold text-slate-900 dark:text-white font-mono">{formatPrice(subtotal)}</span>
            </div>
            {discountAmount > 0 && (
              <div className="flex justify-between text-emerald-500 font-semibold">
                <span>Discount ({coupon?.code})</span>
                <span className="font-mono">-{formatPrice(discountAmount)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Courier Delivery</span>
              <span className="font-semibold text-slate-900 dark:text-white font-mono">
                {shipping === 0 ? (
                  <span className="text-emerald-500 font-bold">COMPLIMENTARY</span>
                ) : (
                  formatPrice(shipping)
                )}
              </span>
            </div>
            <div className="flex justify-between text-sm font-bold text-slate-900 dark:text-white pt-2 border-t border-slate-200 dark:border-white/10">
              <span className="font-mono uppercase tracking-wider text-xs">Total</span>
              <span className="text-base text-amber-500 font-black font-mono">{formatPrice(total)}</span>
            </div>
          </div>

          {/* Checkout CTA */}
          <Button
            variant="primary"
            size="lg"
            className="w-full mt-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold uppercase tracking-wider"
            rightIcon={<ArrowRight className="w-4 h-4" />}
            onClick={handleCheckout}
          >
            Proceed to Checkout ({formatPrice(total)})
          </Button>
        </div>
      )}
    </Drawer>
  );
};

export default CartDrawer;

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  CreditCard,
  Truck,
  ShieldCheck,
  CheckCircle2,
  Lock,
  ArrowRight,
  Sparkles,
  ShoppingBag,
} from 'lucide-react';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useCurrency } from '../context/CurrencyContext';
import { useToast } from '../context/ToastContext';
import api from '../services/api';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { cartItems, subtotal, discountAmount, shipping, total, coupon, clearCart } = useCart();
  const { user, demoLogin } = useAuth();
  const { formatPrice, currency } = useCurrency();
  const { addToast } = useToast();

  const [step, setStep] = useState(1);
  const [shippingAddress, setShippingAddress] = useState({
    country: user?.addresses?.[0]?.country || 'United States',
    city: user?.addresses?.[0]?.city || 'San Francisco',
    address1: user?.addresses?.[0]?.address1 || '450 Mission St, Suite 1200',
    address2: user?.addresses?.[0]?.address2 || 'Apt 4B',
    zipCode: user?.addresses?.[0]?.zipCode || '94105',
    addressType: 'Home',
  });

  const [paymentMethod, setPaymentMethod] = useState('card');
  const [cardDetails, setCardDetails] = useState({
    cardNumber: '•••• •••• •••• 4242',
    cardName: user?.name || 'Sophia Montgomery',
    expiry: '12/28',
    cvv: '888',
  });

  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [placedOrder, setPlacedOrder] = useState(null);
  const [orderModalOpen, setOrderModalOpen] = useState(false);

  if (cartItems.length === 0 && !placedOrder) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center mx-auto border border-amber-500/20">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-black text-slate-900 dark:text-white font-display">
          Your luxury acquisition bag is empty
        </h2>
        <p className="text-xs text-slate-400 max-w-sm mx-auto font-sans">
          You do not have any items in your checkout chamber. Browse our curated ateliers to acquire your selections.
        </p>
        <Link to="/products">
          <Button variant="primary" size="md" className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold uppercase text-xs">
            Browse Atelier Vault
          </Button>
        </Link>
      </div>
    );
  }

  const handlePlaceOrder = async () => {
    if (!user) {
      addToast({
        type: 'warning',
        title: 'Authentication Required',
        message: 'Please sign in or use 1-Click Customer Login to authenticate this acquisition',
      });
      return;
    }

    setIsPlacingOrder(true);
    try {
      const orderPayload = {
        cart: cartItems.map((item) => ({
          productId: item.productId,
          name: item.name,
          price: item.price,
          qty: item.qty,
          image: item.image,
          shopId: item.shopId,
        })),
        shippingAddress,
        paymentInfo: {
          id: `pi_mock_${Date.now()}`,
          status: 'Paid',
          type: paymentMethod === 'card' ? 'Stripe Credit Card' : paymentMethod === 'cod' ? 'Cash on Delivery' : 'PayPal',
        },
        totalPrice: total,
        couponCode: coupon?.code || '',
      };

      const res = await api.post('/orders', orderPayload);
      if (res.data?.success) {
        setPlacedOrder(res.data.order);
        clearCart();
        setOrderModalOpen(true);
        addToast({
          type: 'success',
          title: 'Acquisition Confirmed',
          message: 'Your order has been registered in the atelier vault.',
        });
      }
    } catch (err) {
      addToast({
        type: 'error',
        title: 'Acquisition Failed',
        message: err.message || 'Failed to place order',
      });
    } finally {
      setIsPlacingOrder(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Guest Authentication Banner */}
      {!user && (
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs shadow-sm">
          <div className="flex items-center gap-2.5 text-amber-300">
            <Sparkles className="w-5 h-5 text-amber-400 shrink-0" />
            <div>
              <span className="font-bold">Concierge Checkout:</span> Sign in to track live atelier dispatch and inspect cryptographic certificates, or proceed in 1 click.
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={async () => {
                const res = await demoLogin('customer');
                if (res?.success) addToast({ type: 'success', title: 'Authenticated', message: 'Signed in as Demo Connoisseur!' });
              }}
              className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold transition-colors shadow-sm font-mono uppercase text-xs"
            >
              1-Click Connoisseur Login
            </button>
            <Link
              to="/login?redirect=/checkout"
              className="px-3.5 py-1.5 rounded-xl border border-amber-500/30 font-semibold text-amber-400 hover:bg-amber-500/10 transition-colors font-mono uppercase text-xs"
            >
              Sign In
            </Link>
          </div>
        </div>
      )}

      {/* Checkout Stepper */}
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
          <div
            className={`flex items-center gap-2 cursor-pointer ${
              step >= 1 ? 'text-amber-500' : ''
            }`}
            onClick={() => setStep(1)}
          >
            <span
              className={`w-6 h-6 rounded-full flex items-center justify-center font-mono ${
                step >= 1
                  ? 'bg-amber-500 text-slate-950 font-bold'
                  : 'bg-slate-200 dark:bg-slate-800 text-slate-600'
              }`}
            >
              1
            </span>
            <span>Delivery</span>
          </div>
          <div className="flex-1 h-0.5 mx-4 bg-slate-200 dark:border-white/10" />
          <div
            className={`flex items-center gap-2 cursor-pointer ${
              step >= 2 ? 'text-amber-500' : ''
            }`}
            onClick={() => setStep(2)}
          >
            <span
              className={`w-6 h-6 rounded-full flex items-center justify-center font-mono ${
                step >= 2
                  ? 'bg-amber-500 text-slate-950 font-bold'
                  : 'bg-slate-200 dark:bg-slate-800 text-slate-600'
              }`}
            >
              2
            </span>
            <span>Payment</span>
          </div>
          <div className="flex-1 h-0.5 mx-4 bg-slate-200 dark:border-white/10" />
          <div
            className={`flex items-center gap-2 cursor-pointer ${
              step >= 3 ? 'text-amber-500' : ''
            }`}
            onClick={() => setStep(3)}
          >
            <span
              className={`w-6 h-6 rounded-full flex items-center justify-center font-mono ${
                step >= 3
                  ? 'bg-amber-500 text-slate-950 font-bold'
                  : 'bg-slate-200 dark:bg-slate-800 text-slate-600'
              }`}
            >
              3
            </span>
            <span>Confirmation</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Step Forms */}
        <div className="lg:col-span-2 space-y-6">
          {/* STEP 1: Shipping Address */}
          {step === 1 && (
            <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900/70 border border-slate-200/80 dark:border-white/10 space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-white/5">
                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2 font-mono uppercase tracking-wider">
                  <Truck className="w-5 h-5 text-amber-500" />
                  Courier Destination
                </h3>
                <span className="text-xs font-mono text-slate-400">Step 1 of 3</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2 space-y-1">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Street Address
                  </label>
                  <input
                    type="text"
                    value={shippingAddress.address1}
                    onChange={(e) =>
                      setShippingAddress({ ...shippingAddress, address1: e.target.value })
                    }
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                    placeholder="123 Luxury Ave, Suite 400"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Suite / Floor (Optional)
                  </label>
                  <input
                    type="text"
                    value={shippingAddress.address2}
                    onChange={(e) =>
                      setShippingAddress({ ...shippingAddress, address2: e.target.value })
                    }
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                    placeholder="Penthouse 4B"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    City
                  </label>
                  <input
                    type="text"
                    value={shippingAddress.city}
                    onChange={(e) =>
                      setShippingAddress({ ...shippingAddress, city: e.target.value })
                    }
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                    placeholder="San Francisco"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Zip / Postal Code
                  </label>
                  <input
                    type="text"
                    value={shippingAddress.zipCode}
                    onChange={(e) =>
                      setShippingAddress({ ...shippingAddress, zipCode: e.target.value })
                    }
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                    placeholder="94105"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Country
                  </label>
                  <input
                    type="text"
                    value={shippingAddress.country}
                    onChange={(e) =>
                      setShippingAddress({ ...shippingAddress, country: e.target.value })
                    }
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                    placeholder="United States"
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <Button
                  variant="primary"
                  size="md"
                  className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold uppercase text-xs tracking-wider"
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                  onClick={() => setStep(2)}
                >
                  Proceed to Payment Chamber
                </Button>
              </div>
            </div>
          )}

          {/* STEP 2: Payment Method */}
          {step === 2 && (
            <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900/70 border border-slate-200/80 dark:border-white/10 space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-white/5">
                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2 font-mono uppercase tracking-wider">
                  <Lock className="w-5 h-5 text-emerald-500" />
                  Encrypted Payment Gateway ({currency})
                </h3>
                <span className="text-xs font-mono text-slate-400">Step 2 of 3</span>
              </div>

              {/* Payment Type Selection */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('card')}
                  className={`p-4 rounded-2xl border text-left flex flex-col justify-between h-24 transition-all ${
                    paymentMethod === 'card'
                      ? 'border-amber-500 bg-amber-500/10 ring-2 ring-amber-500/20'
                      : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  <CreditCard className="w-5 h-5 text-amber-500" />
                  <span className="text-xs font-bold text-slate-900 dark:text-white font-mono uppercase">
                    Stripe Card Encrypted
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('cod')}
                  className={`p-4 rounded-2xl border text-left flex flex-col justify-between h-24 transition-all ${
                    paymentMethod === 'cod'
                      ? 'border-amber-500 bg-amber-500/10 ring-2 ring-amber-500/20'
                      : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  <Truck className="w-5 h-5 text-amber-500" />
                  <span className="text-xs font-bold text-slate-900 dark:text-white font-mono uppercase">
                    White Glove Cash Delivery
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('paypal')}
                  className={`p-4 rounded-2xl border text-left flex flex-col justify-between h-24 transition-all ${
                    paymentMethod === 'paypal'
                      ? 'border-amber-500 bg-amber-500/10 ring-2 ring-amber-500/20'
                      : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  <ShieldCheck className="w-5 h-5 text-indigo-500" />
                  <span className="text-xs font-bold text-slate-900 dark:text-white font-mono uppercase">
                    PayPal Express Vault
                  </span>
                </button>
              </div>

              {/* Simulated Card Fields */}
              {paymentMethod === 'card' && (
                <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                      Card Number
                    </label>
                    <input
                      type="text"
                      value={cardDetails.cardNumber}
                      onChange={(e) =>
                        setCardDetails({ ...cardDetails, cardNumber: e.target.value })
                      }
                      className="w-full p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-mono text-slate-900 dark:text-white"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                        Expiration
                      </label>
                      <input
                        type="text"
                        value={cardDetails.expiry}
                        onChange={(e) => setCardDetails({ ...cardDetails, expiry: e.target.value })}
                        className="w-full p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-mono text-slate-900 dark:text-white"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                        CVC / CVV
                      </label>
                      <input
                        type="password"
                        value={cardDetails.cvv}
                        onChange={(e) => setCardDetails({ ...cardDetails, cvv: e.target.value })}
                        className="w-full p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-mono text-slate-900 dark:text-white"
                      />
                    </div>
                  </div>
                </div>
              )}

              <div className="pt-4 flex justify-between">
                <Button variant="ghost" size="md" onClick={() => setStep(1)} className="font-mono text-xs uppercase">
                  Back
                </Button>
                <Button
                  variant="primary"
                  size="md"
                  className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold uppercase text-xs tracking-wider"
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                  onClick={() => setStep(3)}
                >
                  Inspect Order Finality
                </Button>
              </div>
            </div>
          )}

          {/* STEP 3: Review & Place Order */}
          {step === 3 && (
            <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900/70 border border-slate-200/80 dark:border-white/10 space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-white/5">
                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2 font-mono uppercase tracking-wider">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                  Review & Confirm Acquisition
                </h3>
                <span className="text-xs font-mono text-slate-400">Step 3 of 3</span>
              </div>

              {/* Shipping & Payment Summaries */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800">
                  <span className="text-slate-400 font-semibold block mb-1 uppercase tracking-wider text-[10px]">Delivering to:</span>
                  <p className="font-bold text-slate-900 dark:text-white">
                    {shippingAddress.address1} {shippingAddress.address2}
                  </p>
                  <p className="text-slate-400">
                    {shippingAddress.city}, {shippingAddress.zipCode}, {shippingAddress.country}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800">
                  <span className="text-slate-400 font-semibold block mb-1 uppercase tracking-wider text-[10px]">Payment Method:</span>
                  <p className="font-bold text-slate-900 dark:text-white capitalize">
                    {paymentMethod === 'card'
                      ? 'Credit Card (Stripe 256-bit Encrypted)'
                      : paymentMethod === 'cod'
                      ? 'White Glove Cash Delivery'
                      : 'PayPal Express Vault'}
                  </p>
                  <p className="text-slate-400">Currency: {currency}</p>
                </div>
              </div>

              {/* Items List Review */}
              <div className="space-y-3 pt-2">
                <span className="text-xs font-mono uppercase font-bold text-slate-700 dark:text-slate-300">
                  Acquisition Items ({cartItems.length})
                </span>
                <div className="divide-y divide-slate-100 dark:divide-white/5">
                  {cartItems.map((item) => (
                    <div key={item.productId} className="py-2.5 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={item.image}
                          alt=""
                          className="w-10 h-10 rounded-lg object-cover bg-slate-100 dark:bg-slate-950"
                        />
                        <div>
                          <p className="text-xs font-bold text-slate-900 dark:text-white line-clamp-1">
                            {item.name}
                          </p>
                          <p className="text-[10px] font-mono text-slate-400">Qty: {item.qty}</p>
                        </div>
                      </div>
                      <span className="text-xs font-bold text-amber-500 font-mono">
                        {formatPrice(item.price * item.qty)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 flex justify-between">
                <Button variant="ghost" size="md" onClick={() => setStep(2)} className="font-mono text-xs uppercase">
                  Back
                </Button>
                <Button
                  variant="primary"
                  size="lg"
                  className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold uppercase text-xs tracking-wider"
                  isLoading={isPlacingOrder}
                  rightIcon={<Sparkles className="w-4 h-4 text-slate-950" />}
                  onClick={handlePlaceOrder}
                >
                  Seal Acquisition ({formatPrice(total)})
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Order Summary Column */}
        <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-900/70 border border-slate-200/80 dark:border-white/10 space-y-4">
          <h3 className="text-base font-bold text-slate-900 dark:text-white pb-3 border-b border-slate-200 dark:border-white/5 font-mono uppercase tracking-wider">
            Acquisition Summary
          </h3>

          <div className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
            <div className="flex justify-between">
              <span>Items Subtotal</span>
              <span className="font-semibold text-slate-900 dark:text-white font-mono">{formatPrice(subtotal)}</span>
            </div>

            {discountAmount > 0 && (
              <div className="flex justify-between text-emerald-500 font-semibold">
                <span>Coupon ({coupon?.code})</span>
                <span className="font-mono">-{formatPrice(discountAmount)}</span>
              </div>
            )}

            <div className="flex justify-between">
              <span>Express Delivery</span>
              <span className="font-semibold text-slate-900 dark:text-white font-mono">
                {shipping === 0 ? <span className="text-emerald-500 font-bold">COMPLIMENTARY</span> : formatPrice(shipping)}
              </span>
            </div>

            <div className="flex justify-between text-base font-black text-slate-900 dark:text-white pt-3 border-t border-slate-200 dark:border-white/10">
              <span className="font-mono uppercase text-xs">Total Payment</span>
              <span className="text-amber-500 font-mono font-black">{formatPrice(total)}</span>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-white dark:bg-slate-950 text-[11px] text-slate-400 space-y-1 border border-slate-200/80 dark:border-white/5">
            <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300 font-semibold">
              <ShieldCheck className="w-4 h-4 text-amber-500" />
              <span className="font-mono text-xs uppercase">100% Provenance Guarantee</span>
            </div>
            <p>Every piece includes cryptographic serial proof, artisan atelier seal, and full concierge replacement coverage.</p>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      <Modal
        isOpen={orderModalOpen}
        onClose={() => {
          setOrderModalOpen(false);
          navigate('/profile?tab=orders');
        }}
        title="Acquisition Registered Successfully!"
        maxWidth="max-w-md"
      >
        <div className="text-center space-y-4 py-2">
          <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <h4 className="text-xl font-black text-slate-900 dark:text-white font-display">
            Acquisition Sealed & Registered
          </h4>

          <p className="text-xs text-slate-400 font-mono">
            Vault Order Ref: <strong className="text-amber-500">{placedOrder?.orderNumber}</strong>
          </p>

          <p className="text-xs text-slate-400 dark:text-slate-300 leading-relaxed font-sans">
            Our atelier dispatch team has notified the respective master artisans. You can follow real-time fulfillment in your concierge profile.
          </p>

          <div className="pt-4 flex gap-3">
            <Button
              variant="primary"
              size="md"
              className="flex-1 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold uppercase text-xs"
              onClick={() => {
                setOrderModalOpen(false);
                navigate('/profile?tab=orders');
              }}
            >
              Order Vault
            </Button>
            <Button
              variant="outline"
              size="md"
              className="flex-1 font-mono uppercase text-xs border-amber-500/30 text-amber-400 hover:bg-amber-500/10"
              onClick={() => {
                setOrderModalOpen(false);
                navigate('/');
              }}
            >
              Atelier Home
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default CheckoutPage;

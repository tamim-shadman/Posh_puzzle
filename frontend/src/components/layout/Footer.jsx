import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Mail, ShieldCheck, CreditCard, Lock, Send, Check } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

const Footer = () => {
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      toast.error('Please enter a valid email address');
      return;
    }
    setSubscribed(true);
    toast.success('Thank you for subscribing to Posh Puzzle VIP drops!');
  };

  return (
    <footer className="bg-slate-950 text-slate-300 border-t border-slate-800 transition-colors pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Feature Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pb-12 border-b border-slate-800">
          <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80">
            <div className="w-12 h-12 rounded-xl bg-brand-500/10 text-brand-400 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h5 className="text-sm font-bold text-white">Genuine Authenticity</h5>
              <p className="text-xs text-slate-400">100% verified authorized multi-vendor products</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
              <Lock className="w-6 h-6" />
            </div>
            <div>
              <h5 className="text-sm font-bold text-white">Encrypted Checkout</h5>
              <p className="text-xs text-slate-400">Stripe 256-bit SSL transaction security</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center shrink-0">
              <CreditCard className="w-6 h-6" />
            </div>
            <div>
              <h5 className="text-sm font-bold text-white">Flexible Payments</h5>
              <p className="text-xs text-slate-400">Cards, Apple Pay, PayPal & Cash On Delivery</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80">
            <div className="w-12 h-12 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center shrink-0">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h5 className="text-sm font-bold text-white">Dedicated Support</h5>
              <p className="text-xs text-slate-400">24/7 priority multi-vendor buyer assistance</p>
            </div>
          </div>
        </div>

        {/* Main Footer Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 py-12">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-600 to-amber-500 p-0.5 shadow-md">
                <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                </div>
              </div>
              <span className="text-xl font-extrabold tracking-tight font-display text-white">
                Posh Puzzle
              </span>
            </Link>
            <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
              Posh Puzzle is an advanced multi-vendor marketplace uniting verified high-end electronics, precision horology, gaming audio, and designer footwear from global ateliers.
            </p>

            {/* Newsletter */}
            <div className="pt-2">
              <p className="text-xs font-bold text-slate-200 mb-2">Subscribe to Exclusive Drops</p>
              {subscribed ? (
                <div className="flex items-center gap-2 text-xs text-emerald-400 bg-emerald-950/40 p-2.5 rounded-xl border border-emerald-800/60">
                  <Check className="w-4 h-4" />
                  <span>You're subscribed to VIP release notices!</span>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex gap-2">
                  <div className="relative flex-1">
                    <input
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500"
                    />
                    <Mail className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5" />
                  </div>
                  <button
                    type="submit"
                    className="bg-brand-600 hover:bg-brand-700 text-white px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
                  >
                    <span>Join</span>
                    <Send className="w-3 h-3" />
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Catalog */}
          <div>
            <h5 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
              Categories
            </h5>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <Link to="/products?category=Computers and Laptops" className="hover:text-white transition-colors">
                  Computers & Laptops
                </Link>
              </li>
              <li>
                <Link to="/products?category=Mobile and Tablets" className="hover:text-white transition-colors">
                  Mobile & Tablets
                </Link>
              </li>
              <li>
                <Link to="/products?category=Music and Gaming" className="hover:text-white transition-colors">
                  Music & Gaming Audio
                </Link>
              </li>
              <li>
                <Link to="/products?category=Shoes" className="hover:text-white transition-colors">
                  Designer Footwear
                </Link>
              </li>
              <li>
                <Link to="/products?category=Others" className="hover:text-white transition-colors">
                  Luxury Horology
                </Link>
              </li>
            </ul>
          </div>

          {/* Vendors */}
          <div>
            <h5 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
              Multi-Vendor
            </h5>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <Link to="/signup?role=vendor" className="hover:text-white transition-colors">
                  Become a Seller
                </Link>
              </li>
              <li>
                <Link to="/vendor/dashboard" className="hover:text-white transition-colors">
                  Vendor Dashboard
                </Link>
              </li>
              <li>
                <Link to="/shop/shop_001" className="hover:text-white transition-colors">
                  Apple Flagship Store
                </Link>
              </li>
              <li>
                <Link to="/shop/shop_002" className="hover:text-white transition-colors">
                  Asus ROG Studio
                </Link>
              </li>
              <li>
                <Link to="/shop/shop_003" className="hover:text-white transition-colors">
                  Shahriar Horology
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Care */}
          <div>
            <h5 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
              Customer Support
            </h5>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <Link to="/profile?tab=orders" className="hover:text-white transition-colors">
                  Track Your Order
                </Link>
              </li>
              <li>
                <Link to="/products" className="hover:text-white transition-colors">
                  Buyer Protection Policy
                </Link>
              </li>
              <li>
                <Link to="/products" className="hover:text-white transition-colors">
                  Shipping & Customs
                </Link>
              </li>
              <li>
                <Link to="/products" className="hover:text-white transition-colors">
                  30-Day Money Back
                </Link>
              </li>
              <li>
                <span className="text-brand-400 font-semibold cursor-pointer">
                  support@poshpuzzle.com
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 mt-4 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© 2026 Posh Puzzle Inc. All rights reserved. Built to elite production standards.</p>
          <div className="flex items-center gap-6">
            <span className="hover:text-slate-300 cursor-pointer">Privacy Policy</span>
            <span className="hover:text-slate-300 cursor-pointer">Terms of Service</span>
            <span className="hover:text-slate-300 cursor-pointer">Security Audit</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

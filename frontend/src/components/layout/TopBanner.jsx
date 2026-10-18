import React from 'react';
import { Link } from 'react-router-dom';
import { Sun, Moon, Store, Sparkles, ShieldCheck } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';

const TopBanner = () => {
  const { isDark, toggleTheme } = useTheme();
  const { isVendor } = useAuth();

  return (
    <div className="bg-slate-900 text-slate-300 text-xs py-2 px-4 border-b border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
        {/* Left Announcement */}
        <div className="flex items-center gap-2 text-center sm:text-left">
          <span className="inline-flex items-center gap-1 bg-brand-500/20 text-brand-300 px-2 py-0.5 rounded-full font-semibold">
            <Sparkles className="w-3 h-3 text-amber-400" /> Flash Promo
          </span>
          <span className="truncate">
            Get 20% off with coupon <span className="font-bold text-amber-300 tracking-wider">POSH20</span> | Free Express Shipping on orders $100+
          </span>
        </div>

        {/* Right Utility Actions */}
        <div className="flex items-center gap-4 shrink-0">
          <div className="hidden md:flex items-center gap-1 text-slate-400">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Buyer Protection Guaranteed</span>
          </div>

          <div className="h-3 w-px bg-slate-700 hidden md:block" />

          {/* Seller Link */}
          {isVendor ? (
            <Link
              to="/vendor/dashboard"
              className="flex items-center gap-1 text-brand-300 hover:text-white font-medium transition-colors"
            >
              <Store className="w-3.5 h-3.5" />
              <span>Vendor Dashboard</span>
            </Link>
          ) : (
            <Link
              to="/signup?role=vendor"
              className="flex items-center gap-1 text-slate-300 hover:text-white transition-colors"
            >
              <Store className="w-3.5 h-3.5" />
              <span>Become a Seller</span>
            </Link>
          )}

          <div className="h-3 w-px bg-slate-700" />

          {/* Dark / Light Toggle */}
          <button
            onClick={toggleTheme}
            className="flex items-center gap-1.5 p-1 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-white transition-colors"
            title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            aria-label={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {isDark ? (
              <>
                <Sun className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden sm:inline">Light</span>
              </>
            ) : (
              <>
                <Moon className="w-3.5 h-3.5 text-indigo-400" />
                <span className="hidden sm:inline">Dark</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TopBanner;

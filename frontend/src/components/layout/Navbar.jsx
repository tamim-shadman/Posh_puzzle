import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Search,
  Heart,
  ShoppingBag,
  User,
  Menu,
  X,
  ChevronDown,
  Sparkles,
  LogOut,
  Package,
  Store,
  Compass,
  SlidersHorizontal,
  Command,
  Globe,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useCurrency } from '../../context/CurrencyContext';
import { useComparison } from '../../context/ComparisonContext';
import api from '../../services/api';

const Navbar = ({ onOpenCommandPalette }) => {
  const navigate = useNavigate();
  const { user, isVendor, logout, demoLogin } = useAuth();
  const { itemCount: cartCount, total: cartTotal, openCart } = useCart();
  const { itemCount: wishlistCount, openWishlist } = useWishlist();
  const { currency, setCurrency, formatPrice, availableCurrencies } = useCurrency();
  const { comparedProducts, setIsModalOpen: openCompareModal } = useComparison();

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showCurrencyMenu, setShowCurrencyMenu] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const searchRef = useRef(null);
  const userMenuRef = useRef(null);
  const currencyMenuRef = useRef(null);

  // Debounced live search
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setShowSearchDropdown(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const res = await api.get(`/products?search=${encodeURIComponent(searchQuery)}&limit=5`);
        if (res.data?.success) {
          setSearchResults(res.data.products || []);
          setShowSearchDropdown(true);
        }
      } catch (err) {
        console.error('Search error', err);
      } finally {
        setIsSearching(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Click outside listener
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowSearchDropdown(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setShowUserMenu(false);
      }
      if (currencyMenuRef.current && !currencyMenuRef.current.contains(e.target)) {
        setShowCurrencyMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setShowSearchDropdown(false);
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-950/95 backdrop-blur-xl border-b border-slate-200/80 dark:border-white/10 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-3 sm:gap-4">
          {/* Brand Logo with Editorial Typography */}
          <Link to="/" className="flex items-center gap-2.5 shrink-0 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 via-brand-600 to-indigo-600 p-0.5 shadow-md shadow-amber-500/10 group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-amber-400" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-extrabold tracking-tight font-display bg-gradient-to-r from-slate-900 via-amber-600 to-indigo-900 dark:from-white dark:via-amber-200 dark:to-indigo-300 bg-clip-text text-transparent">
                Posh Puzzle
              </span>
              <span className="text-[9px] uppercase font-mono font-bold tracking-widest text-amber-600 dark:text-amber-400">
                Atelier & Hardware Guild
              </span>
            </div>
          </Link>

          {/* Quick Command Palette Trigger (Linear/Raycast style) */}
          <button
            onClick={onOpenCommandPalette}
            className="hidden md:flex items-center gap-2.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 border border-slate-200/80 dark:border-white/10 text-slate-500 dark:text-slate-400 text-xs transition-all w-64 lg:w-72"
            title="Press Cmd+K or Ctrl+K to open Command Palette"
          >
            <Search className="w-3.5 h-3.5 text-amber-500" />
            <span className="truncate">Quick jump or command...</span>
            <kbd className="ml-auto inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-mono bg-white dark:bg-slate-800 rounded border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300">
              <Command className="w-2.5 h-2.5" />K
            </kbd>
          </button>

          {/* Search Bar with Live Suggestion Preview */}
          <div ref={searchRef} className="relative flex-1 max-w-sm hidden xl:block">
            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                type="text"
                placeholder="Search catalog..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => searchQuery && setShowSearchDropdown(true)}
                className="w-full pl-9 pr-16 py-2 bg-slate-100/80 dark:bg-slate-900/80 border border-transparent focus:border-amber-500 rounded-xl text-xs text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none transition-all"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <button
                type="submit"
                className="absolute right-1 top-1 bg-amber-500 hover:bg-amber-600 text-slate-950 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg transition-all"
              >
                Go
              </button>
            </form>

            {/* Instant Search Dropdown */}
            {showSearchDropdown && (
              <div className="absolute left-0 right-0 top-full mt-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden z-50 animate-slide-up">
                {isSearching ? (
                  <div className="p-4 text-center text-xs text-slate-400">Searching catalog...</div>
                ) : searchResults.length > 0 ? (
                  <div className="p-2 divide-y divide-slate-100 dark:divide-slate-800">
                    {searchResults.map((item) => (
                      <Link
                        key={item._id}
                        to={`/product/${item._id}`}
                        onClick={() => setShowSearchDropdown(false)}
                        className="flex items-center gap-3 p-2 hover:bg-slate-50 dark:hover:bg-slate-800/60 rounded-xl transition-colors"
                      >
                        <img
                          src={item.images?.[0]}
                          alt={item.name}
                          className="w-10 h-10 rounded-lg object-cover bg-slate-100 dark:bg-slate-800"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-slate-800 dark:text-slate-100 truncate">
                            {item.name}
                          </p>
                          <p className="text-[10px] font-mono text-slate-400">{item.category}</p>
                        </div>
                        <span className="text-xs font-bold text-amber-500 font-display">
                          {formatPrice(item.discountPrice)}
                        </span>
                      </Link>
                    ))}
                    <button
                      onClick={handleSearchSubmit}
                      className="w-full text-center py-2 text-xs font-semibold text-amber-500 hover:underline"
                    >
                      View all results for "{searchQuery}"
                    </button>
                  </div>
                ) : (
                  <div className="p-4 text-center text-xs text-slate-400">
                    No products found matching "{searchQuery}"
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right Nav Action Chamber */}
          <div className="flex items-center gap-1.5 sm:gap-2.5">
            {/* Catalog Explore Link */}
            <Link
              to="/products"
              className="hidden lg:flex items-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-amber-500 dark:hover:text-amber-400 px-3 py-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors uppercase tracking-wider"
            >
              <Compass className="w-3.5 h-3.5 text-amber-500" />
              <span>Catalog</span>
            </Link>

            {/* Currency Selector Dropdown */}
            <div ref={currencyMenuRef} className="relative">
              <button
                onClick={() => setShowCurrencyMenu(!showCurrencyMenu)}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-mono font-bold bg-slate-100 dark:bg-slate-900 border border-slate-200/80 dark:border-white/10 text-slate-700 dark:text-slate-300 hover:border-amber-500/50 transition-colors"
                title="Change currency and locale"
              >
                <Globe className="w-3.5 h-3.5 text-amber-500" />
                <span>{currency}</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {showCurrencyMenu && (
                <div className="absolute right-0 top-full mt-2 w-44 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl shadow-2xl p-1.5 z-50 animate-slide-up">
                  <div className="px-2 py-1 text-[10px] font-mono text-slate-400 uppercase tracking-wider">
                    Select Currency
                  </div>
                  {availableCurrencies.map((c) => (
                    <button
                      key={c.code}
                      onClick={() => {
                        setCurrency(c.code);
                        setShowCurrencyMenu(false);
                      }}
                      className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-mono transition-colors ${
                        currency === c.code
                          ? 'bg-amber-500/15 text-amber-400 font-bold'
                          : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900'
                      }`}
                    >
                      <span>{c.label}</span>
                      <span className="text-slate-400">{c.symbol}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Comparison Trigger Button */}
            {comparedProducts.length > 0 && (
              <button
                onClick={() => openCompareModal(true)}
                className="relative flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-400 text-xs font-mono font-bold transition-colors"
                title="View side-by-side product comparison"
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Compare</span>
                <span className="px-1.5 py-0.2 rounded-full bg-amber-500 text-slate-950 text-[10px]">
                  {comparedProducts.length}
                </span>
              </button>
            )}

            {/* Wishlist Trigger */}
            <button
              onClick={openWishlist}
              className="relative p-2 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors"
              title="Saved Items"
              aria-label={`Saved items wishlist with ${wishlistCount} items`}
            >
              <Heart className="w-4 h-4" />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 text-white rounded-full text-[10px] font-bold flex items-center justify-center shadow-sm">
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* Cart Trigger */}
            <button
              onClick={openCart}
              className="relative flex items-center gap-2 p-2 sm:px-3 sm:py-2 rounded-xl bg-amber-500/10 dark:bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-400 hover:bg-amber-500/20 transition-colors"
              aria-label={`Shopping bag with ${cartCount} items totaling ${formatPrice(cartTotal)}`}
            >
              <div className="relative">
                <ShoppingBag className="w-4 h-4" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 w-4 h-4 bg-amber-500 text-slate-950 rounded-full text-[10px] font-black flex items-center justify-center shadow-sm">
                    {cartCount}
                  </span>
                )}
              </div>
              <div className="hidden sm:flex flex-col items-start leading-none text-left">
                <span className="text-[9px] font-mono uppercase text-slate-400">Bag</span>
                <span className="text-xs font-black text-slate-900 dark:text-white font-mono">
                  {formatPrice(cartTotal)}
                </span>
              </div>
            </button>

            {/* User Profile / Auth Dropdown */}
            <div ref={userMenuRef} className="relative">
              {user ? (
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  aria-label="User account menu"
                  className="flex items-center gap-1.5 p-1 rounded-full hover:ring-2 hover:ring-amber-500/40 transition-all"
                >
                  <img
                    src={user.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80'}
                    alt={user.name}
                    className="w-8 h-8 rounded-full object-cover ring-2 ring-amber-500/40"
                  />
                  <ChevronDown className="w-3 h-3 text-slate-500 hidden sm:block" />
                </button>
              ) : (
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  aria-label="Sign in or register"
                  className="flex items-center gap-1.5 p-2 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors text-xs font-semibold"
                >
                  <User className="w-4 h-4 text-amber-500" />
                  <span className="hidden sm:inline">Sign In</span>
                </button>
              )}

              {/* User Menu Dropdown */}
              {showUserMenu && (
                <div className="absolute right-0 top-full mt-2 w-64 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-3 z-50 animate-slide-up">
                  {user ? (
                    <div>
                      <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800 mb-2">
                        <p className="text-sm font-bold text-slate-900 dark:text-white truncate">
                          {user.name}
                        </p>
                        <p className="text-xs text-slate-400 truncate">{user.email}</p>
                        <span className="inline-block mt-1 text-[9px] uppercase font-mono font-bold tracking-wider px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
                          {user.role}
                        </span>
                      </div>

                      <div className="space-y-1">
                        <Link
                          to="/profile"
                          onClick={() => setShowUserMenu(false)}
                          className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors"
                        >
                          <User className="w-4 h-4 text-slate-400" />
                          <span>My Concierge Profile</span>
                        </Link>

                        <Link
                          to="/profile?tab=orders"
                          onClick={() => setShowUserMenu(false)}
                          className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors"
                        >
                          <Package className="w-4 h-4 text-slate-400" />
                          <span>Order Vault</span>
                        </Link>

                        {isVendor && (
                          <Link
                            to="/vendor/dashboard"
                            onClick={() => setShowUserMenu(false)}
                            className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-amber-400 hover:bg-amber-500/10 transition-colors"
                          >
                            <Store className="w-4 h-4" />
                            <span>Atelier Cockpit</span>
                          </Link>
                        )}

                        <button
                          onClick={() => {
                            logout();
                            setShowUserMenu(false);
                          }}
                          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-rose-500 hover:bg-rose-500/10 transition-colors"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>Log Out</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div className="p-2 mb-2 text-center border-b border-slate-100 dark:border-slate-800">
                        <p className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                          Access your saved bag & orders
                        </p>
                        <div className="mt-2 flex gap-2">
                          <Link
                            to="/login"
                            onClick={() => setShowUserMenu(false)}
                            className="flex-1 py-1.5 text-xs font-bold text-slate-950 bg-amber-500 hover:bg-amber-600 rounded-xl text-center transition-colors uppercase tracking-wider"
                          >
                            Sign In
                          </Link>
                          <Link
                            to="/signup"
                            onClick={() => setShowUserMenu(false)}
                            className="flex-1 py-1.5 text-xs font-bold text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-700 rounded-xl text-center hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors uppercase tracking-wider"
                          >
                            Register
                          </Link>
                        </div>
                      </div>

                      {/* 1-Click Demo Login options */}
                      <div className="p-1">
                        <p className="text-[10px] font-mono uppercase tracking-wider text-slate-400 px-2 mb-1.5">
                          Instant Atelier Credentials
                        </p>
                        <div className="space-y-1">
                          <button
                            onClick={async () => {
                              await demoLogin('customer');
                              setShowUserMenu(false);
                            }}
                            className="w-full flex items-center justify-between px-3 py-1.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-900 hover:bg-amber-500/10 text-slate-700 dark:text-slate-200 transition-colors"
                          >
                            <span>Demo Connoisseur</span>
                            <span className="text-[10px] text-amber-500 font-mono font-bold">1-Click</span>
                          </button>
                          <button
                            onClick={async () => {
                              await demoLogin('vendor');
                              setShowUserMenu(false);
                              navigate('/vendor/dashboard');
                            }}
                            className="w-full flex items-center justify-between px-3 py-1.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-900 hover:bg-amber-500/10 text-slate-700 dark:text-slate-200 transition-colors"
                          >
                            <span>Demo Atelier Artisan</span>
                            <span className="text-[10px] text-amber-500 font-mono font-bold">1-Click</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              className="p-2 rounded-xl text-slate-700 dark:text-slate-300 md:hidden hover:bg-slate-100 dark:hover:bg-slate-900"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar & Command Shortcut */}
        <div className="pb-3 md:hidden flex gap-2">
          <form onSubmit={handleSearchSubmit} className="relative flex-1">
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-16 py-1.5 bg-slate-100 dark:bg-slate-900 border-none rounded-xl text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-amber-500"
            />
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2" />
            <button
              type="submit"
              className="absolute right-1 top-1 bg-amber-500 text-slate-950 text-[10px] font-bold px-2.5 py-0.5 rounded-lg"
            >
              Go
            </button>
          </form>
          <button
            onClick={onOpenCommandPalette}
            className="px-2.5 py-1.5 bg-slate-100 dark:bg-slate-900 rounded-xl text-slate-400 border border-slate-200/80 dark:border-white/10"
            title="Open Command Palette"
          >
            <Command className="w-3.5 h-3.5 text-amber-500" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;

import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  ArrowRight,
  Laptop,
  Smartphone,
  Watch,
  Sparkles,
  ShoppingBag,
  User,
  Store,
  DollarSign,
} from 'lucide-react';
import { useCurrency } from '../../context/CurrencyContext';

const QUICK_ACTIONS = [
  { id: 'act_home', title: 'Home Atelier Showcase', category: 'Navigation', icon: Sparkles, path: '/' },
  { id: 'act_catalog', title: 'Browse All Luxury Products', category: 'Navigation', icon: ShoppingBag, path: '/products' },
  { id: 'act_cat_laptops', title: 'Computers & Laptops Collection', category: 'Categories', icon: Laptop, path: '/products?category=Computers and Laptops' },
  { id: 'act_cat_mobile', title: 'Mobile & Tablets Collection', category: 'Categories', icon: Smartphone, path: '/products?category=Mobile and Tablets' },
  { id: 'act_cat_watches', title: 'Horology & Timepieces', category: 'Categories', icon: Watch, path: '/products?category=Watches and Accessories' },
  { id: 'act_vendor', title: 'Vendor Atelier Cockpit', category: 'Portals', icon: Store, path: '/vendor/dashboard' },
  { id: 'act_profile', title: 'Customer Concierge Profile', category: 'Portals', icon: User, path: '/profile' },
  { id: 'act_checkout', title: 'Direct Checkout Chamber', category: 'Portals', icon: ShoppingBag, path: '/checkout' },
];

const CommandPalette = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);
  const navigate = useNavigate();
  const { setCurrency, currency } = useCurrency();

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // Combined searchable actions
  const currencyActions = [
    { id: 'cur_usd', title: 'Switch Currency: USD ($)', category: 'Currency Engine', icon: DollarSign, action: () => setCurrency('USD') },
    { id: 'cur_eur', title: 'Switch Currency: EUR (€)', category: 'Currency Engine', icon: DollarSign, action: () => setCurrency('EUR') },
    { id: 'cur_gbp', title: 'Switch Currency: GBP (£)', category: 'Currency Engine', icon: DollarSign, action: () => setCurrency('GBP') },
    { id: 'cur_jpy', title: 'Switch Currency: JPY (¥)', category: 'Currency Engine', icon: DollarSign, action: () => setCurrency('JPY') },
    { id: 'cur_cad', title: 'Switch Currency: CAD ($)', category: 'Currency Engine', icon: DollarSign, action: () => setCurrency('CAD') },
  ];

  const allActions = [...QUICK_ACTIONS, ...currencyActions];

  const filtered = allActions.filter((item) =>
    item.title.toLowerCase().includes(query.toLowerCase()) ||
    item.category.toLowerCase().includes(query.toLowerCase())
  );

  const handleSelect = (item) => {
    if (item.path) {
      navigate(item.path);
    } else if (item.action) {
      item.action();
    }
    onClose();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % (filtered.length || 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filtered.length) % (filtered.length || 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filtered[selectedIndex]) {
        handleSelect(filtered[selectedIndex]);
      }
    } else if (e.key === 'Escape') {
      e.preventDefault();
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/70 backdrop-blur-md animate-fade-in"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl bg-slate-900/95 dark:bg-slate-950/95 border border-amber-500/30 rounded-2xl shadow-2xl overflow-hidden text-slate-100"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleKeyDown}
      >
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-white/10 gap-3">
          <Search className="w-5 h-5 text-amber-400 flex-shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder="Type a command, category, or search catalog... (ESC to exit)"
            className="w-full bg-transparent text-sm sm:text-base text-white placeholder-slate-400 focus:outline-none"
          />
          <kbd className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-mono text-slate-400 bg-slate-800 rounded border border-white/10">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div className="max-h-80 overflow-y-auto p-2 divide-y divide-white/5">
          {filtered.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-400">
              No matching commands or categories found.
            </div>
          ) : (
            filtered.map((item, index) => {
              const Icon = item.icon;
              const isSelected = index === selectedIndex;
              return (
                <button
                  key={item.id}
                  onClick={() => handleSelect(item)}
                  onMouseEnter={() => setSelectedIndex(index)}
                  className={`w-full flex items-center justify-between p-3 rounded-xl text-left transition-colors ${
                    isSelected
                      ? 'bg-amber-500/15 text-white border border-amber-500/30'
                      : 'text-slate-300 hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        isSelected
                          ? 'bg-amber-500 text-slate-950 shadow-sm'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-xs font-semibold block">{item.title}</span>
                      <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
                        {item.category}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {item.id.startsWith('cur_') && item.title.includes(currency) && (
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                        ACTIVE
                      </span>
                    )}
                    <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
                  </div>
                </button>
              );
            })
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="px-4 py-2.5 bg-slate-950/80 border-t border-white/5 flex items-center justify-between text-[11px] text-slate-400 font-mono">
          <div className="flex items-center gap-3">
            <span>
              <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-200 border border-white/10 mr-1">↑↓</kbd>
              Navigate
            </span>
            <span>
              <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-200 border border-white/10 mr-1">↵</kbd>
              Select
            </span>
          </div>
          <span className="text-amber-400 uppercase tracking-wider text-[10px]">Posh Command Engine</span>
        </div>
      </div>
    </div>
  );
};

export default CommandPalette;

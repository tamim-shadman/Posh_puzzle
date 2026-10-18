import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  ArrowRight,
  Clock,
  ShieldCheck,
  Truck,
  RotateCcw,
  Headphones,
  Laptop,
  Footprints,
  Flame,
  Star,
  ChevronRight,
} from 'lucide-react';
import ProductCard from '../components/product/ProductCard';
import { ProductCardSkeleton } from '../components/ui/Skeleton';
import { useCurrency } from '../context/CurrencyContext';
import api from '../services/api';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [flashDeals, setFlashDeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategoryTab, setActiveCategoryTab] = useState('All');
  const { formatPrice } = useCurrency();

  // Flash drop countdown timer
  const [timeLeft, setTimeLeft] = useState({
    hours: 6,
    minutes: 38,
    seconds: 42,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 12, minutes: 0, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const res = await api.get('/products?limit=12');
        if (res.data?.success) {
          const prods = res.data.products || [];
          setProducts(prods);
          setFlashDeals(prods.filter((p) => p.isFlashDeal || p.discountPrice < p.originalPrice));
        }
      } catch (err) {
        console.error('Failed to load products', err);
      } finally {
        setLoading(false);
      }
    };

    fetchHomeData();
  }, []);

  const categories = [
    {
      name: 'Silicon & Workstations',
      query: 'Computers and Laptops',
      icon: Laptop,
      image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80',
      itemCount: '14+ Master Units',
      tag: 'LAT: 37°19\'N // ATELIER CA',
    },
    {
      name: 'Horology & Bespoke Watches',
      query: 'Watches and Accessories',
      icon: Star,
      image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=800&q=80',
      itemCount: '12+ Tourbillons',
      tag: 'LAT: 46°12\'N // GENEVA GUILD',
    },
    {
      name: 'Acoustics & QD-OLED',
      query: 'Music and Gaming',
      icon: Headphones,
      image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80',
      itemCount: '32+ Audiophile Rigs',
      tag: 'LAT: 35°00\'N // TOKYO LAB',
    },
    {
      name: 'Handcrafted Footwear',
      query: 'Shoes',
      icon: Footprints,
      image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=800&q=80',
      itemCount: '19+ Artisan Pairs',
      tag: 'LAT: 45°28\'N // MILAN ATELIER',
    },
  ];

  const filteredProducts =
    activeCategoryTab === 'All'
      ? products
      : products.filter((p) => p.category.toLowerCase().includes(activeCategoryTab.toLowerCase()));

  return (
    <div className="space-y-16 pb-24">
      {/* Editorial Lookbook Hero Section */}
      <section className="relative mx-4 sm:mx-6 lg:mx-8 mt-6 rounded-3xl overflow-hidden bg-slate-950 border border-amber-500/20 shadow-2xl text-white">
        {/* Ambient Luxury Lighting */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-6 py-16 sm:py-20 lg:py-24 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Editorial Copy */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-[11px] font-mono tracking-wider uppercase text-amber-400">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Autumn/Winter 2026 Atelier Collection // Curated Drops</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.05] font-display">
              Bespoke Silicon & <br />
              <span className="bg-gradient-to-r from-amber-400 via-amber-200 to-indigo-300 bg-clip-text text-transparent">
                Haute Horology.
              </span>
            </h1>

            <p className="text-sm sm:text-base text-slate-300 max-w-xl leading-relaxed font-sans">
              Posh Puzzle connects discerning connoisseurs with authorized global ateliers. Every device, tourbillon, and artisan leather piece includes a cryptographic provenance certificate and concierge warranty.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link
                to="/products"
                className="px-6 py-3.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-all shadow-lg shadow-amber-500/20"
              >
                <span>Explore Guild Catalog</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/products?category=Computers and Laptops"
                className="px-6 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-white/10 text-white font-mono text-xs uppercase tracking-wider transition-all"
              >
                Inspect M3 Max Silicon
              </Link>
            </div>

            {/* Editorial Technical Coordinates Strip */}
            <div className="pt-6 border-t border-white/10 grid grid-cols-3 gap-4 text-xs font-mono">
              <div>
                <span className="block text-lg sm:text-xl font-black text-amber-400 font-display">100%</span>
                <span className="text-slate-400 text-[10px] uppercase tracking-wider">Atelier Verified</span>
              </div>
              <div className="border-l border-white/10 pl-4">
                <span className="block text-lg sm:text-xl font-black text-white font-display">0.03ms</span>
                <span className="text-slate-400 text-[10px] uppercase tracking-wider">QD-OLED Latency</span>
              </div>
              <div className="border-l border-white/10 pl-4">
                <span className="block text-lg sm:text-xl font-black text-emerald-400 font-display">Global</span>
                <span className="text-slate-400 text-[10px] uppercase tracking-wider">Express Courier</span>
              </div>
            </div>
          </div>

          {/* Right Asymmetric Lookbook Showcase Card */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-2xl overflow-hidden bg-slate-900 border border-amber-500/30 shadow-2xl group">
              <img
                src="https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=1000&q=80"
                alt="MacBook Pro 16 M3 Max"
                className="w-full aspect-[4/3] object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />
              
              <div className="absolute top-4 left-4">
                <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-amber-500 text-slate-950 shadow-md">
                  Spotlight Drop
                </span>
              </div>

              <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between">
                <div>
                  <span className="text-[10px] font-mono text-amber-400 uppercase tracking-wider block">
                    Apple Authorized Guild • Cupertino
                  </span>
                  <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
                    MacBook Pro 16" M3 Max
                  </h3>
                  <p className="text-[11px] text-slate-400 font-mono mt-0.5">
                    36GB Unified Memory // 1TB NVMe SSD
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-xl sm:text-2xl font-black text-amber-400 font-mono">
                    {formatPrice(3199)}
                  </span>
                  <span className="block text-xs text-slate-400 line-through font-mono">
                    {formatPrice(3499)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Luxury Provenance Perks Strip */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-5 sm:p-6 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200/80 dark:border-white/10 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-500 flex items-center justify-center shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                Insured Courier Delivery
              </h4>
              <p className="text-[11px] font-mono text-slate-500">Over $100 Complimentary</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                Cryptographic Provenance
              </h4>
              <p className="text-[11px] font-mono text-slate-500">100% Sealed & Verified</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-500 flex items-center justify-center shrink-0">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                30-Day White-Glove Returns
              </h4>
              <p className="text-[11px] font-mono text-slate-500">Instant Full Restitution</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-500 flex items-center justify-center shrink-0">
              <Headphones className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                24/7 Concierge Hotline
              </h4>
              <p className="text-[11px] font-mono text-slate-500">Dedicated Horology Care</p>
            </div>
          </div>
        </div>
      </section>

      {/* Limited Atelier Drops (Flash Deals with Live Scarcity Timer) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-amber-500/10 via-slate-900 to-slate-950 border border-amber-500/30 rounded-3xl p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center shadow-lg shadow-amber-500/20 font-black">
                <Flame className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white font-display">
                    Exclusive Atelier Drops
                  </h2>
                  <span className="bg-rose-500 text-white text-[10px] font-mono uppercase font-black px-2 py-0.5 rounded-full">
                    Live Scarcity
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                  Limited atelier allocations. Prices and inventory lock at countdown expiry.
                </p>
              </div>
            </div>

            {/* Countdown Clock Display */}
            <div className="flex items-center gap-2 bg-white dark:bg-slate-900 px-4 py-2.5 rounded-2xl shadow-sm border border-slate-200 dark:border-white/10">
              <Clock className="w-4 h-4 text-amber-500" />
              <span className="text-xs font-mono text-slate-400 mr-1 uppercase">Closes in:</span>
              <div className="flex items-center gap-1 font-mono font-bold text-sm text-slate-900 dark:text-white">
                <span className="bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-lg">
                  {String(timeLeft.hours).padStart(2, '0')}h
                </span>
                <span>:</span>
                <span className="bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-lg">
                  {String(timeLeft.minutes).padStart(2, '0')}m
                </span>
                <span>:</span>
                <span className="bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-lg text-rose-500">
                  {String(timeLeft.seconds).padStart(2, '0')}s
                </span>
              </div>
            </div>
          </div>

          {/* Flash Deals Product Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {loading ? (
              Array(4)
                .fill(0)
                .map((_, i) => <ProductCardSkeleton key={i} />)
            ) : flashDeals.length > 0 ? (
              flashDeals.slice(0, 4).map((product) => (
                <ProductCard key={product._id} product={product} />
              ))
            ) : (
              <p className="text-xs text-slate-500 col-span-4 text-center py-8">
                No active flash drops at this moment. Check back for the next atelier release!
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Curated Master Category Lookbooks */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-amber-500 block mb-1">
              Curated Guild Portfolios
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-display">
              Master Categories
            </h2>
          </div>
          <Link
            to="/products"
            className="flex items-center gap-1 text-xs font-mono uppercase tracking-wider text-amber-500 hover:text-amber-400"
          >
            <span>View Full Vault</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <Link
                key={cat.name}
                to={`/products?category=${encodeURIComponent(cat.query)}`}
                className="group relative h-72 rounded-2xl overflow-hidden bg-slate-950 border border-slate-200/80 dark:border-white/10 shadow-lg flex flex-col justify-between p-5"
              >
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-55 group-hover:opacity-70"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
                
                {/* Top Tag */}
                <div className="relative z-10">
                  <span className="inline-block px-2 py-0.5 rounded-full text-[9px] font-mono uppercase tracking-wider bg-black/60 backdrop-blur-md text-amber-300 border border-amber-500/20">
                    {cat.tag}
                  </span>
                </div>

                {/* Bottom Details */}
                <div className="relative z-10">
                  <div className="w-8 h-8 rounded-xl bg-amber-500/20 backdrop-blur-md flex items-center justify-center text-amber-400 mb-2 border border-amber-500/30">
                    <Icon className="w-4 h-4" />
                  </div>
                  <h3 className="text-base font-bold text-white group-hover:text-amber-400 transition-colors">
                    {cat.name}
                  </h3>
                  <p className="text-xs font-mono text-slate-300 mt-0.5">{cat.itemCount}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Main Multivendor Catalog Grid with Category Tabs */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-amber-500 block mb-1">
              Verified Marketplace
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-display">
              Curated Atelier Catalog
            </h2>
          </div>

          {/* Category Filter Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto max-w-full pb-1 no-scrollbar">
            {['All', 'Computers', 'Gaming', 'Shoes', 'Mobile'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveCategoryTab(tab)}
                className={`px-4 py-1.5 rounded-full text-xs font-mono uppercase tracking-wider whitespace-nowrap transition-all ${
                  activeCategoryTab === tab
                    ? 'bg-amber-500 text-slate-950 font-bold shadow-md'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900 border border-transparent dark:border-white/5'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {loading ? (
            Array(8)
              .fill(0)
              .map((_, i) => <ProductCardSkeleton key={i} />)
          ) : filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))
          ) : (
            <div className="col-span-4 text-center py-12">
              <p className="text-sm font-mono text-slate-500">No products found in this category.</p>
            </div>
          )}
        </div>
      </section>

      {/* Flagship Atelier Partner Spotlight */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950 text-white p-8 sm:p-12 border border-amber-500/30 shadow-2xl">
          <div className="max-w-xl space-y-4">
            <span className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-amber-400 uppercase tracking-widest">
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              Verified Flagship Atelier Guild Partner
            </span>
            <h3 className="text-3xl font-black font-display tracking-tight">
              Republic of Gamers & Asus Precision Studio
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
              Forging esports-grade hardware, 0.03ms true Quantum Dot OLED monitors, and studio-grade DAC audio systems backed by 3-year platinum concierge replacement warranties.
            </p>
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <Link
                to="/shop/shop_002"
                className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs uppercase tracking-wider transition-colors shadow-md"
              >
                Inspect Official Atelier
              </Link>
              <Link
                to="/products?category=Music and Gaming"
                className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-white/10 text-xs font-mono uppercase tracking-wider transition-colors"
              >
                Browse Gaming Hardware
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;

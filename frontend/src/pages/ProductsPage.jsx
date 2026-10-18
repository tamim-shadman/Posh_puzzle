import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  SlidersHorizontal,
  Grid3X3,
  List,
  RotateCcw,
  Search,
  Check,
  Star,
} from 'lucide-react';
import ProductCard from '../components/product/ProductCard';
import { ProductCardSkeleton } from '../components/ui/Skeleton';
import Button from '../components/ui/Button';
import { useCurrency } from '../context/CurrencyContext';
import api from '../services/api';

const categoriesList = [
  'All',
  'Computers and Laptops',
  'Mobile and Tablets',
  'Music and Gaming',
  'Shoes',
  'Others',
];

const ProductsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { formatPrice } = useCurrency();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Filters state
  const selectedCategory = searchParams.get('category') || 'All';
  const searchQuery = searchParams.get('search') || '';
  const [maxPrice, setMaxPrice] = useState(3500);
  const [minRating, setMinRating] = useState(0);
  const [sortBy, setSortBy] = useState('newest');

  useEffect(() => {
    const fetchFilteredProducts = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (selectedCategory && selectedCategory !== 'All') {
          params.append('category', selectedCategory);
        }
        if (searchQuery) {
          params.append('search', searchQuery);
        }
        if (maxPrice < 3500) {
          params.append('maxPrice', maxPrice);
        }
        if (minRating > 0) {
          params.append('rating', minRating);
        }
        if (sortBy) {
          params.append('sort', sortBy);
        }

        const res = await api.get(`/products?${params.toString()}`);
        if (res.data?.success) {
          setProducts(res.data.products || []);
        }
      } catch (err) {
        console.error('Error fetching products', err);
      } finally {
        setLoading(false);
      }
    };

    fetchFilteredProducts();
  }, [selectedCategory, searchQuery, maxPrice, minRating, sortBy]);

  const handleCategorySelect = (cat) => {
    const next = new URLSearchParams(searchParams);
    if (cat === 'All') {
      next.delete('category');
    } else {
      next.set('category', cat);
    }
    setSearchParams(next);
  };

  const handleResetFilters = () => {
    setMaxPrice(3500);
    setMinRating(0);
    setSortBy('newest');
    setSearchParams({});
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-white/10">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-widest text-amber-500 block mb-1">
            Guild Vault Exploration
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white font-display">
            {searchQuery
              ? `Results for "${searchQuery}"`
              : selectedCategory !== 'All'
              ? selectedCategory
              : 'All Verified Atelier Pieces'}
          </h1>
          <p className="text-xs font-mono text-slate-400 mt-1">
            Displaying {products.length} certified multi-vendor acquisitions
          </p>
        </div>

        {/* Mobile Filter Toggle & View Switcher */}
        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
          <Button
            variant="outline"
            size="sm"
            className="lg:hidden border-amber-500/30 text-amber-500 hover:bg-amber-500/10 text-xs font-mono uppercase"
            leftIcon={<SlidersHorizontal className="w-3.5 h-3.5" />}
            onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
          >
            Filters
          </Button>

          <div className="flex items-center gap-2">
            {/* Sort Select */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-xs text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-amber-500 font-mono"
            >
              <option value="newest">Sort: Newest Drops</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
              <option value="popular">Best Selling</option>
            </select>

            {/* View Mode */}
            <div className="hidden sm:flex items-center border border-slate-200 dark:border-white/10 rounded-xl p-0.5 bg-white dark:bg-slate-900">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg transition-colors ${
                  viewMode === 'grid'
                    ? 'bg-amber-500 text-slate-950 font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
                title="Grid View"
              >
                <Grid3X3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded-lg transition-colors ${
                  viewMode === 'list'
                    ? 'bg-amber-500 text-slate-950 font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
                title="List View"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Sidebar Filters + Products */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Filters */}
        <aside
          className={`lg:block ${
            mobileFilterOpen ? 'block' : 'hidden'
          } space-y-6 bg-white dark:bg-slate-900/70 p-6 rounded-2xl border border-slate-200/80 dark:border-white/10 h-fit`}
        >
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-white/5">
            <span className="text-xs font-mono uppercase font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-amber-500" />
              Filter Atelier
            </span>
            <button
              onClick={handleResetFilters}
              className="text-xs font-mono text-amber-500 hover:underline flex items-center gap-1 font-medium"
            >
              <RotateCcw className="w-3 h-3" />
              Reset
            </button>
          </div>

          {/* Categories Filter */}
          <div className="space-y-2">
            <h4 className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
              Department
            </h4>
            <div className="space-y-1">
              {categoriesList.map((cat) => {
                const isSelected = selectedCategory === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => handleCategorySelect(cat)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium text-left transition-colors ${
                      isSelected
                        ? 'bg-amber-500/15 text-amber-400 font-bold border border-amber-500/30'
                        : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    <span>{cat}</span>
                    {isSelected && <Check className="w-3.5 h-3.5 text-amber-400" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Price Range Slider */}
          <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-white/5">
            <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
              <span className="font-mono text-[10px] uppercase text-slate-400">Max Valuation</span>
              <span className="text-amber-500 font-mono">{formatPrice(maxPrice)}</span>
            </div>
            <input
              type="range"
              min="100"
              max="3500"
              step="50"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full accent-amber-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-mono">
              <span>{formatPrice(100)}</span>
              <span>{formatPrice(3500)}</span>
            </div>
          </div>

          {/* Customer Rating Filter */}
          <div className="space-y-2 pt-4 border-t border-slate-100 dark:border-white/5">
            <h4 className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
              Minimum Rating
            </h4>
            <div className="space-y-1.5">
              {[4.5, 4.0, 3.5].map((star) => (
                <button
                  key={star}
                  onClick={() => setMinRating(minRating === star ? 0 : star)}
                  className={`w-full flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs transition-colors ${
                    minRating === star
                      ? 'bg-amber-500/15 text-amber-400 font-bold border border-amber-500/30'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  <div className="flex text-amber-400">
                    {Array(Math.floor(star))
                      .fill(0)
                      .map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-current" />
                      ))}
                  </div>
                  <span className="font-mono text-xs">{star} & above</span>
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Product Catalog Display */}
        <main className="lg:col-span-3">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array(6)
                .fill(0)
                .map((_, i) => (
                  <ProductCardSkeleton key={i} />
                ))}
            </div>
          ) : products.length > 0 ? (
            <div
              className={
                viewMode === 'grid'
                  ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'
                  : 'space-y-4'
              }
            >
              {products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          ) : (
            /* Empty State */
            <div className="text-center py-20 bg-white dark:bg-slate-900/60 rounded-3xl border border-slate-200/80 dark:border-white/10 p-8 space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center mx-auto border border-amber-500/20">
                <Search className="w-8 h-8" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white font-mono uppercase tracking-wider">
                No matching atelier pieces found
              </h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto font-sans">
                We couldn't find any items matching your active filter criteria. Try resetting price or category parameters.
              </p>
              <Button variant="primary" size="md" className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold uppercase text-xs tracking-wider" onClick={handleResetFilters}>
                Clear All Filters
              </Button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default ProductsPage;

import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ShieldCheck, MapPin, Star, Package } from 'lucide-react';
import ProductCard from '../components/product/ProductCard';
import { ProductCardSkeleton } from '../components/ui/Skeleton';
import api from '../services/api';

const ShopDetailsPage = () => {
  const { id } = useParams();
  const [shop, setShop] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchShopData = async () => {
      setLoading(true);
      try {
        const [shopRes, productsRes] = await Promise.all([
          api.get(`/shops/${id}`),
          api.get(`/shops/${id}/products`),
        ]);

        if (shopRes.data?.success) setShop(shopRes.data.shop);
        if (productsRes.data?.success) setProducts(productsRes.data.products || []);
      } catch (err) {
        console.error('Failed to load shop', err);
      } finally {
        setLoading(false);
      }
    };

    fetchShopData();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 space-y-8">
        <div className="w-full h-48 bg-slate-200 dark:bg-slate-800 rounded-3xl animate-pulse" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array(4).fill(0).map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  if (!shop) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h2 className="text-xl font-bold text-slate-800 dark:text-white">Vendor Store Not Found</h2>
        <Link to="/products" className="text-xs text-brand-600 hover:underline mt-2 inline-block">
          Explore all marketplace products
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Shop Banner & Header */}
      <div className="relative rounded-3xl overflow-hidden bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-card">
        <img
          src={shop.banner || 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1200&q=80'}
          alt={shop.name}
          className="w-full h-56 sm:h-64 object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

        <div className="absolute bottom-6 left-6 right-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="flex items-center gap-4">
            <img
              src={shop.avatar || 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=150&q=80'}
              alt={shop.name}
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover ring-4 ring-white/20 shadow-xl"
            />
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-white font-display">
                  {shop.name}
                </h1>
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
              </div>
              <p className="text-xs text-slate-300 max-w-lg line-clamp-2">
                {shop.description}
              </p>
              <div className="flex items-center gap-4 text-xs text-slate-400 pt-1">
                <div className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>{shop.address}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Package className="w-3.5 h-3.5" />
                  <span>{products.length} Products</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-white/10 text-right shrink-0">
            <span className="text-[10px] text-slate-300 uppercase font-bold tracking-wider block">
              Store Rating
            </span>
            <div className="flex items-center justify-end gap-1 mt-0.5">
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              <span className="text-lg font-black text-white font-display">
                {shop.ratings || 4.9}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Vendor's Product Catalog */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold font-display text-slate-900 dark:text-white">
            Available Products from this Store ({products.length})
          </h2>
        </div>

        {products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
            <p className="text-xs text-slate-500">No products currently active in this store catalog.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShopDetailsPage;

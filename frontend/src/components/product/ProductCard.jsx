import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, Eye, Store, Check, SlidersHorizontal, ShieldCheck, Sparkles } from 'lucide-react';
import RatingStars from '../ui/RatingStars';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useCurrency } from '../../context/CurrencyContext';
import { useComparison } from '../../context/ComparisonContext';
import AuthenticityCertificateModal from './AuthenticityCertificateModal';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { formatPrice } = useCurrency();
  const { isInCompare, toggleCompare } = useComparison();

  const [quickViewOpen, setQuickViewOpen] = useState(false);
  const [certModalOpen, setCertModalOpen] = useState(false);
  const [added, setAdded] = useState(false);

  const pId = product._id || product.id;
  const isSaved = isInWishlist(pId);
  const isCompared = isInCompare(pId);

  const discountPercent =
    product.originalPrice && product.discountPrice
      ? Math.round(((product.originalPrice - product.discountPrice) / product.originalPrice) * 100)
      : null;

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const handleToggleCompare = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleCompare(product);
  };

  const handleOpenCert = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setCertModalOpen(true);
  };

  return (
    <>
      <div className="group relative bg-white dark:bg-slate-900/90 border border-slate-200/90 dark:border-white/10 rounded-2xl p-3 sm:p-4 transition-all duration-300 hover:shadow-2xl hover:border-amber-500/40 hover:-translate-y-1 flex flex-col justify-between">
        {/* Top Badges & Image Showcase */}
        <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-950 mb-3">
          <Link to={`/product/${pId}`}>
            <img
              src={product.images?.[0] || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80'}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          </Link>

          {/* Badges Overlay */}
          <div className="absolute top-2 left-2 flex flex-col gap-1 z-10">
            {discountPercent && discountPercent > 0 && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-500 text-slate-950 shadow-sm">
                -{discountPercent}%
              </span>
            )}
            {product.isFlashDeal && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-rose-500 text-white shadow-sm">
                <Sparkles className="w-2.5 h-2.5" />
                DROP
              </span>
            )}
            {product.stock <= 5 && product.stock > 0 && (
              <span className="px-2 py-0.5 rounded-full text-[9px] font-mono font-bold bg-rose-500/90 text-white shadow-sm">
                {product.stock} REMAINING
              </span>
            )}
          </div>

          {/* Action Buttons Overlay */}
          <div className="absolute top-2 right-2 flex flex-col gap-1.5 z-10">
            {/* Wishlist Toggle */}
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                toggleWishlist(product);
              }}
              className={`w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-md shadow-sm transition-all duration-200 ${
                isSaved
                  ? 'bg-rose-500 text-white'
                  : 'bg-white/90 dark:bg-slate-900/90 text-slate-700 dark:text-slate-200 hover:bg-white dark:hover:bg-slate-900'
              }`}
              title={isSaved ? 'Remove from wishlist' : 'Save to wishlist'}
              aria-label={isSaved ? `Remove ${product.name} from wishlist` : `Save ${product.name} to wishlist`}
            >
              <Heart className={`w-3.5 h-3.5 ${isSaved ? 'fill-current' : ''}`} />
            </button>

            {/* Compare Toggle */}
            <button
              onClick={handleToggleCompare}
              className={`w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-md shadow-sm transition-all duration-200 ${
                isCompared
                  ? 'bg-amber-500 text-slate-950 shadow-md font-bold'
                  : 'bg-white/90 dark:bg-slate-900/90 text-slate-700 dark:text-slate-200 hover:bg-white dark:hover:bg-slate-900'
              }`}
              title={isCompared ? 'Remove from compare' : 'Add to side-by-side compare'}
              aria-label={`Toggle comparison for ${product.name}`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
            </button>

            {/* Quick Preview */}
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setQuickViewOpen(true);
              }}
              className="w-8 h-8 rounded-full bg-white/90 dark:bg-slate-900/90 hover:bg-white dark:hover:bg-slate-900 text-slate-700 dark:text-slate-200 flex items-center justify-center backdrop-blur-md shadow-sm transition-all duration-200 opacity-0 group-hover:opacity-100"
              title="Quick preview"
              aria-label={`Quick preview ${product.name}`}
            >
              <Eye className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Certificate Provenance Trigger Badge at Image Bottom */}
          <button
            onClick={handleOpenCert}
            className="absolute bottom-2 left-2 right-2 px-2 py-1 rounded-lg bg-slate-950/80 hover:bg-slate-950 backdrop-blur-md border border-amber-500/30 text-amber-300 text-[10px] font-mono flex items-center justify-center gap-1.5 opacity-90 group-hover:opacity-100 transition-opacity"
            title="Inspect Cryptographic Certificate of Authenticity"
          >
            <ShieldCheck className="w-3 h-3 text-amber-400" />
            <span className="truncate uppercase tracking-wider">Atelier Provenance</span>
          </button>
        </div>

        {/* Content Section */}
        <div className="flex-1 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1 font-mono">
              <span className="truncate uppercase tracking-wider">{product.category}</span>
              {product.shop && (
                <Link
                  to={`/shop/${product.shopId || product.shop._id}`}
                  className="flex items-center gap-1 text-slate-400 hover:text-amber-500 truncate max-w-[120px] transition-colors"
                >
                  <Store className="w-3 h-3 text-amber-500" />
                  <span className="truncate">{product.shop.name}</span>
                </Link>
              )}
            </div>

            <Link
              to={`/product/${pId}`}
              className="text-sm font-bold text-slate-900 dark:text-slate-100 hover:text-amber-500 dark:hover:text-amber-400 line-clamp-2 transition-colors tracking-tight"
              title={product.name}
            >
              {product.name}
            </Link>

            <div className="mt-2">
              <RatingStars
                rating={product.ratings || 4.8}
                count={product.reviews?.length || product.soldCount || 12}
                size="sm"
              />
            </div>
          </div>

          {/* Pricing & Add to Bag CTA */}
          <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-100 dark:border-white/5">
            <div className="flex flex-col">
              <span className="text-base sm:text-lg font-black text-slate-900 dark:text-white font-mono tracking-tight">
                {formatPrice(product.discountPrice)}
              </span>
              {product.originalPrice && product.originalPrice > product.discountPrice && (
                <span className="text-xs text-slate-400 line-through font-mono">
                  {formatPrice(product.originalPrice)}
                </span>
              )}
            </div>

            <button
              onClick={handleAddToCart}
              className={`p-2.5 rounded-xl font-bold flex items-center justify-center transition-all duration-200 ${
                added
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'bg-amber-500 hover:bg-amber-600 text-slate-950 shadow-sm'
              }`}
              title="Add to Bag"
              aria-label={added ? `Added ${product.name} to bag` : `Add ${product.name} to bag`}
            >
              {added ? <Check className="w-4 h-4" /> : <ShoppingBag className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>

      {/* Quick View Modal */}
      <Modal
        isOpen={quickViewOpen}
        onClose={() => setQuickViewOpen(false)}
        title="Atelier Quick Look"
        maxWidth="max-w-2xl"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="aspect-square rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-950">
            <img
              src={product.images?.[0]}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="flex flex-col justify-between">
            <div className="space-y-3">
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono uppercase bg-amber-500/10 text-amber-400 border border-amber-500/20">
                {product.category}
              </span>
              <h4 className="text-lg font-bold text-slate-900 dark:text-white">
                {product.name}
              </h4>
              <RatingStars rating={product.ratings || 5} count={product.reviews?.length || 10} />
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-black text-amber-500 font-mono">
                  {formatPrice(product.discountPrice)}
                </span>
                {product.originalPrice && (
                  <span className="text-sm text-slate-400 line-through font-mono">
                    {formatPrice(product.originalPrice)}
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-4 leading-relaxed">
                {product.description}
              </p>
            </div>

            <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col gap-2">
              <div className="flex gap-2">
                <Button
                  variant="primary"
                  size="md"
                  className="flex-1 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold"
                  leftIcon={<ShoppingBag className="w-4 h-4" />}
                  onClick={() => {
                    addToCart(product, 1);
                    setQuickViewOpen(false);
                  }}
                >
                  Add to Bag
                </Button>
                <button
                  onClick={() => {
                    setQuickViewOpen(false);
                    setCertModalOpen(true);
                  }}
                  className="px-3 py-2 rounded-xl border border-amber-500/30 text-amber-400 text-xs font-mono hover:bg-amber-500/10 transition-colors"
                  title="Inspect Provenance Certificate"
                >
                  <ShieldCheck className="w-4 h-4" />
                </button>
              </div>
              <Link
                to={`/product/${pId}`}
                onClick={() => setQuickViewOpen(false)}
                className="inline-flex items-center justify-center px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-mono uppercase text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 text-center"
              >
                Inspect Full Specifications
              </Link>
            </div>
          </div>
        </div>
      </Modal>

      {/* Authenticity Certificate Modal */}
      <AuthenticityCertificateModal
        isOpen={certModalOpen}
        onClose={() => setCertModalOpen(false)}
        product={product}
      />
    </>
  );
};

export default ProductCard;

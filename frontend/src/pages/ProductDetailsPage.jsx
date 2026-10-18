import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Heart,
  ShoppingBag,
  ShieldCheck,
  Truck,
  RotateCcw,
  Star,
  Plus,
  Minus,
  MessageSquare,
  SlidersHorizontal,
} from 'lucide-react';
import RatingStars from '../components/ui/RatingStars';
import Button from '../components/ui/Button';
import { Skeleton } from '../components/ui/Skeleton';
import ProductCard from '../components/product/ProductCard';
import AuthenticityCertificateModal from '../components/product/AuthenticityCertificateModal';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useCurrency } from '../context/CurrencyContext';
import { useComparison } from '../context/ComparisonContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import api from '../services/api';

const ProductDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, openCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { formatPrice } = useCurrency();
  const { isInCompare, toggleCompare } = useComparison();
  const { user } = useAuth();
  const { addToast } = useToast();

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [selectedImage, setSelectedImage] = useState(0);
  const [qty, setQty] = useState(1);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('specs');
  const [certModalOpen, setCertModalOpen] = useState(false);

  // Review Form state
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/products/${id}`);
        if (res.data?.success) {
          const prod = res.data.product;
          setProduct(prod);
          setSelectedImage(0);

          // Fetch related
          const relatedRes = await api.get(
            `/products?category=${encodeURIComponent(prod.category)}&limit=4`
          );
          if (relatedRes.data?.success) {
            setRelatedProducts(
              (relatedRes.data.products || []).filter((p) => p._id !== prod._id)
            );
          }
        }
      } catch (err) {
        console.error('Failed to load product details', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <Skeleton className="w-full aspect-square rounded-3xl" />
          <div className="space-y-4">
            <Skeleton className="w-24 h-6 rounded-full" />
            <Skeleton className="w-full h-10 rounded-xl" />
            <Skeleton className="w-48 h-6 rounded-lg" />
            <Skeleton className="w-36 h-12 rounded-xl mt-6" />
            <Skeleton className="w-full h-32 rounded-2xl mt-4" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h2 className="text-xl font-bold text-slate-800 dark:text-white">Piece Not Found</h2>
        <Button variant="primary" size="md" className="mt-4 bg-amber-500 text-slate-950 font-bold" onClick={() => navigate('/products')}>
          Return to Guild Catalog
        </Button>
      </div>
    );
  }

  const pId = product._id || product.id;
  const isSaved = isInWishlist(pId);
  const isCompared = isInCompare(pId);

  const discountPercent =
    product.originalPrice && product.discountPrice
      ? Math.round(((product.originalPrice - product.discountPrice) / product.originalPrice) * 100)
      : null;
  const savingsAmount = product.originalPrice ? product.originalPrice - product.discountPrice : 0;

  const handleAddToCart = () => {
    addToCart(product, qty);
  };

  const handleBuyNow = () => {
    addToCart(product, qty);
    openCart();
    navigate('/checkout');
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      addToast({
        type: 'warning',
        title: 'Authentication Required',
        message: 'Please sign in to submit a verified connoisseur review',
      });
      return;
    }
    if (!newComment.trim()) {
      addToast({
        type: 'warning',
        title: 'Empty Review',
        message: 'Please provide feedback for the atelier piece.',
      });
      return;
    }

    setIsSubmittingReview(true);
    try {
      const res = await api.post(`/products/${product._id}/reviews`, {
        rating: newRating,
        comment: newComment.trim(),
      });
      if (res.data?.success) {
        setProduct(res.data.product);
        setNewComment('');
        addToast({
          type: 'success',
          title: 'Review Authenticated',
          message: 'Your verified feedback has been published.',
        });
      }
    } catch (err) {
      addToast({
        type: 'error',
        title: 'Review Failed',
        message: err.message || 'Failed to submit review',
      });
    } finally {
      setIsSubmittingReview(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      {/* Breadcrumb Navigation */}
      <nav className="text-xs font-mono text-slate-400 flex items-center gap-2 uppercase tracking-wider">
        <Link to="/" className="hover:text-amber-500 transition-colors">
          Atelier Home
        </Link>
        <span>/</span>
        <Link
          to={`/products?category=${encodeURIComponent(product.category)}`}
          className="hover:text-amber-500 transition-colors"
        >
          {product.category}
        </Link>
        <span>/</span>
        <span className="text-slate-800 dark:text-slate-200 font-semibold truncate max-w-xs">
          {product.name}
        </span>
      </nav>

      {/* Main Product Showcase: Gallery + Buy Box */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        {/* Gallery */}
        <div className="space-y-4">
          <div className="relative aspect-square rounded-3xl overflow-hidden bg-slate-100 dark:bg-slate-950 border border-slate-200/80 dark:border-white/10 shadow-2xl group">
            <img
              src={
                product.images?.[selectedImage] ||
                'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1000&q=80'
              }
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            {discountPercent && (
              <div className="absolute top-4 left-4">
                <span className="px-3 py-1 rounded-full text-xs font-mono font-bold uppercase bg-amber-500 text-slate-950 shadow-md">
                  Save {discountPercent}%
                </span>
              </div>
            )}
          </div>

          {/* Thumbnails */}
          {product.images && product.images.length > 1 && (
            <div className="flex items-center gap-3 overflow-x-auto pb-2">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-all shrink-0 ${
                    selectedImage === idx
                      ? 'border-amber-500 ring-2 ring-amber-500/30'
                      : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Buy Box & Specs */}
        <div className="space-y-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase bg-amber-500/10 text-amber-400 border border-amber-500/20">
                {product.category}
              </span>
              {product.stock > 0 ? (
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  In Stock ({product.stock} units)
                </span>
              ) : (
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase bg-rose-500/10 text-rose-400 border border-rose-500/20">
                  Made to Order
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white font-display tracking-tight leading-tight">
              {product.name}
            </h1>

            {/* Ratings & Sold Count */}
            <div className="flex items-center gap-4 text-xs text-slate-500 font-mono">
              <RatingStars
                rating={product.ratings || 5.0}
                count={product.reviews?.length || 15}
                size="md"
              />
              <span>•</span>
              <span className="font-semibold text-slate-700 dark:text-slate-300">
                {product.soldCount || 85} Acquired
              </span>
            </div>
          </div>

          {/* Price & Savings */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-white/10 flex items-baseline justify-between">
            <div>
              <span className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white font-mono">
                {formatPrice(product.discountPrice)}
              </span>
              {product.originalPrice && product.originalPrice > product.discountPrice && (
                <span className="ml-3 text-sm text-slate-400 line-through font-mono">
                  {formatPrice(product.originalPrice)}
                </span>
              )}
            </div>
            {savingsAmount > 0 && (
              <span className="text-xs font-mono font-bold text-emerald-500 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                Save {formatPrice(savingsAmount)}
              </span>
            )}
          </div>

          {/* Cryptographic Certificate Trigger Banner */}
          <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <ShieldCheck className="w-5 h-5 text-amber-400 shrink-0" />
              <div>
                <span className="text-xs font-bold text-white block">Cryptographic Atelier Provenance</span>
                <span className="text-[10px] font-mono text-amber-300/80 uppercase">Tamper-Proof Blockchain Ledger</span>
              </div>
            </div>
            <button
              onClick={() => setCertModalOpen(true)}
              className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-[11px] font-mono uppercase tracking-wider transition-colors shadow-sm"
            >
              Inspect Certificate
            </button>
          </div>

          {/* Quantity Controls & CTA Buttons */}
          <div className="space-y-4 pt-2">
            <div className="flex items-center gap-4">
              <span className="text-xs font-mono uppercase font-bold text-slate-700 dark:text-slate-300">Acquisition Qty</span>
              <div className="flex items-center gap-3 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-1.5 bg-white dark:bg-slate-950">
                <button
                  type="button"
                  onClick={() => setQty(Math.max(1, qty - 1))}
                  disabled={product.stock <= 0}
                  aria-label="Decrease quantity"
                  className="text-slate-400 hover:text-slate-700 dark:hover:text-white disabled:opacity-40 transition-colors"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="text-sm font-bold w-6 text-center text-slate-900 dark:text-white font-mono">
                  {product.stock > 0 ? qty : 0}
                </span>
                <button
                  type="button"
                  onClick={() => setQty(Math.min(product.stock || 99, qty + 1))}
                  disabled={product.stock <= 0}
                  aria-label="Increase quantity"
                  className="text-slate-400 hover:text-slate-700 dark:hover:text-white disabled:opacity-40 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button
                variant="primary"
                size="lg"
                className="flex-1 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold uppercase tracking-wider text-xs"
                disabled={product.stock <= 0}
                leftIcon={<ShoppingBag className="w-4 h-4" />}
                onClick={handleAddToCart}
              >
                {product.stock > 0 ? 'Add to Bag' : 'Sold Out'}
              </Button>

              <Button
                variant="accent"
                size="lg"
                className="flex-1 bg-slate-900 hover:bg-slate-800 text-white border border-white/10 font-mono uppercase text-xs tracking-wider"
                disabled={product.stock <= 0}
                onClick={handleBuyNow}
              >
                Express Checkout
              </Button>

              {/* Side-by-Side Comparison Toggle */}
              <button
                type="button"
                onClick={() => toggleCompare(product)}
                aria-label={isCompared ? `Remove from comparison` : `Compare side by side`}
                className={`p-3.5 rounded-2xl border transition-all ${
                  isCompared
                    ? 'bg-amber-500 border-amber-500 text-slate-950 shadow-md'
                    : 'border-slate-200 dark:border-slate-800 text-slate-400 hover:text-amber-500 hover:border-amber-500/50'
                }`}
                title={isCompared ? 'Remove from compare' : 'Add to side-by-side compare'}
              >
                <SlidersHorizontal className="w-5 h-5" />
              </button>

              {/* Wishlist Toggle */}
              <button
                type="button"
                onClick={() => toggleWishlist(product)}
                aria-label={isSaved ? `Remove ${product.name} from wishlist` : `Save ${product.name} to wishlist`}
                className={`p-3.5 rounded-2xl border transition-all ${
                  isSaved
                    ? 'bg-rose-50 border-rose-200 text-rose-500'
                    : 'border-slate-200 dark:border-slate-800 text-slate-400 hover:text-rose-500'
                }`}
                title={isSaved ? 'Remove from wishlist' : 'Save to wishlist'}
              >
                <Heart className={`w-5 h-5 ${isSaved ? 'fill-current' : ''}`} />
              </button>
            </div>
          </div>

          {/* Vendor Atelier Partner Card */}
          {product.shop && (
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200/80 dark:border-white/10 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <img
                  src={
                    product.shop.avatar ||
                    'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=100&q=80'
                  }
                  alt={product.shop.name}
                  className="w-12 h-12 rounded-xl object-cover ring-2 ring-amber-500/20"
                />
                <div>
                  <div className="flex items-center gap-1.5">
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                      {product.shop.name}
                    </h4>
                    <ShieldCheck className="w-4 h-4 text-emerald-500" />
                  </div>
                  <RatingStars rating={product.shop.ratings || 4.9} size="sm" showScore={true} />
                </div>
              </div>

              <Link to={`/shop/${product.shopId || product.shop._id}`}>
                <Button variant="outline" size="sm" className="font-mono text-xs uppercase border-amber-500/30 text-amber-500 hover:bg-amber-500/10">
                  Inspect Atelier
                </Button>
              </Link>
            </div>
          )}

          {/* Trust Guarantees */}
          <div className="grid grid-cols-2 gap-3 pt-2 text-xs font-mono text-slate-400">
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-amber-500" />
              <span>Free Insured Courier Delivery</span>
            </div>
            <div className="flex items-center gap-2">
              <RotateCcw className="w-4 h-4 text-emerald-500" />
              <span>30-Day White-Glove Returns</span>
            </div>
          </div>
        </div>
      </div>

      {/* Product Information Tabs */}
      <div className="pt-8 border-t border-slate-200 dark:border-white/10 space-y-6">
        <div className="flex items-center gap-4 border-b border-slate-200 dark:border-white/10">
          <button
            onClick={() => setActiveTab('specs')}
            className={`pb-3 text-xs font-mono uppercase tracking-wider font-bold transition-all relative ${
              activeTab === 'specs'
                ? 'text-amber-500 border-b-2 border-amber-500'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Technical Specifications & Architecture
          </button>
          <button
            onClick={() => setActiveTab('reviews')}
            className={`pb-3 text-xs font-mono uppercase tracking-wider font-bold transition-all relative ${
              activeTab === 'reviews'
                ? 'text-amber-500 border-b-2 border-amber-500'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Connoisseur Reviews ({product.reviews?.length || 0})
          </button>
        </div>

        {activeTab === 'specs' ? (
          <div className="bg-white dark:bg-slate-900/60 p-6 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-white/10 space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white font-mono uppercase tracking-wider">
              Atelier Architectural Summary
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line font-sans">
              {product.description}
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Reviews List */}
            <div className="space-y-4">
              {product.reviews && product.reviews.length > 0 ? (
                product.reviews.map((rev) => (
                  <div
                    key={rev._id}
                    className="p-5 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200/80 dark:border-white/10 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={
                            rev.user?.avatar ||
                            'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80'
                          }
                          alt=""
                          className="w-8 h-8 rounded-full object-cover"
                        />
                        <span className="text-xs font-bold text-slate-900 dark:text-white">
                          {rev.user?.name || 'Verified Connoisseur'}
                        </span>
                      </div>
                      <RatingStars rating={rev.rating} size="sm" showScore={false} />
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                      "{rev.comment}"
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-xs font-mono text-slate-500 py-4">
                  No connoisseur reviews yet. Be the first to verify this artisan piece!
                </p>
              )}
            </div>

            {/* Write a Review Box */}
            <form
              onSubmit={handleReviewSubmit}
              className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-white/10 space-y-4 max-w-xl"
            >
              <h4 className="text-xs font-bold font-mono uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-amber-500" />
                Submit Connoisseur Review
              </h4>

              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-slate-400">Rating:</span>
                <div className="flex gap-1 text-amber-400">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setNewRating(star)}
                      className="p-0.5"
                    >
                      <Star
                        className={`w-4 h-4 ${
                          newRating >= star ? 'fill-amber-400' : 'text-slate-300'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <textarea
                rows="3"
                placeholder="Detail craftsmanship, tactile finishing, latency, and material composition..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="w-full p-3 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
              />

              <Button
                type="submit"
                variant="primary"
                size="sm"
                className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold uppercase tracking-wider text-xs"
                isLoading={isSubmittingReview}
              >
                Publish Feedback
              </Button>
            </form>
          </div>
        )}
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="pt-12 space-y-6">
          <h3 className="text-xl font-bold font-display text-slate-900 dark:text-white">
            Related Atelier Selections
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        </div>
      )}

      {/* Authenticity Certificate Modal */}
      <AuthenticityCertificateModal
        isOpen={certModalOpen}
        onClose={() => setCertModalOpen(false)}
        product={product}
      />
    </div>
  );
};

export default ProductDetailsPage;

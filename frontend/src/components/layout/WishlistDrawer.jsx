import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Trash2, Heart, ShoppingBag, ArrowRight } from 'lucide-react';
import Drawer from '../ui/Drawer';
import Button from '../ui/Button';
import { useWishlist } from '../../context/WishlistContext';
import { useCart } from '../../context/CartContext';

const WishlistDrawer = () => {
  const navigate = useNavigate();
  const { isWishlistOpen, closeWishlist, wishlistItems, removeFromWishlist } = useWishlist();
  const { addToCart, openCart } = useCart();

  const handleMoveToBag = (product) => {
    addToCart(product, 1);
    removeFromWishlist(product.productId || product._id);
    closeWishlist();
    openCart();
  };

  return (
    <Drawer isOpen={isWishlistOpen} onClose={closeWishlist} title="Saved Items">
      {wishlistItems.length === 0 ? (
        <div className="h-full flex flex-col items-center justify-center text-center p-6 gap-4">
          <div className="w-16 h-16 rounded-2xl bg-rose-50 dark:bg-rose-950/60 flex items-center justify-center text-rose-500">
            <Heart className="w-8 h-8" />
          </div>
          <div>
            <h4 className="text-base font-bold text-slate-900 dark:text-white">
              No saved items yet
            </h4>
            <p className="text-xs text-slate-500 mt-1 max-w-xs">
              Click the heart icon on any product to save your favorites here for later.
            </p>
          </div>
          <Button
            variant="primary"
            size="md"
            onClick={() => {
              closeWishlist();
              navigate('/products');
            }}
          >
            Explore Catalog
          </Button>
        </div>
      ) : (
        <div className="flex flex-col h-full gap-3">
          <div className="flex-1 overflow-y-auto space-y-3 pr-1">
            {wishlistItems.map((item) => (
              <div
                key={item.productId || item._id}
                className="flex gap-3 p-3 bg-white dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 rounded-xl"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-16 h-16 rounded-lg object-cover bg-slate-100 dark:bg-slate-800 shrink-0"
                />
                <div className="flex-1 min-w-0 flex flex-col justify-between">
                  <div>
                    <h5 className="text-xs font-semibold text-slate-900 dark:text-slate-100 line-clamp-1">
                      {item.name}
                    </h5>
                    <span className="text-xs font-bold text-brand-600 dark:text-brand-400 mt-1 block">
                      ${item.price}
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-2 mt-2">
                    <Button
                      variant="primary"
                      size="sm"
                      className="text-xs py-1 px-3"
                      leftIcon={<ShoppingBag className="w-3.5 h-3.5" />}
                      onClick={() => handleMoveToBag(item)}
                    >
                      Move to Bag
                    </Button>
                    <button
                      onClick={() => removeFromWishlist(item.productId || item._id)}
                      aria-label={`Remove ${item.name} from wishlist`}
                      className="text-slate-400 hover:text-rose-500 transition-colors p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <Button
            variant="outline"
            size="md"
            className="w-full mt-2"
            rightIcon={<ArrowRight className="w-4 h-4" />}
            onClick={() => {
              closeWishlist();
              navigate('/products');
            }}
          >
            Continue Shopping
          </Button>
        </div>
      )}
    </Drawer>
  );
};

export default WishlistDrawer;

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from './ToastContext';

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const { toast } = useToast();
  const [wishlistItems, setWishlistItems] = useState(() => {
    try {
      const saved = localStorage.getItem('posh_puzzle_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  const [isWishlistOpen, setIsWishlistOpen] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem('posh_puzzle_wishlist', JSON.stringify(wishlistItems));
    } catch (e) {
      console.error('Failed to save wishlist', e);
    }
  }, [wishlistItems]);

  const isInWishlist = (productId) => {
    return wishlistItems.some((item) => item.productId === productId || item._id === productId);
  };

  const toggleWishlist = (product) => {
    const pId = product._id || product.id || product.productId;
    if (isInWishlist(pId)) {
      setWishlistItems((prev) => prev.filter((item) => (item.productId || item._id) !== pId));
      toast.info('Removed from saved wishlist');
    } else {
      const item = {
        productId: pId,
        _id: pId,
        name: product.name,
        price: product.discountPrice || product.price,
        originalPrice: product.originalPrice || product.price,
        image: product.images?.[0] || product.image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=300&q=80',
        stock: product.stock || 10,
        ratings: product.ratings || 5.0,
      };
      setWishlistItems((prev) => [...prev, item]);
      toast.success('Saved to your wishlist!');
    }
  };

  const removeFromWishlist = (productId) => {
    setWishlistItems((prev) => prev.filter((item) => (item.productId || item._id) !== productId));
    toast.info('Removed from wishlist');
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlistItems,
        itemCount: wishlistItems.length,
        isInWishlist,
        toggleWishlist,
        removeFromWishlist,
        isWishlistOpen,
        openWishlist: () => setIsWishlistOpen(true),
        closeWishlist: () => setIsWishlistOpen(false),
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => useContext(WishlistContext);

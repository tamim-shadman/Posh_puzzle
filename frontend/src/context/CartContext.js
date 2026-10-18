import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
import { useToast } from './ToastContext';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { toast } = useToast();
  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem('posh_puzzle_cart');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  const [coupon, setCoupon] = useState(null);
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem('posh_puzzle_cart', JSON.stringify(cartItems));
    } catch (e) {
      console.error('Failed to save cart to localStorage', e);
    }
  }, [cartItems]);

  const addToCart = (product, qty = 1) => {
    const pId = product._id || product.id;
    setCartItems((prev) => {
      const existing = prev.find((item) => item.productId === pId);
      if (existing) {
        const newQty = Math.min(existing.qty + qty, product.stock || 99);
        return prev.map((item) =>
          item.productId === pId ? { ...item, qty: newQty } : item
        );
      } else {
        const newItem = {
          productId: pId,
          name: product.name,
          price: product.discountPrice || product.price,
          originalPrice: product.originalPrice || product.price,
          qty,
          image: product.images?.[0] || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=300&q=80',
          shopId: product.shopId || product.shop?._id || 'shop_001',
          shopName: product.shop?.name || 'Authorized Store',
          stock: product.stock || 10,
        };
        return [...prev, newItem];
      }
    });

    toast.success(`Added ${product.name.slice(0, 30)}... to bag!`);
  };

  const removeFromCart = (productId) => {
    setCartItems((prev) => prev.filter((item) => item.productId !== productId));
    toast.info('Item removed from bag');
  };

  const updateQty = (productId, qty) => {
    if (qty <= 0) {
      removeFromCart(productId);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) => {
        if (item.productId === productId) {
          const validQty = Math.min(qty, item.stock || 99);
          return { ...item, qty: validQty };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setCartItems([]);
    setCoupon(null);
    localStorage.removeItem('posh_puzzle_cart');
  };

  const applyCoupon = async (code) => {
    try {
      const currentSubtotal = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);
      const res = await api.post('/events/validate-coupon', {
        code,
        cartTotal: currentSubtotal,
      });

      if (res.data?.success) {
        setCoupon(res.data.coupon);
        toast.success(res.data.message || 'Coupon applied successfully!');
        return { success: true };
      }
    } catch (err) {
      toast.error(err.message || 'Invalid coupon code');
      return { success: false, error: err.message };
    }
  };

  const removeCoupon = () => {
    setCoupon(null);
    toast.info('Coupon removed');
  };

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.qty, 0);
  const discountAmount = coupon ? (coupon.discountAmount || (subtotal * coupon.discountPercentage) / 100) : 0;
  const shipping = subtotal > 100 || subtotal === 0 ? 0 : 15;
  const total = Math.max(0, subtotal - discountAmount + shipping);
  const itemCount = cartItems.reduce((sum, item) => sum + item.qty, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        itemCount,
        subtotal: Math.round(subtotal * 100) / 100,
        discountAmount: Math.round(discountAmount * 100) / 100,
        shipping,
        total: Math.round(total * 100) / 100,
        coupon,
        isCartOpen,
        openCart: () => setIsCartOpen(true),
        closeCart: () => setIsCartOpen(false),
        addToCart,
        removeFromCart,
        updateQty,
        clearCart,
        applyCoupon,
        removeCoupon,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);

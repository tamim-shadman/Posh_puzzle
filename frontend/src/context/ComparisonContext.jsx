import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from './ToastContext';

const ComparisonContext = createContext();

export const MAX_COMPARE_LIMIT = 4;

export const ComparisonProvider = ({ children }) => {
  const { addToast } = useToast();
  const [comparedProducts, setComparedProducts] = useState(() => {
    try {
      const saved = localStorage.getItem('posh_puzzle_comparison');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem('posh_puzzle_comparison', JSON.stringify(comparedProducts));
    } catch (err) {
      console.warn('Failed to persist comparison list', err);
    }
  }, [comparedProducts]);

  const isInCompare = (productId) => {
    return comparedProducts.some((p) => (p._id || p.id) === productId);
  };

  const addToCompare = (product) => {
    const pId = product._id || product.id;
    if (isInCompare(pId)) {
      addToast({
        type: 'info',
        title: 'Already in Comparison',
        message: `${product.name} is already in your comparison dock.`,
      });
      return;
    }

    if (comparedProducts.length >= MAX_COMPARE_LIMIT) {
      addToast({
        type: 'warning',
        title: 'Comparison Limit Reached',
        message: `You can compare up to ${MAX_COMPARE_LIMIT} luxury pieces simultaneously.`,
      });
      return;
    }

    setComparedProducts((prev) => [...prev, product]);
    addToast({
      type: 'success',
      title: 'Added to Comparison',
      message: `${product.name} added to comparison dock.`,
    });
  };

  const removeFromCompare = (productId) => {
    setComparedProducts((prev) => prev.filter((p) => (p._id || p.id) !== productId));
  };

  const toggleCompare = (product) => {
    const pId = product._id || product.id;
    if (isInCompare(pId)) {
      removeFromCompare(pId);
      addToast({
        type: 'info',
        title: 'Removed from Comparison',
        message: `${product.name} removed from comparison dock.`,
      });
    } else {
      addToCompare(product);
    }
  };

  const clearCompare = () => {
    setComparedProducts([]);
    setIsModalOpen(false);
  };

  const value = {
    comparedProducts,
    addToCompare,
    removeFromCompare,
    toggleCompare,
    clearCompare,
    isInCompare,
    isModalOpen,
    setIsModalOpen,
    maxLimit: MAX_COMPARE_LIMIT,
  };

  return <ComparisonContext.Provider value={value}>{children}</ComparisonContext.Provider>;
};

export const useComparison = () => {
  const context = useContext(ComparisonContext);
  if (!context) {
    throw new Error('useComparison must be used within a ComparisonProvider');
  }
  return context;
};

export default ComparisonContext;

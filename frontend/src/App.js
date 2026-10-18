import React, { Suspense, useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { ToastProvider } from './context/ToastContext';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import { CurrencyProvider } from './context/CurrencyContext';
import { ComparisonProvider } from './context/ComparisonContext';

import TopBanner from './components/layout/TopBanner';
import Navbar from './components/layout/Navbar';
import CategoryBar from './components/layout/CategoryBar';
import CartDrawer from './components/layout/CartDrawer';
import WishlistDrawer from './components/layout/WishlistDrawer';
import Footer from './components/layout/Footer';
import ErrorBoundary from './components/common/ErrorBoundary';
import LoadingFallback from './components/common/LoadingFallback';
import CommandPalette from './components/common/CommandPalette';
import ProductComparisonDrawer from './components/product/ProductComparisonDrawer';
import ProductComparisonModal from './components/product/ProductComparisonModal';

import {
  Home,
  ProductsPage,
  ProductDetailsPage,
  CheckoutPage,
  ShopDetailsPage,
  VendorDashboardPage,
  ProfilePage,
  LoginPage,
  SignupPage,
} from './Routes';

const AppContent = () => {
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);

  // Global keyboard shortcut listener for Cmd+K and Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setCommandPaletteOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans transition-colors duration-200">
      <TopBanner />
      <Navbar onOpenCommandPalette={() => setCommandPaletteOpen(true)} />
      <CategoryBar />

      <main className="flex-1">
        <ErrorBoundary>
          <Suspense fallback={<LoadingFallback />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/products" element={<ProductsPage />} />
              <Route path="/product/:id" element={<ProductDetailsPage />} />
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/shop/:id" element={<ShopDetailsPage />} />
              <Route path="/vendor/dashboard" element={<VendorDashboardPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
        </ErrorBoundary>
      </main>

      <CartDrawer />
      <WishlistDrawer />
      <ProductComparisonDrawer />
      <ProductComparisonModal />
      <CommandPalette isOpen={commandPaletteOpen} onClose={() => setCommandPaletteOpen(false)} />
      <Footer />
    </div>
  );
};

const App = () => {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <ToastProvider>
          <AuthProvider>
            <CurrencyProvider>
              <ComparisonProvider>
                <CartProvider>
                  <WishlistProvider>
                    <BrowserRouter>
                      <AppContent />
                    </BrowserRouter>
                  </WishlistProvider>
                </CartProvider>
              </ComparisonProvider>
            </CurrencyProvider>
          </AuthProvider>
        </ToastProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
};

export default App;

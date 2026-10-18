import { lazy } from 'react';

// Code-splitting via React.lazy for optimized bundle size & fast LCP
export const Home = lazy(() => import('./pages/Home'));
export const ProductsPage = lazy(() => import('./pages/ProductsPage'));
export const ProductDetailsPage = lazy(() => import('./pages/ProductDetailsPage'));
export const CheckoutPage = lazy(() => import('./pages/CheckoutPage'));
export const ShopDetailsPage = lazy(() => import('./pages/ShopDetailsPage'));
export const VendorDashboardPage = lazy(() => import('./pages/VendorDashboardPage'));
export const ProfilePage = lazy(() => import('./pages/ProfilePage'));
export const LoginPage = lazy(() => import('./pages/Login'));
export const SignupPage = lazy(() => import('./pages/SignupPage'));
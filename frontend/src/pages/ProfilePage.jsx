import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import {
  Package,
  Heart,
  MapPin,
  Settings,
  Plus,
  LogOut,
} from 'lucide-react';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Modal from '../components/ui/Modal';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useToast } from '../context/ToastContext';
import api from '../services/api';

const ProfilePage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user, logout, updateProfile } = useAuth();
  const { addToCart, openCart } = useCart();
  const { wishlistItems, removeFromWishlist } = useWishlist();
  const { toast } = useToast();

  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'orders');
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  // Address Modal state
  const [addressModalOpen, setAddressModalOpen] = useState(false);
  const [newAddress, setNewAddress] = useState({
    country: 'United States',
    city: '',
    address1: '',
    address2: '',
    zipCode: '',
    addressType: 'Home',
  });

  // Profile Edit state
  const [editName, setEditName] = useState(user?.name || '');
  const [editPhone, setEditPhone] = useState(user?.phoneNumber || '');
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam && ['orders', 'profile', 'addresses', 'wishlist'].includes(tabParam)) {
      setActiveTab(tabParam);
    }
  }, [searchParams]);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    setEditName(user.name);
    setEditPhone(user.phoneNumber || '');

    const fetchOrders = async () => {
      setLoadingOrders(true);
      try {
        const res = await api.get('/orders/my-orders');
        if (res.data?.success) {
          setOrders(res.data.orders || []);
        }
      } catch (err) {
        console.error('Failed to load user orders', err);
      } finally {
        setLoadingOrders(false);
      }
    };

    fetchOrders();
  }, [user, navigate]);

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setIsUpdating(true);
    const res = await updateProfile({ name: editName, phoneNumber: editPhone });
    setIsUpdating(false);
    if (res?.success) {
      toast.success('Account profile updated!');
    } else {
      toast.error('Failed to update profile');
    }
  };

  const handleAddAddress = async (e) => {
    e.preventDefault();
    if (!newAddress.city || !newAddress.address1 || !newAddress.zipCode) {
      toast.error('Please fill in required address fields');
      return;
    }

    const res = await updateProfile({ address: newAddress });
    if (res?.success) {
      toast.success('New delivery address added!');
      setAddressModalOpen(false);
      setNewAddress({
        country: 'United States',
        city: '',
        address1: '',
        address2: '',
        zipCode: '',
        addressType: 'Home',
      });
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* User Header Profile Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-subtle flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-5 text-center sm:text-left">
          <img
            src={
              user?.avatar ||
              'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80'
            }
            alt={user?.name}
            className="w-20 h-20 rounded-2xl object-cover ring-4 ring-brand-500/20 shadow-md"
          />
          <div className="space-y-1">
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white font-display">
                {user?.name}
              </h1>
              <Badge variant="brand" size="sm" className="capitalize">
                {user?.role}
              </Badge>
            </div>
            <p className="text-xs text-slate-500">{user?.email}</p>
            {user?.phoneNumber && (
              <p className="text-xs text-slate-400">{user.phoneNumber}</p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3">
          {user?.role === 'vendor' && (
            <Link to="/vendor/dashboard">
              <Button variant="accent" size="sm">
                Vendor Atelier
              </Button>
            </Link>
          )}
          <Button
            variant="outline"
            size="sm"
            leftIcon={<LogOut className="w-3.5 h-3.5" />}
            onClick={() => {
              logout();
              navigate('/');
            }}
          >
            Sign Out
          </Button>
        </div>
      </div>

      {/* Tabs Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        {/* Navigation Sidebar */}
        <aside className="p-3 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl space-y-1">
          <button
            onClick={() => setActiveTab('orders')}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold transition-colors ${
              activeTab === 'orders'
                ? 'bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Order History</span>
            <span className="ml-auto text-[11px] font-mono font-normal opacity-70">
              {orders.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('wishlist')}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold transition-colors ${
              activeTab === 'wishlist'
                ? 'bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            <Heart className="w-4 h-4" />
            <span>Saved Wishlist</span>
            <span className="ml-auto text-[11px] font-mono font-normal opacity-70">
              {wishlistItems.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('addresses')}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold transition-colors ${
              activeTab === 'addresses'
                ? 'bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            <MapPin className="w-4 h-4" />
            <span>Shipping Addresses</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold transition-colors ${
              activeTab === 'settings'
                ? 'bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>Account Settings</span>
          </button>
        </aside>

        {/* Tab Main Content */}
        <main className="lg:col-span-3">
          {/* TAB: Orders */}
          {activeTab === 'orders' && (
            <div className="space-y-4">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Orders & Real-Time Tracking
              </h3>

              {loadingOrders ? (
                <div className="space-y-4">
                  <div className="h-40 rounded-2xl bg-slate-200 dark:bg-slate-800 animate-pulse" />
                  <div className="h-40 rounded-2xl bg-slate-200 dark:bg-slate-800 animate-pulse" />
                </div>
              ) : orders.length > 0 ? (
                orders.map((ord) => (
                  <div
                    key={ord._id}
                    className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-4 shadow-subtle"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
                      <div>
                        <span className="text-xs text-slate-400">Order ID</span>
                        <h4 className="text-sm font-bold font-mono text-brand-600 dark:text-brand-400">
                          {ord.orderNumber}
                        </h4>
                      </div>

                      <div>
                        <span className="text-xs text-slate-400">Placed On</span>
                        <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                          {new Date(ord.createdAt).toLocaleDateString()}
                        </p>
                      </div>

                      <div>
                        <span className="text-xs text-slate-400">Total Price</span>
                        <p className="text-xs font-bold text-slate-900 dark:text-white">
                          ${ord.totalPrice}
                        </p>
                      </div>

                      <Badge
                        variant={
                          ord.status === 'Delivered'
                            ? 'success'
                            : ord.status === 'Shipping'
                            ? 'brand'
                            : 'warning'
                        }
                        size="md"
                      >
                        {ord.status}
                      </Badge>
                    </div>

                    {/* Visual Tracking Stepper */}
                    <div className="pt-2 pb-4">
                      <div className="flex items-center justify-between text-[11px] font-semibold text-slate-500">
                        <span className="text-brand-600 dark:text-brand-400 font-bold">Placed</span>
                        <span className={ord.status !== 'Processing' ? 'text-brand-600 dark:text-brand-400 font-bold' : ''}>
                          Processing
                        </span>
                        <span className={ord.status === 'Shipping' || ord.status === 'Delivered' ? 'text-brand-600 dark:text-brand-400 font-bold' : ''}>
                          Shipping
                        </span>
                        <span className={ord.status === 'Delivered' ? 'text-emerald-600 dark:text-emerald-400 font-bold' : ''}>
                          Delivered
                        </span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full mt-1.5 overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-brand-500 to-emerald-500 transition-all duration-500"
                          style={{
                            width:
                              ord.status === 'Delivered'
                                ? '100%'
                                : ord.status === 'Shipping'
                                ? '70%'
                                : ord.status === 'Processing'
                                ? '40%'
                                : '15%',
                          }}
                        />
                      </div>
                    </div>

                    {/* Ordered Items Preview */}
                    <div className="divide-y divide-slate-100 dark:divide-slate-800 pt-2">
                      {ord.cart?.map((item, idx) => (
                        <div key={idx} className="py-2.5 flex items-center justify-between gap-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={item.image}
                              alt=""
                              className="w-10 h-10 rounded-lg object-cover bg-slate-100 shrink-0"
                            />
                            <div>
                              <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 line-clamp-1">
                                {item.name}
                              </p>
                              <p className="text-[11px] text-slate-400">Qty: {item.qty}</p>
                            </div>
                          </div>
                          <span className="text-xs font-bold text-slate-900 dark:text-white">
                            ${item.price}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-3">
                  <Package className="w-8 h-8 text-slate-400 mx-auto" />
                  <p className="text-xs text-slate-500">You haven't placed any orders yet.</p>
                  <Link to="/products">
                    <Button variant="primary" size="sm">
                      Start Shopping
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          )}

          {/* TAB: Wishlist */}
          {activeTab === 'wishlist' && (
            <div className="space-y-4">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Saved Wishlist Items
              </h3>
              {wishlistItems.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {wishlistItems.map((item) => (
                    <div
                      key={item.productId || item._id}
                      className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-3"
                    >
                      <img
                        src={item.image}
                        alt=""
                        className="w-full aspect-video rounded-xl object-cover bg-slate-100"
                      />
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white line-clamp-1">
                        {item.name}
                      </h4>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-brand-600 dark:text-brand-400">
                          ${item.price}
                        </span>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="primary"
                            size="sm"
                            className="text-xs py-1 px-2.5"
                            onClick={() => {
                              addToCart(item, 1);
                              removeFromWishlist(item.productId || item._id);
                              openCart();
                            }}
                          >
                            Move to Bag
                          </Button>
                          <button
                            onClick={() => removeFromWishlist(item.productId || item._id)}
                            className="text-slate-400 hover:text-rose-500 p-1"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-3">
                  <Heart className="w-8 h-8 text-slate-400 mx-auto" />
                  <p className="text-xs text-slate-500">Your wishlist is currently empty.</p>
                  <Link to="/products">
                    <Button variant="primary" size="sm">
                      Browse Items
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          )}

          {/* TAB: Addresses */}
          {activeTab === 'addresses' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Saved Delivery Addresses
                </h3>
                <Button
                  variant="primary"
                  size="sm"
                  leftIcon={<Plus className="w-3.5 h-3.5" />}
                  onClick={() => setAddressModalOpen(true)}
                >
                  Add Address
                </Button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {user?.addresses && user.addresses.length > 0 ? (
                  user.addresses.map((addr, idx) => (
                    <div
                      key={idx}
                      className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-1.5"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <Badge variant="brand" size="sm">
                          {addr.addressType || 'Home'}
                        </Badge>
                        {addr.isDefault && (
                          <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase">
                            Default
                          </span>
                        )}
                      </div>
                      <p className="text-xs font-bold text-slate-900 dark:text-white">
                        {addr.address1} {addr.address2}
                      </p>
                      <p className="text-xs text-slate-500">
                        {addr.city}, {addr.zipCode}
                      </p>
                      <p className="text-xs text-slate-400">{addr.country}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-400 col-span-2 py-6 text-center">
                    No saved addresses yet.
                  </p>
                )}
              </div>
            </div>
          )}

          {/* TAB: Settings */}
          {activeTab === 'settings' && (
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-6">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Account Information
              </h3>

              <form onSubmit={handleSaveProfile} className="space-y-4 max-w-md">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Email Address (Immutable)
                  </label>
                  <input
                    type="email"
                    disabled
                    value={user?.email}
                    className="w-full p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-xs text-slate-400 cursor-not-allowed"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={editPhone}
                    onChange={(e) => setEditPhone(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>

                <Button type="submit" variant="primary" size="md" isLoading={isUpdating}>
                  Save Changes
                </Button>
              </form>
            </div>
          )}
        </main>
      </div>

      {/* Add Address Modal */}
      <Modal
        isOpen={addressModalOpen}
        onClose={() => setAddressModalOpen(false)}
        title="Add New Delivery Destination"
        maxWidth="max-w-md"
      >
        <form onSubmit={handleAddAddress} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Address Line 1
            </label>
            <input
              type="text"
              required
              placeholder="123 Luxury Way"
              value={newAddress.address1}
              onChange={(e) => setNewAddress({ ...newAddress, address1: e.target.value })}
              className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Address Line 2 (Optional)
            </label>
            <input
              type="text"
              placeholder="Suite / Apt"
              value={newAddress.address2}
              onChange={(e) => setNewAddress({ ...newAddress, address2: e.target.value })}
              className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                City
              </label>
              <input
                type="text"
                required
                value={newAddress.city}
                onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Zip Code
              </label>
              <input
                type="text"
                required
                value={newAddress.zipCode}
                onChange={(e) => setNewAddress({ ...newAddress, zipCode: e.target.value })}
                className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
          </div>

          <div className="pt-3 flex justify-end gap-3">
            <Button variant="ghost" size="md" onClick={() => setAddressModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="md" type="submit">
              Save Address
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ProfilePage;

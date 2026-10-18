import React from 'react';
import { X, ShoppingBag, Star, ShieldCheck, Check } from 'lucide-react';
import Modal from '../ui/Modal';
import { useComparison } from '../../context/ComparisonContext';
import { useCurrency } from '../../context/CurrencyContext';
import { useCart } from '../../context/CartContext';

const getSpecsForProduct = (product) => {
  const cat = (product.category || '').toLowerCase();
  if (cat.includes('computer') || cat.includes('laptop')) {
    return {
      processor: 'Pro-tier Silicon / Multi-core SoC',
      display: 'Liquid Retina XDR / Nano-texture Glass',
      memory: 'Unified High-Bandwidth Architecture',
      connectivity: 'Thunderbolt 4, HDMI 2.1, Wi-Fi 6E',
      warranty: '2-Year Atelier Platinum Concierge',
    };
  }
  if (cat.includes('watch') || cat.includes('accessories')) {
    return {
      processor: 'Swiss Calibre Automatic Tourbillon',
      display: 'Anti-Reflective Double Sapphire Crystal',
      memory: '48-Hour Power Reserve Chronograph',
      connectivity: 'Quick-Release Tuscan Calfskin & Steel Band',
      warranty: 'Lifetime Horological Atelier Guarantee',
    };
  }
  if (cat.includes('gaming') || cat.includes('music')) {
    return {
      processor: 'Acoustic Driver Precision Diaphragm',
      display: 'Quantum QD-OLED / High Dynamic Range',
      memory: 'Ultra-low Latency 0.03ms Response',
      connectivity: 'Lossless Optical & High-Res Wireless',
      warranty: '3-Year Manufacturer & Atelier Care',
    };
  }
  return {
    processor: 'Artisan Handcrafted Construction',
    display: 'Custom Hand-Burnished Finishing',
    memory: 'Ergonomic Memory Core Technology',
    connectivity: 'Universal Luxury Standard',
    warranty: '2-Year Full Atelier Warranty',
  };
};

const ProductComparisonModal = () => {
  const { comparedProducts, removeFromCompare, isModalOpen, setIsModalOpen, clearCompare } = useComparison();
  const { formatPrice } = useCurrency();
  const { addToCart } = useCart();
  const [addedIds, setAddedIds] = React.useState({});

  const handleAdd = (product) => {
    const pId = product._id || product.id;
    addToCart(product, 1);
    setAddedIds((prev) => ({ ...prev, [pId]: true }));
    setTimeout(() => {
      setAddedIds((prev) => ({ ...prev, [pId]: false }));
    }, 1500);
  };

  if (!isModalOpen) return null;

  return (
    <Modal
      isOpen={isModalOpen}
      onClose={() => setIsModalOpen(false)}
      title="Side-by-Side Luxury Spec Comparison"
      maxWidth="max-w-5xl"
    >
      <div className="overflow-x-auto pb-4">
        {comparedProducts.length === 0 ? (
          <div className="py-12 text-center text-slate-400">
            <p className="text-sm">No products currently selected for comparison.</p>
          </div>
        ) : (
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800">
                <th className="p-3 w-40 text-slate-400 font-mono text-xs uppercase tracking-wider">
                  Product
                </th>
                {comparedProducts.map((p) => {
                  const pId = p._id || p.id;
                  return (
                    <th key={pId} className="p-3 min-w-[200px] align-top">
                      <div className="relative bg-slate-100 dark:bg-slate-900 rounded-xl p-3 border border-slate-200 dark:border-slate-800">
                        <button
                          onClick={() => removeFromCompare(pId)}
                          className="absolute top-2 right-2 p-1 rounded-full bg-slate-200 dark:bg-slate-800 hover:bg-rose-500 hover:text-white text-slate-500 transition-colors"
                          title="Remove from comparison"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                        <div className="aspect-square w-full rounded-lg overflow-hidden bg-white dark:bg-slate-950 mb-2">
                          <img
                            src={p.images?.[0] || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=300&q=80'}
                            alt={p.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <h4 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white line-clamp-2 h-10">
                          {p.name}
                        </h4>
                        <div className="mt-2 flex items-baseline gap-1.5">
                          <span className="text-base font-black text-amber-500 font-display">
                            {formatPrice(p.discountPrice)}
                          </span>
                          {p.originalPrice && p.originalPrice > p.discountPrice && (
                            <span className="text-xs text-slate-400 line-through">
                              {formatPrice(p.originalPrice)}
                            </span>
                          )}
                        </div>
                        <button
                          onClick={() => handleAdd(p)}
                          className={`mt-3 w-full py-2 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors ${
                            addedIds[pId]
                              ? 'bg-emerald-600 text-white'
                              : 'bg-amber-500 hover:bg-amber-600 text-slate-950'
                          }`}
                        >
                          {addedIds[pId] ? <Check className="w-3.5 h-3.5" /> : <ShoppingBag className="w-3.5 h-3.5" />}
                          <span>{addedIds[pId] ? 'Added' : 'Add to Bag'}</span>
                        </button>
                      </div>
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-sans">
              <tr>
                <td className="p-3 font-mono text-xs uppercase text-slate-400">Category</td>
                {comparedProducts.map((p) => (
                  <td key={p._id || p.id} className="p-3 text-slate-800 dark:text-slate-200 font-medium">
                    {p.category}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="p-3 font-mono text-xs uppercase text-slate-400">Rating</td>
                {comparedProducts.map((p) => (
                  <td key={p._id || p.id} className="p-3 text-slate-800 dark:text-slate-200">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                      <span className="font-bold">{p.ratings || 4.9}</span>
                      <span className="text-xs text-slate-400">({p.reviews?.length || 14})</span>
                    </div>
                  </td>
                ))}
              </tr>
              <tr>
                <td className="p-3 font-mono text-xs uppercase text-slate-400">Atelier / Shop</td>
                {comparedProducts.map((p) => (
                  <td key={p._id || p.id} className="p-3 text-slate-800 dark:text-slate-200 font-semibold">
                    {p.shop?.name || 'Exclusive Atelier Partner'}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="p-3 font-mono text-xs uppercase text-slate-400">Availability</td>
                {comparedProducts.map((p) => (
                  <td key={p._id || p.id} className="p-3">
                    <span className="inline-flex items-center gap-1 text-xs font-mono font-medium text-emerald-500">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      {p.stock > 0 ? `${p.stock} In Stock` : 'Made to Order'}
                    </span>
                  </td>
                ))}
              </tr>
              <tr>
                <td className="p-3 font-mono text-xs uppercase text-slate-400">Core Architecture</td>
                {comparedProducts.map((p) => {
                  const specs = getSpecsForProduct(p);
                  return (
                    <td key={p._id || p.id} className="p-3 text-xs text-slate-600 dark:text-slate-300">
                      {specs.processor}
                    </td>
                  );
                })}
              </tr>
              <tr>
                <td className="p-3 font-mono text-xs uppercase text-slate-400">Display / Finish</td>
                {comparedProducts.map((p) => {
                  const specs = getSpecsForProduct(p);
                  return (
                    <td key={p._id || p.id} className="p-3 text-xs text-slate-600 dark:text-slate-300">
                      {specs.display}
                    </td>
                  );
                })}
              </tr>
              <tr>
                <td className="p-3 font-mono text-xs uppercase text-slate-400">Memory / Power</td>
                {comparedProducts.map((p) => {
                  const specs = getSpecsForProduct(p);
                  return (
                    <td key={p._id || p.id} className="p-3 text-xs text-slate-600 dark:text-slate-300">
                      {specs.memory}
                    </td>
                  );
                })}
              </tr>
              <tr>
                <td className="p-3 font-mono text-xs uppercase text-slate-400">Concierge Warranty</td>
                {comparedProducts.map((p) => {
                  const specs = getSpecsForProduct(p);
                  return (
                    <td key={p._id || p.id} className="p-3 text-xs text-slate-600 dark:text-slate-300">
                      {specs.warranty}
                    </td>
                  );
                })}
              </tr>
            </tbody>
          </table>
        )}

        <div className="mt-6 flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-800">
          <button
            onClick={clearCompare}
            className="text-xs font-mono text-slate-400 hover:text-rose-400 uppercase tracking-wider transition-colors"
          >
            Clear Entire Dock
          </button>
          <button
            onClick={() => setIsModalOpen(false)}
            className="px-5 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-bold uppercase tracking-wider hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors"
          >
            Close Matrix
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ProductComparisonModal;

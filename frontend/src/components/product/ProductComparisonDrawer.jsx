import React from 'react';
import { SlidersHorizontal, X, ArrowRight } from 'lucide-react';
import { useComparison } from '../../context/ComparisonContext';

const ProductComparisonDrawer = () => {
  const { comparedProducts, removeFromCompare, clearCompare, setIsModalOpen, maxLimit } = useComparison();

  if (!comparedProducts || comparedProducts.length === 0) {
    return null;
  }

  return (
    <aside
      aria-label="Product comparison dock"
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 w-[94%] max-w-2xl bg-slate-900/95 dark:bg-slate-950/95 backdrop-blur-xl border border-amber-500/30 rounded-2xl shadow-2xl p-3 sm:p-4 text-slate-100 transition-all duration-300 animate-slide-up"
    >
      <div className="flex items-center justify-between gap-3">
        {/* Left Info & Items preview */}
        <div className="flex items-center gap-3 overflow-x-auto py-1">
          <div className="hidden sm:flex flex-col">
            <span className="text-[10px] font-mono uppercase tracking-wider text-amber-400">
              Comparison Dock
            </span>
            <span className="text-xs font-bold text-white whitespace-nowrap">
              {comparedProducts.length} / {maxLimit} Selected
            </span>
          </div>

          <div className="flex items-center gap-2">
            {comparedProducts.map((p) => {
              const pId = p._id || p.id;
              return (
                <div key={pId} className="relative group w-11 h-11 rounded-xl overflow-hidden border border-white/10 bg-slate-800 flex-shrink-0">
                  <img
                    src={p.images?.[0] || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=150&q=80'}
                    alt={p.name}
                    className="w-full h-full object-cover"
                  />
                  <button
                    onClick={() => removeFromCompare(pId)}
                    className="absolute inset-0 bg-black/70 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-rose-400"
                    title={`Remove ${p.name}`}
                    aria-label={`Remove ${p.name} from comparison`}
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Action buttons */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={clearCompare}
            className="px-3 py-2 text-xs font-mono text-slate-400 hover:text-slate-200 uppercase tracking-wider transition-colors"
          >
            Clear
          </button>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 transition-colors shadow-md"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Compare Specs</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </div>
    </aside>
  );
};

export default ProductComparisonDrawer;

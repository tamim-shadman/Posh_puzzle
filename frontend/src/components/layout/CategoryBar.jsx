import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Laptop, Smartphone, Headphones, Footprints, Watch, Grid } from 'lucide-react';

const categories = [
  { name: 'All Products', icon: Grid, path: '/products' },
  { name: 'Computers and Laptops', icon: Laptop, path: '/products?category=Computers and Laptops' },
  { name: 'Mobile and Tablets', icon: Smartphone, path: '/products?category=Mobile and Tablets' },
  { name: 'Music and Gaming', icon: Headphones, path: '/products?category=Music and Gaming' },
  { name: 'Shoes', icon: Footprints, path: '/products?category=Shoes' },
  { name: 'Others', icon: Watch, path: '/products?category=Others' },
];

const CategoryBar = () => {
  const location = useLocation();

  return (
    <div className="bg-slate-50/80 dark:bg-slate-950/60 border-b border-slate-200/80 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2 overflow-x-auto py-2.5 no-scrollbar">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isActive =
              location.pathname + location.search === cat.path ||
              (cat.name === 'All Products' && location.pathname === '/products' && !location.search);

            return (
              <Link
                key={cat.name}
                to={cat.path}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 ${
                  isActive
                    ? 'bg-brand-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-slate-800'
                }`}
              >
                <Icon className="w-3.5 h-3.5 shrink-0" />
                <span>{cat.name}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CategoryBar;

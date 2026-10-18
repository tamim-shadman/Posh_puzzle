import React, { createContext, useContext, useState, useMemo } from 'react';

const CurrencyContext = createContext();

export const CURRENCY_CONFIG = {
  USD: { code: 'USD', symbol: '$', rate: 1.0, label: 'USD ($)', locale: 'en-US' },
  EUR: { code: 'EUR', symbol: '€', rate: 0.92, label: 'EUR (€)', locale: 'de-DE' },
  GBP: { code: 'GBP', symbol: '£', rate: 0.79, label: 'GBP (£)', locale: 'en-GB' },
  JPY: { code: 'JPY', symbol: '¥', rate: 154.5, label: 'JPY (¥)', locale: 'ja-JP' },
  CAD: { code: 'CAD', symbol: 'CA$', rate: 1.36, label: 'CAD ($)', locale: 'en-CA' },
};

export const CurrencyProvider = ({ children }) => {
  const [currency, setCurrencyState] = useState(() => {
    try {
      const saved = localStorage.getItem('posh_puzzle_currency');
      return saved && CURRENCY_CONFIG[saved] ? saved : 'USD';
    } catch {
      return 'USD';
    }
  });

  const setCurrency = (code) => {
    if (CURRENCY_CONFIG[code]) {
      setCurrencyState(code);
      try {
        localStorage.setItem('posh_puzzle_currency', code);
      } catch (err) {
        console.warn('Failed to save currency preference', err);
      }
    }
  };

  const currentConfig = useMemo(() => CURRENCY_CONFIG[currency] || CURRENCY_CONFIG.USD, [currency]);

  const convertPrice = (usdAmount) => {
    if (typeof usdAmount !== 'number' || isNaN(usdAmount)) return 0;
    const converted = usdAmount * currentConfig.rate;
    return currency === 'JPY' ? Math.round(converted) : Number(converted.toFixed(2));
  };

  const formatPrice = (usdAmount) => {
    if (usdAmount === null || usdAmount === undefined || isNaN(Number(usdAmount))) {
      return `${currentConfig.symbol}0`;
    }
    const converted = convertPrice(Number(usdAmount));
    if (currency === 'JPY') {
      return `${currentConfig.symbol}${converted.toLocaleString()}`;
    }
    return `${currentConfig.symbol}${converted.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  const value = {
    currency,
    setCurrency,
    currentConfig,
    convertPrice,
    formatPrice,
    availableCurrencies: Object.values(CURRENCY_CONFIG),
  };

  return <CurrencyContext.Provider value={value}>{children}</CurrencyContext.Provider>;
};

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
};

export default CurrencyContext;

import React from 'react';
import { render, screen, act } from '@testing-library/react';
import { CurrencyProvider, useCurrency } from './CurrencyContext';

const TestCurrencyComponent = () => {
  const { currency, setCurrency, formatPrice, convertPrice } = useCurrency();

  return (
    <div>
      <span data-testid="current-currency">{currency}</span>
      <span data-testid="formatted-price">{formatPrice(100)}</span>
      <span data-testid="converted-price">{convertPrice(100)}</span>
      <button onClick={() => setCurrency('EUR')}>Switch to EUR</button>
      <button onClick={() => setCurrency('GBP')}>Switch to GBP</button>
      <button onClick={() => setCurrency('JPY')}>Switch to JPY</button>
    </div>
  );
};

describe('CurrencyContext Unit Suite', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('initializes with default USD currency', () => {
    render(
      <CurrencyProvider>
        <TestCurrencyComponent />
      </CurrencyProvider>
    );

    expect(screen.getByTestId('current-currency').textContent).toBe('USD');
    expect(screen.getByTestId('formatted-price').textContent).toBe('$100.00');
    expect(screen.getByTestId('converted-price').textContent).toBe('100');
  });

  it('switches currency to EUR and formats correctly', () => {
    render(
      <CurrencyProvider>
        <TestCurrencyComponent />
      </CurrencyProvider>
    );

    act(() => {
      screen.getByText('Switch to EUR').click();
    });

    expect(screen.getByTestId('current-currency').textContent).toBe('EUR');
    expect(screen.getByTestId('converted-price').textContent).toBe('92');
    expect(screen.getByTestId('formatted-price').textContent).toContain('€');
  });

  it('switches currency to JPY without decimal places', () => {
    render(
      <CurrencyProvider>
        <TestCurrencyComponent />
      </CurrencyProvider>
    );

    act(() => {
      screen.getByText('Switch to JPY').click();
    });

    expect(screen.getByTestId('current-currency').textContent).toBe('JPY');
    expect(screen.getByTestId('converted-price').textContent).toBe('15450');
    expect(screen.getByTestId('formatted-price').textContent).toBe('¥15,450');
  });
});

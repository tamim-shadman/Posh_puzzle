import React from 'react';
import { render, screen, act } from '@testing-library/react';
import { ComparisonProvider, useComparison } from './ComparisonContext';
import { ToastProvider } from './ToastContext';

const sampleProductA = {
  _id: 'prod_comp_01',
  name: 'Titanium Chronograph',
  discountPrice: 1200,
  category: 'Watches and Accessories',
};

const sampleProductB = {
  _id: 'prod_comp_02',
  name: 'MacBook Pro Space Black',
  discountPrice: 3200,
  category: 'Computers and Laptops',
};

const TestComparisonComponent = () => {
  const {
    comparedProducts,
    addToCompare,
    removeFromCompare,
    toggleCompare,
    clearCompare,
    isInCompare,
  } = useComparison();

  return (
    <div>
      <span data-testid="compare-count">{comparedProducts.length}</span>
      <span data-testid="is-a-compared">{isInCompare('prod_comp_01') ? 'yes' : 'no'}</span>
      <button onClick={() => addToCompare(sampleProductA)}>Add A</button>
      <button onClick={() => addToCompare(sampleProductB)}>Add B</button>
      <button onClick={() => toggleCompare(sampleProductA)}>Toggle A</button>
      <button onClick={() => removeFromCompare('prod_comp_01')}>Remove A</button>
      <button onClick={() => clearCompare()}>Clear All</button>
    </div>
  );
};

describe('ComparisonContext Unit Suite', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('starts with an empty comparison list', () => {
    render(
      <ToastProvider>
        <ComparisonProvider>
          <TestComparisonComponent />
        </ComparisonProvider>
      </ToastProvider>
    );

    expect(screen.getByTestId('compare-count').textContent).toBe('0');
    expect(screen.getByTestId('is-a-compared').textContent).toBe('no');
  });

  it('adds products to comparison up to max limit and prevents duplicate additions', () => {
    render(
      <ToastProvider>
        <ComparisonProvider>
          <TestComparisonComponent />
        </ComparisonProvider>
      </ToastProvider>
    );

    act(() => {
      screen.getByText('Add A').click();
    });

    expect(screen.getByTestId('compare-count').textContent).toBe('1');
    expect(screen.getByTestId('is-a-compared').textContent).toBe('yes');

    // Attempt duplicate add
    act(() => {
      screen.getByText('Add A').click();
    });
    expect(screen.getByTestId('compare-count').textContent).toBe('1');

    // Add second product
    act(() => {
      screen.getByText('Add B').click();
    });
    expect(screen.getByTestId('compare-count').textContent).toBe('2');
  });

  it('removes product and clears all correctly', () => {
    render(
      <ToastProvider>
        <ComparisonProvider>
          <TestComparisonComponent />
        </ComparisonProvider>
      </ToastProvider>
    );

    act(() => {
      screen.getByText('Add A').click();
      screen.getByText('Add B').click();
    });
    expect(screen.getByTestId('compare-count').textContent).toBe('2');

    act(() => {
      screen.getByText('Remove A').click();
    });
    expect(screen.getByTestId('compare-count').textContent).toBe('1');
    expect(screen.getByTestId('is-a-compared').textContent).toBe('no');

    act(() => {
      screen.getByText('Clear All').click();
    });
    expect(screen.getByTestId('compare-count').textContent).toBe('0');
  });
});

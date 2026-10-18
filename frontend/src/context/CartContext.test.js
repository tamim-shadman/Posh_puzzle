import React from 'react';
import { render, screen, act } from '@testing-library/react';
import { CartProvider, useCart } from './CartContext';
import { ToastProvider } from './ToastContext';

// Test consumer component
const TestCartComponent = () => {
  const { cartItems, itemCount, total, subtotal, discountAmount, addToCart, removeFromCart, updateQty } = useCart();

  return (
    <div>
      <span data-testid="item-count">{itemCount}</span>
      <span data-testid="cart-total">{total}</span>
      <span data-testid="cart-subtotal">{subtotal}</span>
      <span data-testid="discount-amount">{discountAmount}</span>
      <button
        onClick={() =>
          addToCart(
            {
              _id: 'prod_test_01',
              name: 'Signature Wireless Headphones',
              discountPrice: 150,
              images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e'],
              shop: { name: 'Acoustic Lab', _id: 'shop_001' },
            },
            2
          )
        }
      >
        Add Test Product
      </button>
      <button onClick={() => updateQty('prod_test_01', 3)}>Update Qty</button>
      <button onClick={() => removeFromCart('prod_test_01')}>Remove Product</button>
    </div>
  );
};

describe('CartContext Unit Suite', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('initializes with empty cart and zero counts', () => {
    render(
      <ToastProvider>
        <CartProvider>
          <TestCartComponent />
        </CartProvider>
      </ToastProvider>
    );

    expect(screen.getByTestId('item-count').textContent).toBe('0');
    expect(screen.getByTestId('cart-total').textContent).toBe('0');
  });

  it('accurately calculates item count and subtotal when products are added', () => {
    render(
      <ToastProvider>
        <CartProvider>
          <TestCartComponent />
        </CartProvider>
      </ToastProvider>
    );

    const addBtn = screen.getByText('Add Test Product');
    act(() => {
      addBtn.click();
    });

    expect(screen.getByTestId('item-count').textContent).toBe('2');
    expect(screen.getByTestId('cart-subtotal').textContent).toBe('300');
  });

  it('updates item quantity and recalculates totals correctly', () => {
    render(
      <ToastProvider>
        <CartProvider>
          <TestCartComponent />
        </CartProvider>
      </ToastProvider>
    );

    const addBtn = screen.getByText('Add Test Product');
    act(() => {
      addBtn.click();
    });

    const updateBtn = screen.getByText('Update Qty');
    act(() => {
      updateBtn.click();
    });

    expect(screen.getByTestId('item-count').textContent).toBe('3');
    expect(screen.getByTestId('cart-subtotal').textContent).toBe('450');
  });

  it('removes product from cart and resets totals', () => {
    render(
      <ToastProvider>
        <CartProvider>
          <TestCartComponent />
        </CartProvider>
      </ToastProvider>
    );

    const addBtn = screen.getByText('Add Test Product');
    act(() => {
      addBtn.click();
    });

    const removeBtn = screen.getByText('Remove Product');
    act(() => {
      removeBtn.click();
    });

    expect(screen.getByTestId('item-count').textContent).toBe('0');
    expect(screen.getByTestId('cart-subtotal').textContent).toBe('0');
  });
});

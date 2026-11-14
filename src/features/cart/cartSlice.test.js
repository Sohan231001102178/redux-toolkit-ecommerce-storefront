import { describe, it, expect } from 'vitest';
import cartReducer, {
  addToCart,
  updateQuantity,
  removeFromCart,
  applyPromoCode,
  removePromoCode,
  clearCart
} from './cartSlice';
import { selectCartTotals } from './cartSelectors';

describe('cartSlice & selectCartTotals financial pipeline', () => {
  const sampleProduct = {
    id: 101,
    title: 'Quantum Wireless Headphones',
    price: 100.0,
    category: 'electronics'
  };

  const sampleProduct2 = {
    id: 102,
    title: 'Titanium Mechanical Keyboard',
    price: 50.0,
    category: 'electronics'
  };

  it('should add new product to cart', () => {
    const state = cartReducer(undefined, addToCart({ product: sampleProduct, qty: 1 }));
    expect(state.items[101]).toBeDefined();
    expect(state.items[101].qty).toBe(1);
    expect(state.items[101].product.price).toBe(100.0);
  });

  it('should increment quantity when existing product is added again', () => {
    let state = cartReducer(undefined, addToCart({ product: sampleProduct, qty: 1 }));
    state = cartReducer(state, addToCart({ product: sampleProduct, qty: 2 }));
    expect(state.items[101].qty).toBe(3);
  });

  it('should auto-remove item when quantity is updated to 0 or less (edge-case)', () => {
    let state = cartReducer(undefined, addToCart({ product: sampleProduct, qty: 2 }));
    expect(state.items[101]).toBeDefined();

    // Update to 0 => auto removed
    state = cartReducer(state, updateQuantity({ id: 101, qty: 0 }));
    expect(state.items[101]).toBeUndefined();

    // Add again and update to negative => auto removed
    state = cartReducer(state, addToCart({ product: sampleProduct, qty: 1 }));
    state = cartReducer(state, updateQuantity({ id: 101, qty: -2 }));
    expect(state.items[101]).toBeUndefined();
  });

  it('should remove item via removeFromCart', () => {
    let state = cartReducer(undefined, addToCart({ product: sampleProduct, qty: 1 }));
    state = cartReducer(state, removeFromCart(101));
    expect(state.items[101]).toBeUndefined();
  });

  it('should apply valid promo code and calculate discount rate', () => {
    let state = cartReducer(undefined, applyPromoCode('SAVE10'));
    expect(state.promoCode).toBe('SAVE10');
    expect(state.discountRate).toBe(0.10);
    expect(state.promoError).toBeNull();

    state = cartReducer(state, removePromoCode());
    expect(state.promoCode).toBeNull();
    expect(state.discountRate).toBe(0);
  });

  it('should compute exact financial pipeline (subtotal, promo, 8% tax, final total)', () => {
    // 2 units of $100 ($200) + 1 unit of $50 ($50) = Subtotal $250.00
    const mockRootState = {
      cart: {
        items: {
          101: { product: sampleProduct, qty: 2 },
          102: { product: sampleProduct2, qty: 1 }
        },
        promoCode: 'SAVE10',
        discountRate: 0.10, // 10%
        promoError: null
      }
    };

    const totals = selectCartTotals(mockRootState);
    expect(totals.itemCount).toBe(3);
    expect(totals.subtotal).toBe(250.00);
    expect(totals.discountAmount).toBe(25.00); // 10% of 250
    expect(totals.discountedSubtotal).toBe(225.00); // 250 - 25
    expect(totals.taxAmount).toBe(18.00); // 8% of 225 = 18.00
    expect(totals.finalTotal).toBe(243.00); // 225 + 18 = 243.00
  });

  it('should clear cart on clearCart', () => {
    let state = cartReducer(undefined, addToCart({ product: sampleProduct, qty: 2 }));
    state = cartReducer(state, applyPromoCode('SAVE10'));
    state = cartReducer(state, clearCart());

    expect(state.items).toEqual({});
    expect(state.promoCode).toBeNull();
    expect(state.discountRate).toBe(0);
  });
});

import { describe, it, expect } from 'vitest';
import ordersReducer, { clearLatestOrder } from './ordersSlice';
import cartReducer, { addToCart } from '../cart/cartSlice';

describe('ordersSlice & checkout integration with cart reset', () => {
  const sampleOrder = {
    id: 'STX-ORD-TEST-9999',
    createdAt: new Date().toISOString(),
    customer: { name: 'Rohit Sharma', email: 'rohit@streaxsellers.in' },
    shippingAddress: { street: 'Flat 402 Bandra West', city: 'Mumbai', state: 'MH', zip: '400050', country: 'India' },
    paymentMethod: { type: 'CREDIT_CARD', last4: '4242' },
    items: [
      { productId: 1, title: 'Item A', price: 50, qty: 1, lineTotal: 50 }
    ],
    totals: { subtotal: 50, discountAmount: 0, taxAmount: 4, finalTotal: 54 },
    status: 'Confirmed'
  };

  it('should handle placeOrder.fulfilled in ordersSlice', () => {
    const initialState = {
      history: [],
      latestOrder: null,
      checkoutStatus: 'idle',
      checkoutError: null
    };

    const action = {
      type: 'orders/placeOrder/fulfilled',
      payload: sampleOrder
    };

    const nextState = ordersReducer(initialState, action);
    expect(nextState.checkoutStatus).toBe('succeeded');
    expect(nextState.latestOrder).toEqual(sampleOrder);
    expect(nextState.history).toHaveLength(1);
    expect(nextState.history[0].id).toBe('STX-ORD-TEST-9999');
  });

  it('should automatically reset cartSlice when orders/placeOrder/fulfilled is dispatched', () => {
    // Populate cart state with items
    let cartState = cartReducer(undefined, addToCart({
      product: { id: 1, title: 'Item A', price: 50 },
      qty: 2
    }));
    expect(Object.keys(cartState.items).length).toBe(1);

    // Simulate placeOrder.fulfilled action
    const orderFulfilledAction = {
      type: 'orders/placeOrder/fulfilled',
      payload: sampleOrder
    };

    // cartSlice extraReducers listens for this action
    cartState = cartReducer(cartState, orderFulfilledAction);

    // Cart must now be automatically emptied
    expect(cartState.items).toEqual({});
    expect(cartState.promoCode).toBeNull();
    expect(cartState.discountRate).toBe(0);
  });

  it('should clear latestOrder via clearLatestOrder', () => {
    const stateWithOrder = {
      history: [sampleOrder],
      latestOrder: sampleOrder,
      checkoutStatus: 'succeeded',
      checkoutError: null
    };

    const clearedState = ordersReducer(stateWithOrder, clearLatestOrder());
    expect(clearedState.latestOrder).toBeNull();
    expect(clearedState.checkoutStatus).toBe('idle');
    expect(clearedState.history).toHaveLength(1); // history is preserved
  });
});

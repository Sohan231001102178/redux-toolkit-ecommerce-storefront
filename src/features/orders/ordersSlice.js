import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { saveState, loadState } from '../../utils/storage';

// Simulated async checkout API mutation
export const placeOrder = createAsyncThunk(
  'orders/placeOrder',
  async ({ items, totals, shippingAddress, paymentMethod }, { getState, rejectWithValue }) => {
    try {
      // 750ms mock server processing latency
      await new Promise((resolve) => setTimeout(resolve, 750));

      if (!items || items.length === 0) {
        return rejectWithValue('Cannot submit an order with an empty cart');
      }

      const state = getState();
      const user = state.auth.user;

      const order = {
        id: `STX-ORD-${Date.now().toString(36).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`,
        createdAt: new Date().toISOString(),
        customer: {
          name: shippingAddress?.fullName || user?.name || 'Rohit Sharma',
          email: shippingAddress?.email || user?.email || 'customer@streaxsellers.in'
        },
        shippingAddress: {
          street: shippingAddress?.street || 'Flat 402, Galaxy Heights, Bandra West',
          city: shippingAddress?.city || 'Mumbai',
          state: shippingAddress?.state || 'Maharashtra',
          zip: shippingAddress?.zip || '400050',
          country: shippingAddress?.country || 'India'
        },
        paymentMethod: paymentMethod || { type: 'UPI_INSTANT', vpa: 'streaxpay@upi' },
        items: items.map((item) => ({
          productId: item.product.id,
          title: item.product.title,
          price: item.product.price,
          image: item.product.image,
          category: item.product.category,
          qty: item.qty,
          lineTotal: Number((item.product.price * item.qty).toFixed(2))
        })),
        totals: {
          subtotal: totals.subtotal,
          discountAmount: totals.discountAmount,
          discountRate: totals.discountRate,
          promoCode: totals.promoCode,
          taxAmount: totals.taxAmount,
          finalTotal: totals.finalTotal
        },
        status: 'Confirmed'
      };

      return order;
    } catch (err) {
      return rejectWithValue(err.message || 'Payment processor failed to authorize order');
    }
  }
);

const persistedHistory = loadState('streax_order_history', []);

const initialState = {
  history: Array.isArray(persistedHistory) ? persistedHistory : [],
  latestOrder: null,
  checkoutStatus: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  checkoutError: null
};

const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    clearLatestOrder(state) {
      state.latestOrder = null;
      state.checkoutStatus = 'idle';
      state.checkoutError = null;
    },
    resetCheckoutStatus(state) {
      state.checkoutStatus = 'idle';
      state.checkoutError = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(placeOrder.pending, (state) => {
        state.checkoutStatus = 'loading';
        state.checkoutError = null;
      })
      .addCase(placeOrder.fulfilled, (state, action) => {
        state.checkoutStatus = 'succeeded';
        state.latestOrder = action.payload;
        state.history.unshift(action.payload);
        state.checkoutError = null;
        // Persist order history safely
        saveState('streax_order_history', state.history);
      })
      .addCase(placeOrder.rejected, (state, action) => {
        state.checkoutStatus = 'failed';
        state.checkoutError = action.payload || action.error.message || 'Checkout failed';
      });
  }
});

export const { clearLatestOrder, resetCheckoutStatus } = ordersSlice.actions;

export const selectOrdersState = (state) => state.orders;
export const selectOrderHistory = (state) => state.orders.history;
export const selectLatestOrder = (state) => state.orders.latestOrder;
export const selectCheckoutStatus = (state) => state.orders.checkoutStatus;
export const selectCheckoutError = (state) => state.orders.checkoutError;

export default ordersSlice.reducer;

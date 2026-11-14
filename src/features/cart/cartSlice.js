import { createSlice } from '@reduxjs/toolkit';

// Valid promo codes lookup
export const PROMO_CODES = {
  STREAX10: { rate: 0.10, label: '10% STREAX OFF' },
  STREAX20: { rate: 0.20, label: '20% STREAX OFF' },
  STREAX50: { rate: 0.50, label: '50% VIP STREAX' },
  SAVE10: { rate: 0.10, label: '10% OFF' },
  SAVE20: { rate: 0.20, label: '20% OFF' },
  FESTIVE25: { rate: 0.25, label: '25% Festive Offer' }
};

const initialState = {
  items: {}, // { [productId]: { product, qty } }
  promoCode: null,
  discountRate: 0,
  promoError: null
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart(state, action) {
      const payload = action.payload;
      const product = payload.product || payload;
      const qtyToAdd = payload.qty || 1;
      const id = product.id;

      if (state.items[id]) {
        state.items[id].qty += qtyToAdd;
      } else {
        state.items[id] = {
          product,
          qty: qtyToAdd
        };
      }
    },
    updateQuantity(state, action) {
      const { id, qty } = action.payload;
      const numericQty = parseInt(qty, 10);

      if (isNaN(numericQty) || numericQty <= 0) {
        // Auto-remove when quantity <= 0 as specified
        delete state.items[id];
      } else if (state.items[id]) {
        state.items[id].qty = numericQty;
      }
    },
    removeFromCart(state, action) {
      const id = action.payload;
      delete state.items[id];
    },
    applyPromoCode(state, action) {
      const code = (action.payload || '').trim().toUpperCase();
      if (PROMO_CODES[code]) {
        state.promoCode = code;
        state.discountRate = PROMO_CODES[code].rate;
        state.promoError = null;
      } else {
        state.promoError = `Invalid coupon "${code}". Try STREAX10 or STREAX50`;
      }
    },
    removePromoCode(state) {
      state.promoCode = null;
      state.discountRate = 0;
      state.promoError = null;
    },
    clearCart(state) {
      state.items = {};
      state.promoCode = null;
      state.discountRate = 0;
      state.promoError = null;
    }
  },
  extraReducers: (builder) => {
    // Automatically reset cart upon placeOrder.fulfilled as mandated by architecture
    builder.addMatcher(
      (action) => action.type === 'orders/placeOrder/fulfilled',
      (state) => {
        state.items = {};
        state.promoCode = null;
        state.discountRate = 0;
        state.promoError = null;
      }
    );
  }
});

export const {
  addToCart,
  updateQuantity,
  removeFromCart,
  applyPromoCode,
  removePromoCode,
  clearCart
} = cartSlice.actions;

export default cartSlice.reducer;

import { createSelector } from '@reduxjs/toolkit';

export const selectCartState = (state) => state.cart;

export const selectCartItemsMap = createSelector(
  [selectCartState],
  (cart) => cart.items || {}
);

export const selectCartItemsList = createSelector(
  [selectCartItemsMap],
  (itemsMap) => Object.values(itemsMap)
);

export const selectPromoCode = createSelector(
  [selectCartState],
  (cart) => cart.promoCode
);

export const selectDiscountRate = createSelector(
  [selectCartState],
  (cart) => cart.discountRate || 0
);

export const selectPromoError = createSelector(
  [selectCartState],
  (cart) => cart.promoError
);

// Memoized derived financial pipeline
export const selectCartTotals = createSelector(
  [selectCartItemsList, selectDiscountRate, selectPromoCode],
  (items, discountRate, promoCode) => {
    let itemCount = 0;
    let rawSubtotal = 0;

    for (const item of items) {
      const qty = item.qty || 0;
      const price = item.product?.price || 0;
      itemCount += qty;
      rawSubtotal += price * qty;
    }

    const subtotal = Number(rawSubtotal.toFixed(2));
    const discountAmount = Number((subtotal * discountRate).toFixed(2));
    const discountedSubtotal = Math.max(0, subtotal - discountAmount);

    // Mandated 8% sales tax calculation on discounted subtotal
    const taxAmount = Number((discountedSubtotal * 0.08).toFixed(2));
    const finalTotal = Number((discountedSubtotal + taxAmount).toFixed(2));

    return {
      itemCount,
      subtotal,
      discountAmount,
      discountRate,
      promoCode,
      discountedSubtotal,
      taxRate: 0.08,
      taxAmount,
      finalTotal,
      isEmpty: itemCount === 0
    };
  }
);

// Total quantity for navbar badge
export const selectCartItemCount = createSelector(
  [selectCartTotals],
  (totals) => totals.itemCount
);

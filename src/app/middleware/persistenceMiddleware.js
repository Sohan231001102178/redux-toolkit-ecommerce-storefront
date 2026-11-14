import { saveState } from '../../utils/storage';

/**
 * Custom Redux Middleware: Cart & Preference Persistence
 *
 * Listens for state mutations matching `cart/*` or `products/setSortBy`
 * and serializes the updated slice state directly to localStorage.
 */
export const persistenceMiddleware = (store) => (next) => (action) => {
  const result = next(action);

  if (action.type && action.type.startsWith('cart/')) {
    const cartState = store.getState().cart;
    saveState('streax_cart_state', {
      items: cartState.items,
      promoCode: cartState.promoCode,
      discountRate: cartState.discountRate
    });
  }

  if (action.type === 'products/setSortBy') {
    const currentSort = store.getState().products.filters.sortBy;
    saveState('streax_product_prefs', { sortBy: currentSort });
  }

  return result;
};

export default persistenceMiddleware;

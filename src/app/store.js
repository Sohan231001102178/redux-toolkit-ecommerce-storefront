import { configureStore } from '@reduxjs/toolkit';
import productsReducer from '../features/products/productsSlice';
import cartReducer from '../features/cart/cartSlice';
import authReducer from '../features/auth/authSlice';
import ordersReducer from '../features/orders/ordersSlice';
import { loggerAnalyticsMiddleware } from './middleware/loggerAnalyticsMiddleware';
import { persistenceMiddleware } from './middleware/persistenceMiddleware';
import { loadState } from '../utils/storage';

// 1. Hydrate persisted state from localStorage on startup
const hydratedCart = loadState('streax_cart_state', {
  items: {},
  promoCode: null,
  discountRate: 0,
  promoError: null
});

const hydratedAuth = loadState('streax_auth', {
  user: null,
  token: null,
  isAuthenticated: false,
  status: 'idle',
  error: null
});

const hydratedPrefs = loadState('streax_product_prefs', {
  sortBy: 'featured'
});

export const store = configureStore({
  reducer: {
    products: productsReducer,
    cart: cartReducer,
    auth: authReducer,
    orders: ordersReducer
  },
  preloadedState: {
    cart: hydratedCart,
    auth: hydratedAuth,
    products: {
      ids: [],
      entities: {},
      categories: [],
      status: 'idle',
      error: null,
      filters: {
        category: 'all',
        search: '',
        sortBy: hydratedPrefs.sortBy || 'featured',
        maxPrice: 100000
      }
    }
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore date strings or abort controller artifacts if any
        ignoredActions: []
      }
    }).concat(loggerAnalyticsMiddleware, persistenceMiddleware),
  devTools: process.env.NODE_ENV !== 'production'
});

export default store;

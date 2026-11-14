# STREAX SELLER // Reactive Redux Toolkit Enterprise Storefront (India / INR ₹)

A production-grade, reactive dark-theme e-commerce web application engineered with **Redux Toolkit (RTK)**, React 18+, React-Redux, and React Router v6.

---

## 🌟 Core Highlights & Updates

1. **Indian Currency (INR / ₹) Integration**
   - Centralized `formatINR` helper using the Indian numbering system (`₹1,29,999.00`).
   - Authentic Indian pricing throughout catalog, category tabs, quantity steppers, cart, tax (GST), and checkout receipts.
   - Dynamic price range filter slider (₹500 to ₹1,00,000).

2. **Rebranded to STREAX SELLER**
   - Brand identity: **STREAX SELLER — India's Premier Redux Storefront**.
   - India-adapted checkout with **UPI (GPay / PhonePe / Paytm)**, **RuPay / Cards**, and **Cash on Delivery (COD)**.
   - Presets for Indian locations (Mumbai, Delhi, Bengaluru, etc.) and accounts (`rohit@streaxsellers.in`, `admin@streaxsellers.in`).
   - Order confirmation codes formatted as `STX-ORD-XXXX`.
   - Special promo coupon codes: `STREAX10` (10% off), `STREAX20` (20% off), `STREAX50` (50% off VIP), `FESTIVE25`.

3. **Normalized Store Architecture (`createEntityAdapter`)**
   - `ids: []` and normalized `entities: {}` store in [productsSlice.js](file:///C:/Users/USER/.gemini/antigravity/scratch/redux-ecommerce-app/src/features/products/productsSlice.js).
   - $O(1)$ constant-time lookup with zero redundant entity state.

4. **Reselect Memoized Pipelines (`createSelector`)**
   - [cartSelectors.js](file:///C:/Users/USER/.gemini/antigravity/scratch/redux-ecommerce-app/src/features/cart/cartSelectors.js): Computes `itemCount`, `subtotal`, promo coupon savings, **8% GST / State tax**, and final total in INR.
   - [productsSelectors.js](file:///C:/Users/USER/.gemini/antigravity/scratch/redux-ecommerce-app/src/features/products/productsSelectors.js): Memoized multi-stage filtering by category, search text, max price ceiling, and sorting without mutating state.

5. **Action Telemetry & State Persistence Middleware**
   - [loggerAnalyticsMiddleware.js](file:///C:/Users/USER/.gemini/antigravity/scratch/redux-ecommerce-app/src/app/middleware/loggerAnalyticsMiddleware.js): Intercepts dispatched actions, computes timing via `performance.now()`, records conversions (`cart/addToCart`, `orders/placeOrder/fulfilled`), and streams to the floating **RTK Telemetry HUD**.
   - [persistenceMiddleware.js](file:///C:/Users/USER/.gemini/antigravity/scratch/redux-ecommerce-app/src/app/middleware/persistenceMiddleware.js): Synchronizes active cart state and sort preferences to `localStorage`.

6. **Route Protection & Auto Cart Reset**
   - `<ProtectedRoute>` redirects visitors attempting to access `/checkout` or `/orders` to `/login` with return path preservation.
   - `cartSlice` listens for `orders/placeOrder/fulfilled` via `extraReducers` to wipe the shopping cart automatically once an order is placed.

---

## ⚡ Running the Application

### 1. Launch Dev Server
```bash
npm run dev
```
Open your browser at: **`http://localhost:5173`**

### 2. Run Test Suite (Vitest)
```bash
npm test
```
All 14 unit and integration tests are passing:
- `productsSlice.test.js` (4 tests)
- `cartSlice.test.js` (7 tests)
- `ordersSlice.test.js` (3 tests)

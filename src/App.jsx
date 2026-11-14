import React, { useEffect, useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts } from './features/products/productsSlice';
import { selectProductsStatus } from './features/products/productsSelectors';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { Storefront } from './components/catalog/Storefront';
import { CartPage } from './components/cart/CartPage';
import { CartDrawer } from './components/cart/CartDrawer';
import { CheckoutForm } from './components/checkout/CheckoutForm';
import { OrderHistoryList } from './components/checkout/OrderHistoryList';
import { LoginPage } from './features/auth/LoginPage';
import { ProtectedRoute } from './features/auth/ProtectedRoute';
import { TelemetryHUD } from './components/telemetry/TelemetryHUD';

export const App = () => {
  const dispatch = useDispatch();
  const status = useSelector(selectProductsStatus);

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isFilterMobileOpen, setIsFilterMobileOpen] = useState(false);

  // Mandated request state machine: triggers initial catalog fetch on mount if status === 'idle'
  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchProducts());
    }
  }, [dispatch, status]);

  return (
    <div className="min-h-screen bg-dark-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-600 selection:text-white">
      
      {/* Top Navbar */}
      <Navbar
        onOpenCart={() => setIsCartOpen(true)}
        onToggleFilters={() => setIsFilterMobileOpen(true)}
      />

      {/* Main Route Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Routes>
          <Route
            path="/"
            element={
              <Storefront
                isFilterMobileOpen={isFilterMobileOpen}
                onCloseFilterMobile={() => setIsFilterMobileOpen(false)}
              />
            }
          />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/login" element={<LoginPage />} />

          {/* Protected Routes */}
          <Route
            path="/checkout"
            element={
              <ProtectedRoute>
                <CheckoutForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/orders"
            element={
              <ProtectedRoute>
                <OrderHistoryList />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>

      {/* Slide-out Cart Drawer */}
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />

      {/* Live Redux Telemetry HUD */}
      <TelemetryHUD />

      {/* Footer */}
      <Footer />

    </div>
  );
};

export default App;

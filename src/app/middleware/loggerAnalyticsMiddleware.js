/**
 * Custom Redux Middleware: Analytics & Action Logger
 *
 * Intercepts every dispatched action (store => next => action),
 * measures execution duration via performance.now(), and tracks e-commerce
 * conversion events ('cart/addToCart', 'orders/placeOrder/fulfilled')
 * and records rejected async thunk errors.
 */

// Global telemetry ring buffer for real-time visual inspection in TelemetryHUD
export const telemetryLog = [];
export const telemetryListeners = new Set();

export const subscribeTelemetry = (callback) => {
  telemetryListeners.add(callback);
  return () => telemetryListeners.delete(callback);
};

const notifyTelemetry = (entry) => {
  telemetryLog.unshift(entry);
  if (telemetryLog.length > 50) telemetryLog.pop();
  telemetryListeners.forEach((fn) => fn([...telemetryLog]));
};

export const loggerAnalyticsMiddleware = (store) => (next) => (action) => {
  const startTime = performance.now();
  const prevState = store.getState();

  // Forward action to next middleware / reducer
  const result = next(action);

  const durationMs = Number((performance.now() - startTime).toFixed(2));
  const nextState = store.getState();

  // 1. Console auditing for developer telemetry
  console.groupCollapsed(
    `%c[RTK Action] %c${action.type} %c(${durationMs}ms)`,
    'color: #06b6d4; font-weight: bold;',
    'color: #e2e8f0; font-weight: bold;',
    durationMs > 10 ? 'color: #f59e0b;' : 'color: #10b981;'
  );
  console.log('Action Payload:', action.payload);
  console.log('Previous State:', prevState);
  console.log('Next State:', nextState);
  console.groupEnd();

  // 2. Telemetry record
  const logEntry = {
    id: `act_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
    type: action.type,
    payload: action.payload,
    durationMs,
    timestamp: new Date().toLocaleTimeString(),
    isConversion: false,
    conversionType: null,
    isError: false
  };

  // 3. E-commerce conversion tracking
  if (action.type === 'cart/addToCart') {
    logEntry.isConversion = true;
    logEntry.conversionType = 'ADD_TO_CART';
    console.info(
      '%c[ANALYTICS] Conversion Event: ADD_TO_CART',
      'background: #10b981; color: #000; padding: 2px 6px; border-radius: 4px; font-weight: bold;',
      action.payload
    );
  } else if (action.type === 'orders/placeOrder/fulfilled') {
    logEntry.isConversion = true;
    logEntry.conversionType = 'PURCHASE_COMPLETED';
    console.info(
      '%c[ANALYTICS] Conversion Event: PURCHASE_COMPLETED',
      'background: #a855f7; color: #fff; padding: 2px 6px; border-radius: 4px; font-weight: bold;',
      {
        orderId: action.payload?.id,
        revenue: action.payload?.totals?.finalTotal
      }
    );
  } else if (action.type.endsWith('/rejected')) {
    logEntry.isError = true;
    console.warn(
      `%c[ERROR AUDIT] Thunk Failure: ${action.type}`,
      'background: #f43f5e; color: #fff; padding: 2px 6px; border-radius: 4px; font-weight: bold;',
      action.error || action.payload
    );
  }

  notifyTelemetry(logEntry);

  return result;
};

export default loggerAnalyticsMiddleware;

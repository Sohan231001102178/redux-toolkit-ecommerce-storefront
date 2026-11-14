/**
 * Safe JSON localStorage read/write helpers with try/catch error handling.
 */

export const loadState = (key, fallback = undefined) => {
  try {
    if (typeof window === 'undefined' || !window.localStorage) {
      return fallback;
    }
    const serializedState = window.localStorage.getItem(key);
    if (serializedState === null) {
      return fallback;
    }
    return JSON.parse(serializedState);
  } catch (err) {
    console.warn(`[storage] Error loading state for key "${key}":`, err);
    return fallback;
  }
};

export const saveState = (key, state) => {
  try {
    if (typeof window === 'undefined' || !window.localStorage) {
      return;
    }
    const serializedState = JSON.stringify(state);
    window.localStorage.setItem(key, serializedState);
  } catch (err) {
    console.warn(`[storage] Error saving state for key "${key}":`, err);
  }
};

export const removeState = (key) => {
  try {
    if (typeof window === 'undefined' || !window.localStorage) {
      return;
    }
    window.localStorage.removeItem(key);
  } catch (err) {
    console.warn(`[storage] Error removing state for key "${key}":`, err);
  }
};

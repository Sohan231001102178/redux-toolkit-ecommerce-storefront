import { createSelector } from '@reduxjs/toolkit';
import { productsAdapter } from './productsSlice';

// 1. Base Adapter Selectors
export const selectProductsState = (state) => state.products;

const adapterSelectors = productsAdapter.getSelectors(selectProductsState);

export const selectAllProducts = adapterSelectors.selectAll;
export const selectProductEntities = adapterSelectors.selectEntities;
export const selectProductById = (state, id) => adapterSelectors.selectById(state, id);
export const selectProductIds = adapterSelectors.selectIds;

// 2. Status & Filter Selectors
export const selectProductsStatus = (state) => state.products.status;
export const selectProductsError = (state) => state.products.error;
export const selectProductFilters = (state) => state.products.filters;

export const selectCategories = createSelector(
  [selectAllProducts],
  (products) => {
    const set = new Set(products.map((p) => p.category).filter(Boolean));
    return ['all', ...Array.from(set)];
  }
);

export const selectPriceRange = createSelector(
  [selectAllProducts],
  (products) => {
    if (!products.length) return { min: 500, max: 100000 };
    const prices = products.map((p) => p.price);
    return {
      min: Math.floor(Math.min(...prices)),
      max: Math.ceil(Math.max(...prices))
    };
  }
);

// 3. Memoized Filtered & Sorted Product Pipeline
export const selectFilteredProducts = createSelector(
  [selectAllProducts, selectProductFilters],
  (products, filters) => {
    const { category, search, sortBy, maxPrice } = filters;
    const cleanSearch = (search || '').trim().toLowerCase();

    // 1. Filter phase
    const filtered = products.filter((product) => {
      // Category match
      if (category && category !== 'all' && product.category !== category) {
        return false;
      }

      // Max price ceiling
      if (typeof maxPrice === 'number' && product.price > maxPrice) {
        return false;
      }

      // Search keyword substring in title or description
      if (cleanSearch) {
        const titleMatch = (product.title || '').toLowerCase().includes(cleanSearch);
        const descMatch = (product.description || '').toLowerCase().includes(cleanSearch);
        if (!titleMatch && !descMatch) {
          return false;
        }
      }

      return true;
    });

    // 2. Sort phase without mutating cached entities
    const sorted = [...filtered];
    switch (sortBy) {
      case 'price-asc':
        sorted.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        sorted.sort((a, b) => b.price - a.price);
        break;
      case 'rating-desc':
        sorted.sort((a, b) => (b.rating?.rate || 0) - (a.rating?.rate || 0));
        break;
      case 'featured':
      default:
        // maintain stable normalized ID order
        sorted.sort((a, b) => a.id - b.id);
        break;
    }

    return sorted;
  }
);

// Count of products matching current filters
export const selectFilteredCount = createSelector(
  [selectFilteredProducts],
  (filtered) => filtered.length
);

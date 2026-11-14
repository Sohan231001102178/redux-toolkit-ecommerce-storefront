import { describe, it, expect } from 'vitest';
import productsReducer, {
  productsAdapter,
  setCategory,
  setSearchQuery,
  setSortBy,
  setMaxPrice,
  resetFilters,
  FALLBACK_PRODUCTS
} from './productsSlice';
import {
  selectFilteredProducts,
  selectCategories
} from './productsSelectors';

describe('productsSlice & selectors', () => {
  const initialAdapterState = productsAdapter.getInitialState({
    categories: [],
    status: 'idle',
    error: null,
    filters: {
      category: 'all',
      search: '',
      sortBy: 'featured',
      maxPrice: 1000
    }
  });

  it('should return initial state', () => {
    const state = productsReducer(undefined, { type: '@@INIT' });
    expect(state.status).toBe('idle');
    expect(state.filters.category).toBe('all');
    expect(state.ids).toEqual([]);
  });

  it('should handle filter actions', () => {
    let state = productsReducer(initialAdapterState, setCategory('electronics'));
    expect(state.filters.category).toBe('electronics');

    state = productsReducer(state, setSearchQuery('backpack'));
    expect(state.filters.search).toBe('backpack');

    state = productsReducer(state, setSortBy('price-asc'));
    expect(state.filters.sortBy).toBe('price-asc');

    state = productsReducer(state, setMaxPrice(50000));
    expect(state.filters.maxPrice).toBe(50000);

    state = productsReducer(state, resetFilters());
    expect(state.filters.category).toBe('all');
    expect(state.filters.search).toBe('');
    expect(state.filters.maxPrice).toBe(100000);
  });

  it('should filter and sort products through selectFilteredProducts', () => {
    const loadedState = productsAdapter.setAll(initialAdapterState, FALLBACK_PRODUCTS);

    const mockRootState = {
      products: {
        ...loadedState,
        filters: {
          category: "electronics",
          search: "SSD",
          sortBy: 'price-asc',
          maxPrice: 50000
        }
      }
    };

    const results = selectFilteredProducts(mockRootState);
    expect(results.length).toBeGreaterThan(0);
    results.forEach((p) => {
      expect(p.category).toBe("electronics");
      expect(p.title.toLowerCase()).toContain('ssd');
      expect(p.price).toBeLessThanOrEqual(50000);
    });
  });

  it('should derive distinct categories through selectCategories', () => {
    const loadedState = productsAdapter.setAll(initialAdapterState, FALLBACK_PRODUCTS);
    const mockRootState = { products: loadedState };

    const categories = selectCategories(mockRootState);
    expect(categories).toContain('all');
    expect(categories).toContain('electronics');
    expect(categories).toContain('jewelery');
  });
});

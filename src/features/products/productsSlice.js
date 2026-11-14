import { createSlice, createAsyncThunk, createEntityAdapter } from '@reduxjs/toolkit';

// 1. Entity Adapter for normalized entity caching
export const productsAdapter = createEntityAdapter({
  selectId: (product) => product.id,
  sortComparer: (a, b) => a.id - b.id,
});

// USD to INR conversion multiplier for authentic Indian pricing
export const USD_TO_INR_RATE = 85;

// Resilient Fallback Mock Catalog (20 items in Indian Rupees INR - ₹)
export const FALLBACK_PRODUCTS = [
  {
    id: 1,
    title: "Fjallraven - Foldsack No. 1 Backpack, Fits 15 Laptops",
    price: 9345.0,
    description: "Your perfect pack for everyday use and walks in the forest. Stash your laptop (up to 15 inches) in the padded sleeve.",
    category: "men's clothing",
    image: "https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg",
    rating: { rate: 3.9, count: 120 }
  },
  {
    id: 2,
    title: "Mens Casual Premium Slim Fit T-Shirts",
    price: 1899.0,
    description: "Slim-fitting style, contrast raglan long sleeve, three-button henley placket, light weight & soft fabric for breathable comfort.",
    category: "men's clothing",
    image: "https://fakestoreapi.com/img/71-3HjGNDUL._AC_SY879._SX._UX._SY._UY_.jpg",
    rating: { rate: 4.1, count: 259 }
  },
  {
    id: 3,
    title: "Mens Cotton Outdoor Jacket",
    price: 4759.0,
    description: "Great outerwear jackets for Spring/Autumn/Winter, suitable for many occasions, such as working, hiking, camping.",
    category: "men's clothing",
    image: "https://fakestoreapi.com/img/71li-ujtlUL._AC_UX679_.jpg",
    rating: { rate: 4.7, count: 500 }
  },
  {
    id: 4,
    title: "Mens Casual Slim Fit Henley",
    price: 1359.0,
    description: "The color could be slightly different between on the screen and in practice. Hand wash cold recommended.",
    category: "men's clothing",
    image: "https://fakestoreapi.com/img/71YXzeOuslL._AC_UY879_.jpg",
    rating: { rate: 2.1, count: 430 }
  },
  {
    id: 5,
    title: "John Hardy Women's Legends Naga Gold & Silver Dragon Bracelet",
    price: 59075.0,
    description: "From our Legends Collection, the Naga was inspired by the mythical water dragon that protects the ocean's pearl.",
    category: "jewelery",
    image: "https://fakestoreapi.com/img/71pWzhdJNwL._AC_UL640_QL65_ML3_.jpg",
    rating: { rate: 4.6, count: 400 }
  },
  {
    id: 6,
    title: "Solid Gold Petite Micropave Ring",
    price: 14280.0,
    description: "Satisfaction Guaranteed. Return or exchange any order within 30 days. Designed and sold exclusively by Hafeez Center.",
    category: "jewelery",
    image: "https://fakestoreapi.com/img/61sbMiUnoGL._AC_UL640_QL65_ML3_.jpg",
    rating: { rate: 3.9, count: 70 }
  },
  {
    id: 7,
    title: "White Gold Plated Princess Solitaire Ring",
    price: 849.0,
    description: "Classic Created Wedding Engagement Solitaire Diamond Promise Ring for Her. Gifts to spoil your love more for Anniversary.",
    category: "jewelery",
    image: "https://fakestoreapi.com/img/71YAIFU48IL._AC_UL640_QL65_ML3_.jpg",
    rating: { rate: 3.0, count: 400 }
  },
  {
    id: 8,
    title: "Pierced Owl Rose Gold Plated Stainless Steel Earrings",
    price: 934.0,
    description: "Rose Gold Plated Double Flared Tunnel Plug Earrings. Made of 316L Stainless Steel.",
    category: "jewelery",
    image: "https://fakestoreapi.com/img/51UDEzMJVpL._AC_UL640_QL65_ML3_.jpg",
    rating: { rate: 1.9, count: 100 }
  },
  {
    id: 9,
    title: "WD 2TB Elements Portable External Hard Drive - USB 3.0",
    price: 5440.0,
    description: "USB 3.0 and USB 2.0 Compatibility Fast data transfers Improve PC Performance High Capacity.",
    category: "electronics",
    image: "https://fakestoreapi.com/img/61IBBVJvSDL._AC_SY879_.jpg",
    rating: { rate: 3.3, count: 203 }
  },
  {
    id: 10,
    title: "SanDisk SSD PLUS 1TB Internal SSD - SATA III 6 Gb/s",
    price: 9265.0,
    description: "Easy upgrade for faster boot up, shutdown, application load and response. Boosts burst write performance.",
    category: "electronics",
    image: "https://fakestoreapi.com/img/61U7T1koQqL._AC_SX679_.jpg",
    rating: { rate: 2.9, count: 470 }
  },
  {
    id: 11,
    title: "Silicon Power 256GB SSD 3D NAND A55 SLC Cache Performance Boost",
    price: 9265.0,
    description: "3D NAND flash are applied to deliver high transfer speeds. Remarkable transfer speeds that enable faster bootup and overall improved system performance.",
    category: "electronics",
    image: "https://fakestoreapi.com/img/71kWymZ+c+L._AC_SX679_.jpg",
    rating: { rate: 4.8, count: 319 }
  },
  {
    id: 12,
    title: "WD 4TB Gaming Drive Works with Playstation 4 Portable External Hard Drive",
    price: 9690.0,
    description: "Expand your PS4 gaming experience, Play anywhere Fast and easy, setup Sleek design with high capacity.",
    category: "electronics",
    image: "https://fakestoreapi.com/img/61mtL65D4cL._AC_SX679_.jpg",
    rating: { rate: 4.8, count: 400 }
  },
  {
    id: 13,
    title: "Acer SB220Q bi 21.5 inches Full HD (1920 x 1080) IPS Ultra-Thin",
    price: 50915.0,
    description: "21. 5 inches Full HD widescreen IPS display And Radeon free Sync technology. No compatibility for VESA Mount.",
    category: "electronics",
    image: "https://fakestoreapi.com/img/81QpkIctqPL._AC_SX679_.jpg",
    rating: { rate: 2.9, count: 250 }
  },
  {
    id: 14,
    title: "Samsung 49-Inch CHG90 144Hz Curved Gaming Monitor Super Ultrawide Screen",
    price: 84999.0,
    description: "49 INCH SUPER ULTRAWIDE 32:9 CURVED GAMING MONITOR with dual 27 inch screen side by side. Quantum dot (QLED) technology.",
    category: "electronics",
    image: "https://fakestoreapi.com/img/81Zt42ioCgL._AC_SX679_.jpg",
    rating: { rate: 4.2, count: 140 }
  },
  {
    id: 15,
    title: "BIYLACLESEN Women's 3-in-1 Snowboard Jacket Winter Coats",
    price: 4844.0,
    description: "Note:The Jackets is US standard size, Please choose size as your usual wear. Material: 100% Polyester.",
    category: "women's clothing",
    image: "https://fakestoreapi.com/img/51Y5NI-I5jL._AC_UX679_.jpg",
    rating: { rate: 2.6, count: 235 }
  },
  {
    id: 16,
    title: "Lock and Love Women's Removable Hooded Faux Leather Moto Biker Jacket",
    price: 2545.0,
    description: "100% POLYURETHANE (shell) 100% POLYESTER (lining). Faux leather material for style and comfort.",
    category: "women's clothing",
    image: "https://fakestoreapi.com/img/81XH0e8fefL._AC_UY879_.jpg",
    rating: { rate: 2.9, count: 340 }
  },
  {
    id: 17,
    title: "Rain Jacket Women Windbreaker Striped Climbing Raincoats",
    price: 3399.0,
    description: "Lightweight perfect for casual daily, outdoor climbing, running, cycling, camping, hiking, picnic, walking.",
    category: "women's clothing",
    image: "https://fakestoreapi.com/img/71HblAHs5xL._AC_UY879_-2.jpg",
    rating: { rate: 3.8, count: 679 }
  },
  {
    id: 18,
    title: "MBJ Women's Solid Short Sleeve Boat Neck V Neck",
    price: 837.0,
    description: "95% RAYON 5% SPANDEX, Made in USA or Imported, Do Not Bleach, Lightweight fabric with great stretch for comfort.",
    category: "women's clothing",
    image: "https://fakestoreapi.com/img/71z3kpMAYUL._AC_UY879_.jpg",
    rating: { rate: 4.7, count: 130 }
  },
  {
    id: 19,
    title: "Opna Women's Short Sleeve Moisture",
    price: 675.0,
    description: "100% Polyester, Machine wash, 100% cationic polyester interlock, Lightweight, roomy and highly breathable with moisture wicking fabric.",
    category: "women's clothing",
    image: "https://fakestoreapi.com/img/51eg55uWmdL._AC_UX679_.jpg",
    rating: { rate: 4.5, count: 146 }
  },
  {
    id: 20,
    title: "DANVOUY Womens T Shirt Casual Cotton Short",
    price: 1104.0,
    description: "95%Cotton,5%Spandex, Features: Casual, Short Sleeve, Letter Print,V-Neck,Fashion Tees The fabric is soft and has some stretch.",
    category: "women's clothing",
    image: "https://fakestoreapi.com/img/61pHAEJ4NML._AC_UX679_.jpg",
    rating: { rate: 3.6, count: 145 }
  }
];

// Async Thunks
export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async (_, { rejectWithValue }) => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 6000);
      
      const response = await fetch('https://fakestoreapi.com/products', {
        signal: controller.signal
      });
      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`API responded with status: ${response.status}`);
      }
      const data = await response.json();
      if (data && data.length > 0) {
        // Convert to INR prices
        return data.map((item) => ({
          ...item,
          price: Math.round(item.price * USD_TO_INR_RATE)
        }));
      }
      return FALLBACK_PRODUCTS;
    } catch (err) {
      console.warn('[productsSlice] FakeStoreAPI fetch failed or timed out. Gracefully loading INR fallback catalog:', err.message);
      return FALLBACK_PRODUCTS;
    }
  }
);

export const fetchProductById = createAsyncThunk(
  'products/fetchProductById',
  async (id, { getState, rejectWithValue }) => {
    try {
      const state = getState();
      const cached = state.products.entities[id];
      if (cached) return cached;

      const response = await fetch(`https://fakestoreapi.com/products/${id}`);
      if (!response.ok) throw new Error('Product not found');
      const item = await response.json();
      return {
        ...item,
        price: Math.round(item.price * USD_TO_INR_RATE)
      };
    } catch (err) {
      const fallbackItem = FALLBACK_PRODUCTS.find(p => p.id === Number(id));
      if (fallbackItem) return fallbackItem;
      return rejectWithValue(err.message);
    }
  }
);

const initialState = productsAdapter.getInitialState({
  categories: [],
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
  filters: {
    category: 'all',
    search: '',
    sortBy: 'featured', // 'featured' | 'price-asc' | 'price-desc' | 'rating-desc'
    maxPrice: 100000 // INR ₹1,00,000 ceiling
  }
});

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setCategory(state, action) {
      state.filters.category = action.payload;
    },
    setSearchQuery(state, action) {
      state.filters.search = action.payload;
    },
    setSortBy(state, action) {
      state.filters.sortBy = action.payload;
    },
    setMaxPrice(state, action) {
      state.filters.maxPrice = Number(action.payload);
    },
    resetFilters(state) {
      state.filters = {
        category: 'all',
        search: '',
        sortBy: 'featured',
        maxPrice: 100000
      };
    }
  },
  extraReducers: (builder) => {
    builder
      // fetchProducts Lifecycle
      .addCase(fetchProducts.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.error = null;
        productsAdapter.setAll(state, action.payload);
        
        // Extract distinct categories
        const distinct = Array.from(new Set(action.payload.map(p => p.category))).filter(Boolean);
        state.categories = distinct;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || action.error.message || 'Failed to load catalog';
      })
      // fetchProductById Lifecycle
      .addCase(fetchProductById.fulfilled, (state, action) => {
        productsAdapter.upsertOne(state, action.payload);
      });
  }
});

export const {
  setCategory,
  setSearchQuery,
  setSortBy,
  setMaxPrice,
  resetFilters
} = productsSlice.actions;

export default productsSlice.reducer;

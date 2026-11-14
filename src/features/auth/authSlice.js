import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { saveState, removeState } from '../../utils/storage';

// Simulated async login thunk with 600ms delay as specified
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async ({ email, password, name }, { rejectWithValue }) => {
    // 600ms network verification latency simulation
    await new Promise((resolve) => setTimeout(resolve, 600));

    if (!email || !password) {
      return rejectWithValue('Email and password are required');
    }

    if (password.length < 4) {
      return rejectWithValue('Password must be at least 4 characters long');
    }

    // Generate mock user and session token
    const cleanEmail = email.trim().toLowerCase();
    const displayName = name || (cleanEmail.startsWith('admin') ? 'Streax SuperAdmin' : 'Rohit Sharma');
    const role = cleanEmail.includes('admin') ? 'admin' : 'customer';

    const user = {
      id: `usr_${Math.random().toString(36).substr(2, 7)}`,
      name: displayName,
      email: cleanEmail,
      role: role
    };

    const token = `jwt_mock_${btoa(cleanEmail + ':' + Date.now())}`;

    // Store auth credentials in localStorage
    saveState('streax_auth', { user, token, isAuthenticated: true });

    return { user, token };
  }
);

const initialState = {
  user: null,
  token: null,
  isAuthenticated: false,
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logoutUser(state) {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.status = 'idle';
      state.error = null;
      removeState('streax_auth');
    },
    restoreSession(state, action) {
      if (action.payload) {
        state.user = action.payload.user || null;
        state.token = action.payload.token || null;
        state.isAuthenticated = Boolean(action.payload.isAuthenticated);
      }
    },
    clearAuthError(state) {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || action.error.message || 'Login failed';
      });
  }
});

export const { logoutUser, restoreSession, clearAuthError } = authSlice.actions;

export const selectAuth = (state) => state.auth;
export const selectCurrentUser = (state) => state.auth.user;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectAuthStatus = (state) => state.auth.status;
export const selectAuthError = (state) => state.auth.error;

export default authSlice.reducer;

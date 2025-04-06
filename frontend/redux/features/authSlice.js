import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: null,
  isAuthenticated: false,
};

// Load state from localStorage if available
if (typeof window !== 'undefined') {
  const savedAuth = localStorage.getItem('auth');
  if (savedAuth) {
    initialState.user = JSON.parse(savedAuth).user;
    initialState.isAuthenticated = true;
  }
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      const { user } = action.payload;
      state.user = user;
      state.isAuthenticated = true;
      // Save to localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('auth', JSON.stringify({ user}));
      }
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      // Clear localStorage
      if (typeof window !== 'undefined') {
        localStorage.removeItem('auth');
      }
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;

export const selectCurrentUser = (state) => state.auth.user;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;

export default authSlice.reducer; 
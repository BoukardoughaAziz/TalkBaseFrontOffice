import { createSlice } from '@reduxjs/toolkit';

const userSlice = createSlice({
  name: 'user',
  initialState: {
    currentUserEmail: null,
    user: null,
    accessToken: null,
    refreshToken: null,
    isLoggedIn: false,
  },
  reducers: {
    loginSuccess: (state, action) => {
      state.currentUserEmail = action.payload.user?.email || null;
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      state.isLoggedIn = true;
    },
    logout: (state) => {
      state.currentUserEmail = null;
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.isLoggedIn = false;
    },
    // Add action to restore session from cookies
    restoreSession: (state, action) => {
      state.currentUserEmail = action.payload.user?.email || null;
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
      state.isLoggedIn = true;
    },
  },
});
export const { loginSuccess, logout, restoreSession } = userSlice.actions;
export default userSlice.reducer;
  
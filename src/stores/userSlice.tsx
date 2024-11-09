import { createSlice } from '@reduxjs/toolkit';

const userSlice = createSlice({
  name: 'user',
  initialState: {
    currentUserEmail: null,
    accessToken:null,
    isLoggedIn: false,
  },
  reducers: {
    loginSuccess: (state, action) => {
      state.currentUserEmail = action.payload.email;
      state.accessToken = action.payload.token;
      state.isLoggedIn = true;
    },
    logout: (state) => {
      state.currentUserEmail = null;
      state.isLoggedIn = false;
    },
  },
});
export const { loginSuccess, logout } = userSlice.actions;
export default userSlice.reducer;
  
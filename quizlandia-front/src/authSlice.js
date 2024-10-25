// authSlice.js
import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    authPause: false,
  },
  reducers: {
    setAuthPause: (state, action) => {
      state.authPause = action.payload;
    },
    toggleAuthPause: (state) => {
      state.authPause = !state.authPause;
    },
  },
});

export const { setAuthPause, toggleAuthPause } = authSlice.actions;
export default authSlice.reducer;

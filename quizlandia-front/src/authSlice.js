// authSlice.js
import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    authPause: false,
    uid: undefined,
    userType: undefined,
  },
  reducers: {
    setAuthPause: (state, action) => {
      state.authPause = action.payload;
    },
    toggleAuthPause: (state) => {
      state.authPause = !state.authPause;
    },
    setUid: (state, action) => {
      state.uid = action.payload;
    },
    setUserType: (state, action) => {
      state.userType = action.payload;
    },
  },
});

export const { setAuthPause, toggleAuthPause, setUid, setUserType } = authSlice.actions;
export default authSlice.reducer;
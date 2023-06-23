import { createSlice } from '@reduxjs/toolkit';
import { HYDRATE } from 'next-redux-wrapper';

const isLocalStorageAvailable = typeof window !== 'undefined' && window.localStorage;

const initialState = {
  authState: false,
  authUser: {},  
  
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuthState(state, action) {
      state.authState = action.payload;
    },
    setAuthUser(state, action) {
      state.authUser = action.payload;
    },

    login: (state) => {
      state.isAuthenticated = true;

      if (isLocalStorageAvailable) {
        localStorage.setItem('isAuthenticated', 'true');
      }
    },

    logout: (state) => {
      // Clear the authentication state or any other necessary cleanup tasks
      state.authUser = null; // Assuming you have an `authUser` property in your state
      state.isAuthenticated = false;
      // You can also clear any stored authentication data from localStorage or sessionStorage here if needed
      if (isLocalStorageAvailable) {
        localStorage.removeItem('authUser');
        localStorage.removeItem('authState')
      }
    },

    extraReducers: {
      [HYDRATE]: (state, action) => {
        return {
          ...state,
          ...action.payload.auth,
        };
      },
    },
  },
});

export const { setAuthState, setAuthUser } = authSlice.actions;
export const selectAuthState = (state) => state.auth.authState;
export const selectAuthUser = (state) => state.auth.authUser;
// Export the logout action
export const { login, logout } = authSlice.actions;
export default authSlice.reducer;





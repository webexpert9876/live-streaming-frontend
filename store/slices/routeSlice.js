import { createSlice } from '@reduxjs/toolkit';
import { HYDRATE } from 'next-redux-wrapper';

// const isLocalStorageAvailable = typeof window !== 'undefined' && window.localStorage;

const initialState = {
  currentRoute: '/'
};

export const routeSlice = createSlice({
  name: 'routeInfo',
  initialState,
  reducers: {
    setCurrentRoute(state, action){
      state.currentRoute = action.payload;
    },

    // login: (state) => {
    //   state.isAuthenticated = true;

    //   if (isLocalStorageAvailable) {
    //     localStorage.setItem('isAuthenticated', 'true');
    //   }
    // },

    // logout: (state) => {
    //   // Clear the authentication state or any other necessary cleanup tasks
    //   state.authUser = null; // Assuming you have an `authUser` property in your state
    //   state.isAuthenticated = false;
    //   // You can also clear any stored authentication data from localStorage or sessionStorage here if needed
    //   if (isLocalStorageAvailable) {
    //     localStorage.removeItem('authUser');
    //     localStorage.removeItem('authState')
    //   }
    // },

    routing: (state) => {
        state.currentRoute = ''
    },

    extraReducers: {
      [HYDRATE]: (state, action) => {
        return {
          ...state,
          ...action.payload.routeInfo,
        };
      },
    },
  },
});

export const { setCurrentRoute } = routeSlice.actions;
export const selectRouteInfo = (state) => state.routeInfo.currentRoute;
// Export the logout action
// export const { login, logout } = routeSlice.actions;
export default routeSlice.reducer;





import { createSlice } from '@reduxjs/toolkit';

// Define initial state
const initialState = {
  accessToken: localStorage.getItem('accessToken') || null,
  error: null,
  name : ''
};

// Slice
const usermanage = createSlice({
    name: 'usermanage',
    initialState,
  reducers: {
    login: (state, action) => {
      state.accessToken = action.payload;
      localStorage.setItem('accessToken', action.payload);
    },
    setName:(state,action)=>{
        state.name = action.payload
    },
    logout: (state) => {
      state.accessToken = null;
      localStorage.removeItem('accessToken');
    },
    // setError: (state, action) => {
    //   state.error = action.payload;
    // },
  },
});

export const { login, logout,setName } = usermanage.actions;

export default usermanage.reducer;

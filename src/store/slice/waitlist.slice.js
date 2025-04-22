import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import toast from 'react-native-toast-message';
import axiosInstance from '../../helper/axiosInstance.js';

const initialState = {
  loading: false,
  waitlistData: null,
};

export const getWaitlist = createAsyncThunk('getWaitlist', async () => {
  try {
    const response = await axiosInstance.get('/waitlist/get-waitlist');
    return response.data.data;
  } catch (error) {
    throw error;
  }
});

const waitlistSlice = createSlice({
  name: 'waitList',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(getWaitlist.pending, state => {
      state.loading = true;
    });
    builder.addCase(getWaitlist.fulfilled, (state, action) => {
      state.loading = false;
      state.waitlistData = action.payload;
    });
  },
});

export default waitlistSlice.reducer;

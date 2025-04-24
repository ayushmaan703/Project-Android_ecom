import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import axiosInstance from '../../helper/axiosInstance.js';

const initialState = {
  loading: false,
};

export const sendNotificaiton = createAsyncThunk(
  'sendNotificaiton',
  async data => {
    try {
      await axiosInstance.post('/notification/send-notification', data);
    } catch (error) {
      throw error;
    }
  },
);

export const sendNotificaitonToAll = createAsyncThunk(
  'sendNotificaitonToAll',
  async data => {
    try {
      await axiosInstance.post('/notification/send-notification-all', data);
    } catch (error) {
      throw error;
    }
  },
);

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {},
});

export default notificationSlice.reducer;

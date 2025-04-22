import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import toast from 'react-native-toast-message';
import axiosInstance from '../../helper/axiosInstance.js';

const initialState = {
  loading: false,
  status: false,
  userData: null,
};

export const customerLogin = createAsyncThunk('customerLogin', async data => {
  try {
    const response = await axiosInstance.post('/customer/login', data);
    return response.data.data.user;
  } catch (error) {
    toast.error(error?.response?.data?.message);
    throw error;
  }
});
export const customerLogout = createAsyncThunk('customerLogout', async () => {
  try {
    const response = await axiosInstance.post('/customer/logout');
    return response.data?.message;
  } catch (error) {
    toast.error(error?.response?.data?.message);
    throw error;
  }
});
export const userRefreshToken = createAsyncThunk('refreshToken', async data => {
  try {
    const response = await axiosInstance.post('/customer/refresh-token', data);
    return response.data;
  } catch (error) {
    toast.error(error?.response?.data?.message);
    throw error;
  }
});
export const changePassword = createAsyncThunk('changePassword', async data => {
  try {
    const response = await axiosInstance.post(
      '/customer/change-password',
      data,
    );
    return response.data;
  } catch (error) {
    throw error;
  }
});
export const currentUserInfo = createAsyncThunk('currentUserInfo', async () => {
  const response = await axiosInstance.post('/customer/current-user');
  return response.data.data;
});
export const updateAvatar = createAsyncThunk('updateAvatar', async data => {
  try {
    const response = await axiosInstance.post('/customer/update-avatar', data);
    toast.success('Avatar updated successfully');
    return response.data.data;
  } catch (error) {
    toast.error(error?.response?.data?.message);
    throw error;
  }
});
export const updateCoverImage = createAsyncThunk(
  ' updateCoverImage',
  async data => {
    try {
      const response = await axiosInstance.post(
        '/customer/update-coverImage',
        data,
      );
      toast.success('Cover image updated successfully');
      return response.data.data;
    } catch (error) {
      toast.error(error?.response?.data?.error);
      throw error;
    }
  },
);
export const updateUserDetails = createAsyncThunk(
  'updateUserDetails',
  async data => {
    try {
      const response = await axiosInstance.patch(
        '/customer/update-details',
        data,
      );
      return response.data.data;
    } catch (error) {
      throw error;
    }
  },
);
const customerAuthSlice = createSlice({
  name: 'customerAuth',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(customerLogin.pending, state => {
      state.loading = true;
    });
    builder.addCase(customerLogin.fulfilled, (state, action) => {
      state.loading = false;
      state.status = true;
      state.userData = action.payload;
    });
    builder.addCase(customerLogout.pending, state => {
      state.loading = true;
    });
    builder.addCase(customerLogout.fulfilled, state => {
      state.loading = false;
      state.status = false;
      state.userData = null;
    });
    builder.addCase(currentUserInfo.pending, state => {
      state.loading = true;
    });
    builder.addCase(currentUserInfo.fulfilled, (state, action) => {
      state.loading = false;
      state.status = true;
      state.userData = action.payload;
    });
    builder.addCase(currentUserInfo.rejected, state => {
      state.loading = false;
      state.status = false;
      state.userData = null;
    });
    builder.addCase(updateAvatar.pending, state => {
      state.loading = true;
    });
    builder.addCase(updateAvatar.fulfilled, (state, action) => {
      state.loading = false;
      state.userData = action.payload;
    });
    builder.addCase(updateAvatar.rejected, state => {
      state.loading = false;
    });
    builder.addCase(updateCoverImage.pending, state => {
      state.loading = true;
    });
    builder.addCase(updateCoverImage.fulfilled, (state, action) => {
      state.loading = false;
      state.userData = action.payload;
    });
    builder.addCase(updateCoverImage.rejected, state => {
      state.loading = false;
    });
    builder.addCase(updateUserDetails.pending, state => {
      state.loading = true;
    });
    builder.addCase(updateUserDetails.fulfilled, (state, action) => {
      state.loading = false;
      state.userData = action.payload;
    });
  },
});
export default customerAuthSlice.reducer;

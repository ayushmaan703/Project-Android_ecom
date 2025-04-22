import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import toast from 'react-native-toast-message';
import axiosInstance from '../../helper/axiosInstance.js';

const initialState = {
  loading: false,
  status: false,
  adminData: null,
};

export const adminCreateAccount = createAsyncThunk(
  'adminCreateAccount',
  async data => {
    const formData = new FormData();
    // {
    //   userName: data.userName,
    //   fullName: data.fullName,
    //   email: data.email,
    //   password: data.password,
    //   photo: data.photo,
    // };
    formData.append('userName', data.userName);
    formData.append('fullName', data.fullName);
    formData.append('email', data.email);
    formData.append('password', data.password);
    formData.append(
      'photo',
      // data.photo,
      {
        uri: data.photo,
        type: 'image/jpeg',
        name: 'photo.jpg',
      },
    );
    console.log(formData);
    try {
      const response = await axiosInstance.post('/admin/register', formData, {
        headers: {'Content-Type': 'multipart/form-data'},
      });
      console.log(response);

      // toast.success('Registered Succcessfully');
      return response.data;
    } catch (error) {
      // toast.error(error?.response?.data?.message);
      throw error;
    }
  },
);

export const adminLogin = createAsyncThunk('adminLogin', async data => {
  try {
    const response = await axiosInstance.post('/admin/login', data);
    return response.data.data.user;
  } catch (error) {
    throw error;
  }
});

export const adminLogout = createAsyncThunk('adminLogout', async () => {
  try {
    const response = await axiosInstance.post('/admin/logout');
    return response.data?.message;
  } catch (error) {
    throw error;
  }
});

export const verifyUser = createAsyncThunk('verifyUser', async data => {
  try {
    const response = await axiosInstance.post('/admin/verify',{verify:data});
    return response.data;
  } catch (error) {
    throw error;
  }
});

// export const userRefreshToken = createAsyncThunk('refreshToken', async data => {
//   try {
//     const response = await axiosInstance.post('/user/refresh-token', data);
//     return response.data;
//   } catch (error) {
//     toast.error(error?.response?.data?.message);
//     throw error;
//   }
// });

export const changePassword = createAsyncThunk('changePassword', async data => {
  try {
    const response = await axiosInstance.post('/admin/change-password', data);
    return response.data;
  } catch (error) {
    throw error;
  }
});

export const currentUserInfo = createAsyncThunk('currentUserInfo', async () => {
  const response = await axiosInstance.post('/admin/current-user');
  return response.data.data;
});

export const updateAvatar = createAsyncThunk('updateAvatar', async data => {
  try {
    const response = await axiosInstance.post('user/update-avatar', data);
    toast.success('Avatar updated successfully');
    return response.data.data;
  } catch (error) {
    toast.error(error?.response?.data?.message);
    throw error;
  }
});

export const updateCoverImage = createAsyncThunk(
  'updateCoverImage',
  async data => {
    try {
      const response = await axiosInstance.post('user/update-coverImage', data);
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
      const response = await axiosInstance.patch('/user/update-details', data);
      return response.data.data;
    } catch (error) {
      throw error;
    }
  },
);

const adminSlice = createSlice({
  name: 'adminAuth',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(adminCreateAccount.pending, state => {
      state.loading = true;
    });
    builder.addCase(adminCreateAccount.fulfilled, state => {
      state.loading = false;
    });
    builder.addCase(adminCreateAccount.rejected, state => {
      state.loading = false;
    });
    builder.addCase(adminLogin.pending, state => {
      state.loading = true;
    });
    builder.addCase(adminLogin.fulfilled, (state, action) => {
      state.loading = false;
      state.status = true;
      state.adminData = action.payload;
    });
    builder.addCase(adminLogout.pending, state => {
      state.loading = true;
    });
    builder.addCase(adminLogout.fulfilled, state => {
      state.loading = false;
      state.status = false;
      state.adminData = null;
    });
    builder.addCase(currentUserInfo.pending, state => {
      state.loading = true;
    });
    builder.addCase(currentUserInfo.fulfilled, (state, action) => {
      state.loading = false;
      state.status = true;
      state.adminData = action.payload;
    });
    builder.addCase(currentUserInfo.rejected, state => {
      state.loading = false;
      state.status = false;
      state.adminData = null;
    });
    builder.addCase(updateAvatar.pending, state => {
      state.loading = true;
    });
    builder.addCase(updateAvatar.fulfilled, (state, action) => {
      state.loading = false;
      state.adminData = action.payload;
    });
    builder.addCase(updateAvatar.rejected, state => {
      state.loading = false;
    });
    builder.addCase(updateCoverImage.pending, state => {
      state.loading = true;
    });
    builder.addCase(updateCoverImage.fulfilled, (state, action) => {
      state.loading = false;
      state.adminData = action.payload;
    });
    builder.addCase(updateCoverImage.rejected, state => {
      state.loading = false;
    });
    builder.addCase(updateUserDetails.pending, state => {
      state.loading = true;
    });
    builder.addCase(updateUserDetails.fulfilled, (state, action) => {
      state.loading = false;
      state.adminData = action.payload;
    });
  },
});
export default adminSlice.reducer;

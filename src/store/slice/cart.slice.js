import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import toast from 'react-native-toast-message';
import axiosInstance from '../../helper/axiosInstance.js';
const initialState = {
  loading: false,
  cart: [],
  playlists: [],
};

export const createACart = createAsyncThunk(
  'createPlaylist',
  async ({name, description}) => {
    try {
      const response = await axiosInstance.post('/playlist/add-playlist', {
        name,
        description,
      });
      if (response.data?.success) {
        toast.success(response.data.message);
      }
      return response.data.data;
    } catch (error) {
      toast.error(error?.response?.data?.message);
      throw error;
    }
  },
);
export const getUserPlaylists = createAsyncThunk(
  'getUserPlaylists',
  async userId => {
    try {
      const response = await axiosInstance.get(`/playlist/user/${userId}`);
      return response.data;
    } catch (error) {
      toast.error(error?.response?.data?.message);
      throw error;
    }
  },
);
export const addVideoToPlaylist = createAsyncThunk(
  'addVideoToPlaylist',
  async ({playlistId, videoId}) => {
    try {
      const response = await axiosInstance.patch(
        `/playlist/add/${videoId}/${playlistId}`,
      );
      if (response.data?.success) {
        toast.success(response.data.message);
      }
      return response.data;
    } catch (error) {
      toast.error(error?.response?.data?.message);
      throw error;
    }
  },
);
export const getPlaylistById = createAsyncThunk(
  'getPlaylistById',
  async playlistId => {
    try {
      const response = await axiosInstance.get(`/playlist/g/${playlistId}`);
      return response.data.data;
    } catch (error) {
      toast.error(error?.response?.data?.message);
      throw error;
    }
  },
);
export const deleteVideoFromPlaylist = createAsyncThunk(
  'deleteVideoFromPlaylist',
  async ({playlistId, videoId}) => {
    try {
      const response = await axiosInstance.patch(
        `/playlist/remove/${videoId}/${playlistId}`,
      );
      if (response.data?.success) {
        toast.success(response.data.message);
      }
      return response.data;
    } catch (error) {
      toast.error(error?.response?.data?.message);
      throw error;
    }
  },
);
export const deletePlaylist = createAsyncThunk(
  'deletePlaylist',
  async playlistId => {
    try {
      const response = await axiosInstance.delete(`/playlist/d/${playlistId}`);
      if (response.data?.success) {
        toast.success(response.data.message);
      }
      return response.data;
    } catch (error) {
      toast.error(error?.response?.data?.message);
      throw error;
    }
  },
);
export const updatePlaylist = createAsyncThunk(
  'updatePlaylist',
  async ({name, description, playlistId}) => {
    try {
      const response = await axiosInstance.patch(`/playlist/u/${playlistId}`, {
        name,
        description,
      });
      if (response.data.success) {
        toast.success(response.data.message);
      }
      return response.data;
    } catch (error) {
      toast.error(error?.response?.data?.message);
      throw error;
    }
  },
);
const playlistSlice = createSlice({
  name: 'playlist',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(getUserPlaylists.fulfilled, (state, action) => {
      state.playlists = action.payload;
    });
    builder.addCase(getPlaylistById.pending, state => {
      state.loading = true;
    });
    builder.addCase(getPlaylistById.fulfilled, (state, action) => {
      state.loading = false;
      state.playlist = action.payload;
    });
  },
});
export default playlistSlice.reducer;

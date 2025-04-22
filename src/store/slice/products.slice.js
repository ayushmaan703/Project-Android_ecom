import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import toast from 'react-native-toast-message';
import axiosInstance from '../../helper/axiosInstance.js';
import baseUrl from '../../../cosntants';
import {number} from 'yup';

const initialState = {
  loading: false,
  uploading: false,
  uploaded: false,
  products: {
    docs: [],
    hasNextPage: false,
  },
  product: null,
  publishToggled: false,
};

export const getAllProducts = createAsyncThunk(
  'getAllProducts',
  async ({sortBy, sortType, query, page, limit}) => {
    try {
      const url = new URL(`${baseUrl}/stock/get-stock`);
      if (query) url.searchParams.set('query', query);
      if (page) url.searchParams.set('page', page);
      if (limit) url.searchParams.set('limit', limit);
      if (sortBy && sortType) {
        url.searchParams.set('sortBy', sortBy);
        url.searchParams.set('sortType', sortType);
      }
      const response = await axiosInstance.get(url.toString());
      return response.data.data;
    } catch (error) {
      throw error;
    }
  },
);

export const publishAProduct = createAsyncThunk(
  'publishAProduct',
  async data => {
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('discount', data.discount);
    formData.append('quantity', data.quantity);
    formData.append(
      'photo',
      // data.photo,
      {
        uri: data.photo,
        type: 'image/jpeg',
        name: 'photo.jpg',
      },
    );
    console.log(data);

    try {
      const response = await axiosInstance.post(
        '/stock/publish-stock',
        formData,
        {
          headers: {'Content-Type': 'multipart/form-data'},
        },
      );
      return response.data.data;
    } catch (error) {
      toast.error(error?.response?.data?.message);
      throw error;
    }
  },
);

export const updateDiscount = createAsyncThunk(
  'updateDiscount',
  async ({prodId, data}) => {
    console.log({prodId, data});

    // const formData = new FormData();
    // formData.append('discount', Number(data.discount));
    // console.log(formData);

    try {
      const response = await axiosInstance.patch(`/stock/update/${prodId}`, {
        discount: Number(data.discount),
      });
      return response.data.data;
    } catch (error) {
      throw error;
    }
  },
);

export const deleteAProd = createAsyncThunk('deleteAProd', async prodId => {
  try {
    const response = await axiosInstance.delete(
      `/stock/delete-stock/${prodId}`,
    );
    return response.data.data;
  } catch (error) {
    throw error;
  }
});

export const getProdById = createAsyncThunk('getProdById', async ({prodId}) => {
  try {
    const response = await axiosInstance.get(`/stock/get-stock/${prodId}`);
    return response.data.data;
  } catch (error) {
    throw error;
  }
});

// export const togglePublishStatus = createAsyncThunk(
//   'togglePublishStatus',
//   async videoId => {
//     try {
//       const response = await axiosInstance.patch(
//         `/video/toggle/publish/${videoId}`,
//       );
//       toast.success(response.data.message);
//       return response.data.data.isPublished;
//     } catch (error) {
//       toast.error(error?.response?.data?.message);
//       throw error;
//     }
//   },
// );

const productSlice = createSlice({
  name: 'product',
  initialState,
  reducers: {
    updateUploadState: state => {
      state.uploading = false;
      state.uploaded = false;
    },
    makeProductsNull: state => {
      state.products.docs = [];
    },
  },
  extraReducers: builder => {
    builder.addCase(getAllProducts.pending, state => {
      state.loading = true;
    });
    builder.addCase(getAllProducts.fulfilled, (state, action) => {
      state.loading = false;
      state.products.docs = [...action.payload];
      state.products.hasNextPage = action.payload?.hasNextPage;
    });
    builder.addCase(publishAProduct.pending, state => {
      
      state.uploading = true;
    });
    builder.addCase(publishAProduct.fulfilled, state => {
      state.uploading = false;
      state.uploaded = true;
    });
    builder.addCase(updateDiscount.pending, state => {
      state.uploading = true;
    });
    builder.addCase(updateDiscount.fulfilled, state => {
      state.uploading = false;
      state.uploaded = true;
    });
    builder.addCase(deleteAProd.pending, state => {
      state.loading = true;
    });
    builder.addCase(deleteAProd.fulfilled, state => {
      state.loading = false;
    });
    builder.addCase(getProdById.pending, state => {
      state.loading = true;
    });
    builder.addCase(getProdById.fulfilled, (state, action) => {
      state.loading = false;
      state.product = action.payload;
    });
    // builder.addCase(togglePublishStatus.fulfilled, state => {
    //   state.publishToggled = !state.publishToggled;
    // });
  },
});

export const {updateUploadState, makeProductsNull} = productSlice.actions;

export default productSlice.reducer;

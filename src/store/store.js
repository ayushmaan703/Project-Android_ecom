import {configureStore} from '@reduxjs/toolkit';
import authSliceReducer from './slice/auth.slice.js';
import productSliceReducer from './slice/products.slice.js';
import adminSliceReducer from './slice/adminControl.slice.js';
import waitlistSliceReducer from './slice/waitlist.slice.js';
import customerSliceReducer from './slice/customer.slice.js';
import notificationSliceReducer from './slice/notification.control.js';

export const store = configureStore({
  reducer: {
    auth: authSliceReducer,
    prod: productSliceReducer,
    admin: adminSliceReducer,
    waiting: waitlistSliceReducer,
    customer: customerSliceReducer,
    notification: notificationSliceReducer,
  },
});

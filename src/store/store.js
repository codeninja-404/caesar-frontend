import { configureStore } from '@reduxjs/toolkit';
import inboxReducer from './inboxSlice';

export const store = configureStore({
    reducer: {
        inbox: inboxReducer,
    },
});
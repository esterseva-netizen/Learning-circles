import { configureStore } from '@reduxjs/toolkit';
import circlesReducer from './circlesSlice';
import postsReducer from './postsSlice';

const store = configureStore({
  reducer: {
    circles: circlesReducer,
    posts: postsReducer,
  },
});

export default store;
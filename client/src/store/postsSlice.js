import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../services/api';

export const fetchFeed = createAsyncThunk('posts/fetchFeed', async () => {
  const res = await api.get('/posts/feed');
  return res.data.data;
});

export const createPost = createAsyncThunk('posts/create', async (postData) => {
  const res = await api.post('/posts', postData);
  return res.data.data;
});

const postsSlice = createSlice({
  name: 'posts',
  initialState: {
    feed: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFeed.pending, (state) => { state.loading = true; })
      .addCase(fetchFeed.fulfilled, (state, action) => {
        state.loading = false;
        state.feed = action.payload;
      })
      .addCase(fetchFeed.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(createPost.fulfilled, (state, action) => {
        state.feed.unshift(action.payload);
      });
  },
});

export default postsSlice.reducer;
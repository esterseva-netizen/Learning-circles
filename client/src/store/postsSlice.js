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

// לייק/ביטול לייק על פוסט — מעדכן את המונה מקומית אחרי שהשרת אישר
export const toggleLike = createAsyncThunk('posts/toggleLike', async ({ postId, userId }) => {
  await api.post(`/posts/${postId}/like`);
  return { postId, userId };
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
      })
      .addCase(toggleLike.fulfilled, (state, action) => {
        const { postId, userId } = action.payload;
        const post = state.feed.find(p => p._id === postId);
        if (post) {
          const alreadyLiked = post.likes?.includes(userId);
          if (alreadyLiked) {
            post.likes = post.likes.filter(id => id !== userId);
            post.likesCount = Math.max(0, (post.likesCount || 1) - 1);
          } else {
            post.likes = [...(post.likes || []), userId];
            post.likesCount = (post.likesCount || 0) + 1;
          }
        }
      });
  },
});

export default postsSlice.reducer;
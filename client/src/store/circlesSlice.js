import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../services/api';

export const fetchCircles = createAsyncThunk('circles/fetchAll', async () => {
  const res = await api.get('/circles');
  return res.data.data;
});

export const joinCircle = createAsyncThunk('circles/join', async (circleId) => {
  const res = await api.post(`/circles/${circleId}/join`);
  return res.data;
});

const circlesSlice = createSlice({
  name: 'circles',
  initialState: {
    list: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCircles.pending, (state) => { state.loading = true; })
      .addCase(fetchCircles.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchCircles.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default circlesSlice.reducer;
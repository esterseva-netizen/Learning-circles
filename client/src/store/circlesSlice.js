import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../services/api';

export const fetchCircles = createAsyncThunk('circles/fetchAll', async () => {
  const res = await api.get('/circles');
  return res.data.data;
});

// המעגלים שהמשתמש המחובר באמת חבר בהם (לא כל המעגלים)
export const fetchMyCircles = createAsyncThunk('circles/fetchMy', async () => {
  const res = await api.get('/circles/my');
  return res.data.data;
});

export const joinCircle = createAsyncThunk('circles/join', async (circleId, { rejectWithValue }) => {
  try {
    const res = await api.post(`/circles/${circleId}/join`);
    return { circleId, message: res.data.message };
  } catch (err) {
    // מחזיר את הודעת השרת (כמו "כבר חבר במעגל זה") כדי שנוכל להציג אותה למשתמש
    return rejectWithValue(err.response?.data?.message || 'שגיאה בהצטרפות למעגל');
  }
});

const circlesSlice = createSlice({
  name: 'circles',
  initialState: {
    list: [],
    myCircles: [],
    loading: false,
    myCirclesLoading: false,
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
      })
      .addCase(fetchMyCircles.pending, (state) => { state.myCirclesLoading = true; })
      .addCase(fetchMyCircles.fulfilled, (state, action) => {
        state.myCirclesLoading = false;
        state.myCircles = action.payload;
      })
      .addCase(fetchMyCircles.rejected, (state) => {
        state.myCirclesLoading = false;
      });
  },
});

export default circlesSlice.reducer;
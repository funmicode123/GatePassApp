import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_BASE_URL}/security/view`;

export const fetchVisitingLogs = createAsyncThunk(
  "visitingLogs/fetch",
  async (_, thunkAPI) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(API_URL, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || "Failed to fetch logs");
    }
  }
);

const visitingLogSlice = createSlice({
  name: "visitingLogs",
  initialState: { logs: [], loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchVisitingLogs.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchVisitingLogs.fulfilled, (state, action) => {
        state.loading = false;
        state.logs = action.payload;
      })
      .addCase(fetchVisitingLogs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default visitingLogSlice.reducer;

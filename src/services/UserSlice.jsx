import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_BASE_URL}/user`;

export const registerUser = createAsyncThunk("user/register", async (userData, thunkAPI) => {
  try {
    const response = await axios.post(`${API_URL}/register`, userData);
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data || "Registration failed");
  }
});

export const loginUser = createAsyncThunk("user/login", async (credentials, thunkAPI) => {
  try {
    const response = await axios.post(`${API_URL}/login`, credentials);
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data || "Login failed");
  }
});

const userSlice = createSlice({
  name: "user",
  initialState: {
    userRole: localStorage.getItem("userRole") || null,
    token: localStorage.getItem("token") || null,
    loading: false,
    error: null,
  },
  reducers: {
    logout: (state) => {
      state.userRole = null;
      state.token = null;
      localStorage.removeItem("token");
      localStorage.removeItem("userRole");
      localStorage.removeItem("userEmail");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.accessToken;
        if (action.payload.accessToken) {
          localStorage.setItem("token", action.payload.accessToken);
        }
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.userRole = action.payload.userRole;
        state.token = action.payload.accessToken;
        localStorage.setItem("token", action.payload.accessToken);
        localStorage.setItem("userRole", action.payload.userRole);
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logout } = userSlice.actions;
export default userSlice.reducer;

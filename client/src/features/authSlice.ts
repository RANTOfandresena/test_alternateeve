import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import { login, type LoginPayload, register, type RegisterPayload } from '../api/auth';

export interface UserInfo {
  id: string;
  nom: string;
  email: string;
  role: string;
}
interface User {
  user: UserInfo;
  token: string;
}

interface AuthState {
  user: User | null;
  isPageManager: boolean;
  isLoggedIn: boolean;
  loading: boolean;
  error: string | null;
  message: string | null;
}

const initialState: AuthState = {
  user: null,
  isPageManager: false,
  isLoggedIn: false,
  loading: false,
  error: null,
  message: null,
};

export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (credentials: LoginPayload, { rejectWithValue }) => {
    try {
      const data = await login(credentials);
      return data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Erreur de connexion');
    }
  }
);

export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async (payload: RegisterPayload, { rejectWithValue }) => {
    try {
      const { message } = await register(payload);
      return message;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Erreur lors de l'inscription");
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.isPageManager = false;
      state.isLoggedIn = false;
      state.error = null;
      state.message = null;
    },
    changePage: (state) => {
      state.isPageManager = state.user?.user.role === "MANAGER" && !state.isPageManager
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.message = null;
      })
      .addCase(loginUser.fulfilled, (state, action: PayloadAction<User>) => {
        state.loading = false;
        state.user = action.payload;
        state.isPageManager = action.payload.user.role === "MANAGER"
        state.isLoggedIn = true;
        state.message = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.message = null;
      })
      .addCase(registerUser.fulfilled, (state, action: PayloadAction<string>) => {
        state.loading = false;
        state.message = action.payload;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { logout, changePage } = authSlice.actions;
export default authSlice.reducer;
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../api/axiosConfig';

// Async action to exchange Plaid's public_token for an access_token
export const exchangePublicToken = createAsyncThunk(
  'plaid/exchangePublicToken',
  async (publicToken, thunkAPI) => {
    try {
      const response = await axiosInstance.post('/plaid/exchange_token', { public_token: publicToken });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const fetchConnectionStatus = createAsyncThunk(
    'plaid/connectionStatus',
    async (_, thunkAPI) => {
        const response = await axiosInstance.get('/plaid/connection_status');
        return response.data;
    }
);

const plaidSlice = createSlice({
  name: 'plaid',
  initialState: {
    accessToken: null,
    connectionStatus: { connected: false, bank_name: null },
    accounts: [],
    transactions: [],
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(exchangePublicToken.fulfilled, (state, action) => {
        state.accessToken = action.payload.access_token;
        state.accounts = action.payload.accounts;
      })
      .addCase(exchangePublicToken.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(fetchConnectionStatus.pending, (state, action) => {
        state.connectionStatus.connected = false;
      })
      .addCase(fetchConnectionStatus.fulfilled, (state, action) => {
        state.connectionStatus = action.payload;
      })
      .addCase(fetchConnectionStatus.rejected, (state, action) => {
        state.connectionStatus.connected = false;
      });
  },
});

export default plaidSlice.reducer;

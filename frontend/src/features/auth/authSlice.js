import {createAsyncThunk, createSlice} from '@reduxjs/toolkit'
import authServices from './authServices';

// let user = JSON.parse(localStorage.getItem('user')) || null;


const initialState = {
    user:null,
    status: 'idle',
    error: null
}

// register
export const register = createAsyncThunk('auth/user', async (user,thunkAPI) => {
    try {
        return await authServices.register(user);
    } catch(err) {
        return thunkAPI.rejectWithValue(err.response.data);
    }
})

export const getUserDetails = createAsyncThunk('auth/info',async (type,thunkAPI) => {
    try {
        return await authServices.getUserDetails(type);
    } catch (err) {
        return thunkAPI.rejectWithValue(err.response.data);
    }
})

export const login = createAsyncThunk('auth/login', async (user,thunkAPI) => {
    try {
        console.log(user);
        return await authServices.login(user.data,user.type);
    } catch(err) {
        return thunkAPI.rejectWithValue(err.response.data);
    }
})

export const logout = createAsyncThunk('auth/logout',async () => {
    return authServices.logout();
})

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        reset: (state) => {
            state.user= null;
            state.status = 'idle';
            state.error=  null   
        },
        refreshToken: (state,action) => {
            console.log(action.payload);
            let token = JSON.parse(localStorage.getItem('token'));
            token.accessToken = action.payload;
            localStorage.setItem('token',JSON.stringify(token));
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(register.pending,state => {
                state.status = 'loading auth'
            })
            .addCase(register.rejected,(state,action) => {
                state.status = 'failed';
                state.error = action.payload;
            })
            .addCase(register.fulfilled,(state,action) => {
                state.status = 'success';
                state.error = null;
            })
            .addCase(login.pending,state => {
                state.status = 'loading auth'
            })
            .addCase(login.rejected,(state,action) => {
                state.status = 'failed';
                state.error = action.payload;
            })
            .addCase(login.fulfilled,(state,action) => {
                state.status = 'success';
                state.error = null;
            })
            .addCase(logout.fulfilled,(state) => {
               state.user = null;
            })
            .addCase(getUserDetails.fulfilled,(state,action) => {
                state.status = 'idle';
                state.error = null;
               state.user = action.payload;
            })
            .addCase(getUserDetails.rejected,(state,action) => {
                state.status = 'failed';
               state.user = null;
               state.error = action.payload;
            })
            .addCase(getUserDetails.pending,(state) => {
               state.status = 'loading';
            })
    }
})

export const {reset, refreshToken} = authSlice.actions;

export default authSlice.reducer;




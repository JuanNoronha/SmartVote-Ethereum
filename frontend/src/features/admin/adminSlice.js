import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { adminServices } from "./adminServices";

const initialState = {
    committee: null,
    candidate: null,
    voter: null,
    imageUrl: null,
    ack: {type: null,msg: null},
}

export const getAddressCheck = createAsyncThunk('fetch/address',async (address,thunkAPI) => {
    try {
        return await adminServices.getAddressCheck(address);
    } catch (err) {
        return thunkAPI.rejectWithValue(err.response.data);
    }
})

export const modifyCsv = createAsyncThunk('fetch/csv',async (file,thunkAPI) => {
    try {
        console.log(file);
        return await adminServices.getObjectFromCSV(file);
    } catch(err) {
        return thunkAPI.rejectWithValue(err.response.data);
    }
})

export const uploadImage = createAsyncThunk('upload/image',async(file,thunkAPI) => {
    try{
        console.log(file);
        return await adminServices.getImageUpload(file);
    } catch(err) {
        return thunkAPI.rejectWithValue(err.response.data);
    }
})

export  const getVoters = createAsyncThunk('get/voter',async(contract,thunkAPI) => {
    try {
        console.log(contract);
        return await adminServices.getVoters(contract);
    } catch (err) {
        return thunkAPI.rejectWithValue(err.response.data);
    }
})

export const addVoters = createAsyncThunk('add/voter',async(voters,thunkAPI) => {
    try{
        console.log(voters);
        return await adminServices.addVoters(voters);
    } catch(err) {
        return thunkAPI.rejectWithValue(err.response.data);
    }
})

export const setAddress = createAsyncThunk('add/admin/address',async(details,thunkAPI) => {
    try {
        return await adminServices.addAddress(details);
    } catch(err) {
        return thunkAPI.rejectWithValue(err.response.data);
    }
})

export const sentMail = createAsyncThunk('sent/email',async (data,thunkAPI) => {
    try {
        return await adminServices.sentEmail(data.details,data.result);
    } catch(err) {
        return thunkAPI.rejectWithValue(err.response.data);
    }
})

export const adminSlice = createSlice({
    name: "admin",
    initialState,
    reducers: {
        setDetails: (state,action) => {
            state.committee= action.payload.committee;
            state.candidate= action.payload.candidate;
            state.ack.type = "success";
            state.ack.msg = "All details added";
        },
        setVoter: (state,action) => {
            state.voter.data = null;
            state.voter.data = action.payload;
            state.ack.type="success";
            state.ack.msg = "Voters Added";
        }
    },

    extraReducers: (builder) => {
        builder.addCase(modifyCsv.fulfilled,(state,action) => {
            state.voter = action.payload;
            state.ack.type="success";
            state.ack.msg = "Voters added";
        });
        builder.addCase(modifyCsv.rejected,(state,action) => {
            state.voter = null;
            state.ack.type="error";
            state.ack.msg = action.payload;
        });
        builder.addCase(uploadImage.fulfilled,(state,action) => {
            state.imageUrl = action.payload;
            state.ack.type=null;
            state.ack.msg = null;
        });
        builder.addCase(uploadImage.rejected,(state,action) => {
            state.imageUrl = null;
            state.ack.type="error";
            state.ack.msg = action.payload;
        });
        builder.addCase(addVoters.fulfilled,(state,action) => {
            state.ack.type="success";
            state.ack.msg = action.payload;
        });
        builder.addCase(addVoters.rejected,(state,action) => {
            state.imageUrl = null;
            state.ack.type="error";
            state.ack.msg = action.payload;
        });
        builder.addCase(setAddress.fulfilled,(state,action) => {
            state.ack.type="success";
            state.ack.msg = action.payload;
        });
        builder.addCase(setAddress.rejected,(state,action) => {
            state.imageUrl = null;
            state.ack.type="error";
            state.ack.msg = action.payload;
        });
        builder.addCase(sentMail.fulfilled,(state,action) => {
            state.ack.type="success";
            state.ack.msg = action.payload;
        });
        builder.addCase(sentMail.rejected,(state,action) => {
            state.imageUrl = null;
            state.ack.type="error";
            state.ack.msg = action.payload;
        });
        builder.addCase(getVoters.fulfilled,(state,action) => {
            state.ack.type="success";
            state.ack.msg = "voters loaded";
            state.voter = action.payload;
        });
        builder.addCase(getVoters.rejected,(state,action) => {
            state.voter = null;
            state.ack.type="error";
            state.ack.msg = action.payload;
        });
        builder.addCase(getVoters.pending,(state,action) => {
            state.voter = null;
            state.ack.type="loading";
        });
        builder.addCase(getAddressCheck.fulfilled,(state,action) => {
            state.ack.type="success";
            state.ack.msg = action.payload.msg;
        });
        builder.addCase(getAddressCheck.rejected,(state,action) => {
            state.ack.type="error";
            state.ack.msg = action.payload;
        });
    }
})


export const {setDetails,setVoter} = adminSlice.actions;
export default adminSlice.reducer;
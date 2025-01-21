import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { contractServices } from "./contractServices";

const initialState = {
    account: null,
    loading: false,
    contracts: {
        deployed: false,
        contract: {
            address: null,
            contractAddress:null,
            abi: null,
            abiContract: null,
        },
        errors: null
    },
}

export const getContract = createAsyncThunk('fetch/contract',async(details,thunkAPI) => {
    try {
        return await contractServices.deployContract(details);
    } catch(error) {
        return thunkAPI.rejectWithValue(error);
    }
})



export const contractSlice = createSlice({
    name: 'contract',
    initialState,
    reducers: {
        setAccount: (state,action) => {
            state.account = action.payload;
        },
        setAccountLoaded: (state,action) => {
            state.loading = action.payload;
        },
        setContractAddress: (state,action) => {
            state.contracts.contract.contractAddress = action.payload;
        },
        resetContract : (state) => {
            state.contracts.deployed == false;
            state.contracts.contract.address = null;
            state.contracts.errors = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(getContract.fulfilled,(state,action) => {
                state.contracts.contract = {...state.contracts.contract,...action.payload};
                state.contracts.deployed = (action.payload.address ? true : false);
                state.contracts.errors = null;
            })
            .addCase(getContract.rejected,(state,action) => {
                state.contracts.errors = action.payload;
            })
    }
})

export const { setAccount,setContractAddress,setAccountLoaded ,resetContract} = contractSlice.actions;

export default contractSlice.reducer;
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import contractReducer from "../features/contract/contractSlice"
import adminReducer from "../features/admin/adminSlice"

export const store = configureStore({
   reducer: {
    auth: authReducer,
    contract: contractReducer,
    admin: adminReducer
   }
})
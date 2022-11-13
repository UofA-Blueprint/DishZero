import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/userSlice";


export default configureStore({
    reducer: {
        auth: authReducer,
    },
});


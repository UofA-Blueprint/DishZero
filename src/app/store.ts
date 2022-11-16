import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/userSlice";

// The main state (or store) of the redux app

export default configureStore({
    reducer: {
        auth: authReducer,
    },
});


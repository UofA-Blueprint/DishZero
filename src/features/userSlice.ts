import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    userEmail: null,
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setActiveUser(state, action) {
            state.userEmail = action.payload.userEmail;
        },
        setLogOutState(state) {
            state.userEmail = null;
        }
    }
});

export const { setActiveUser, setLogOutState } = authSlice.actions;


export const selectUserEmail = (state: any) => state.auth.userEmail;

export default authSlice.reducer;

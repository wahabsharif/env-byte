import { createSlice } from "@reduxjs/toolkit";

// Utility function to check if running in the client-side (browser)
const isBrowser = typeof window !== "undefined";

// Initialize state
const initialState = {
    user: isBrowser && sessionStorage.getItem("userInfo")
        ? JSON.parse(sessionStorage.getItem("userInfo")!)
        : null,
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setCredentials: (state, action) => {
            state.user = action.payload;
            if (isBrowser) {
                sessionStorage.setItem("userInfo", JSON.stringify(action.payload));
                sessionStorage.setItem("token", action.payload.token);
            }
        },
        logout: (state) => {
            state.user = null;
            if (isBrowser) {
                sessionStorage.removeItem("userInfo");
                sessionStorage.removeItem("token");
            }
        },
    },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;

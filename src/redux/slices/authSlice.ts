import { createSlice } from "@reduxjs/toolkit";

const isBrowser = typeof window !== "undefined";

const initialState = {
  user:
    isBrowser && sessionStorage.getItem("userInfo")
      ? JSON.parse(sessionStorage.getItem("userInfo")!)
      : null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      const { first_name, last_name, role, token } = action.payload;

      state.user = { first_name, last_name, role, token };

      if (isBrowser) {
        sessionStorage.setItem(
          "userInfo",
          JSON.stringify({ first_name, last_name, role })
        );
        sessionStorage.setItem("token", token);
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

import { configureStore } from "@reduxjs/toolkit";
import userReducer from "../services/UserSlice";
import visitingLogReducer from "../services/VisitingLogSlice";

const store = configureStore({
  reducer: {
    user: userReducer,
    visitingLogs: visitingLogReducer,
  },
});

export default store;

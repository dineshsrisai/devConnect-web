import { configureStore } from "@reduxjs/toolkit";
import userReducer from "../utils/userSlice";
import feedReducer from "../utils/feedSlice";
import connectionReducer from "../utils/connections";
import requestsReducer from "../utils/requests";

const appStore = configureStore({
  reducer: {
    user: userReducer,
    feed: feedReducer,
    connection: connectionReducer,
    requests: requestsReducer,
  },
});
export default appStore;

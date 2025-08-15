import { configureStore } from "@reduxjs/toolkit";
import movieReducer from "./movie.slice";
import authReducer from "./auth.slice";

const store = configureStore({
  reducer: {
    movie: movieReducer,
    auth: authReducer,
  },
});
export default store;

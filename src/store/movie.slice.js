import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentPage: 1,
  movie: [],
};

const movieSlice = createSlice({
  name: "movie",
  initialState,
  reducers: {
    setCurrentPage(state, action) {
      state.currentPage = action.payload;
    },
    setMovie(state, action) {
      state.movie = action.payload;
    },
  },
});

export const { setCurrentPage, setMovie } = movieSlice.actions;
export default movieSlice.reducer;

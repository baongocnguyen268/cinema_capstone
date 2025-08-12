import { useQuery } from "@tanstack/react-query";
import { getMovieListApi } from "../../../services/movie.api";
import { Link } from "react-router-dom";
import { useState } from "react";
import { setCurrentPage, setMovie } from "../../../store/movie.slice";
import { useSelector, useDispatch } from "react-redux";
import { paginate } from "../../../utils/pagination";

export default function MovieListPage() {
  const dispatch = useDispatch();
  const currentPage = useSelector((state) => state.movie.currentPage);
  const itemsPerPage = 12;
  const {
    data: movie,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["movie-list"],
    queryFn: () => getMovieListApi("GP01", currentPage, itemsPerPage),
  });

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Something went wrong!</p>;
  const handlePageChange = (page) => dispatch(setCurrentPage(page));

  const displayedMovies = Array.isArray(movie)
    ? paginate(movie, currentPage, itemsPerPage)
    : [];
  return (
    <div className="p-4 bg-black min-h-screen text-white">
      <div className="flex items-center justify-center mb-8">
        <div className="flex-grow border-t border-gray-300 dark:border-gray-600 mx-4" />
        <h1 className="text-center text-3xl font-extrabold text-gray-900 dark:text-white md:text-5xl lg:text-6xl">
          <span className="text-transparent bg-clip-text bg-gradient-to-r to-purple-600 from-pink-400">
            All Movie
          </span>
        </h1>
        <div className="flex-grow border-t border-gray-300 dark:border-gray-600 mx-4" />
      </div>

      <div
        key={movie.maPhim}
        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
      >
        {displayedMovies.map((movie) => (
          <div
            key={movie.maPhim}
            className="bg-gray-800 rounded-md overflow-hidden"
          >
            <img
              src={movie.hinhAnh}
              alt={movie.tenPhim}
              className="w-full h-64 object-cover"
            />
            <div className="p-2">
              <h2 className="text-lg font-semibold">{movie.tenPhim}</h2>
              <p className="text-sm text-gray-400">
                {movie.moTa
                  ? movie.moTa.length > 100
                    ? movie.moTa.slice(0, 100) + "..."
                    : movie.moTa
                  : "No description"}
              </p>
              <Link
                to={`/movie-details/${movie.maPhim}`}
                className="text-pink-400 text-sm hover:underline block mt-1"
              >
                View Details
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <nav className="mt-8 flex justify-center space-x-2">
        {[1, 2, 3, 4, 5].map((page) => (
          <button
            key={page}
            onClick={() => handlePageChange(page)}
            className={`px-3 py-1 rounded ${
              currentPage === page
                ? "bg-pink-500 text-white"
                : "bg-gray-700 text-gray-300 hover:bg-gray-600"
            }`}
          >
            {page}
          </button>
        ))}
      </nav>
    </div>
  );
}

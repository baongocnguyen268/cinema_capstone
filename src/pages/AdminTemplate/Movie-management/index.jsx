import React from "react";
import { useQuery } from "@tanstack/react-query";
import { getMovieListApi } from "../../../services/movie.api";
import { useSelector, useDispatch } from "react-redux";
import { setCurrentPage } from "../../../store/movie.slice";
import { paginate } from "../../../utils/pagination";
import { useNavigate } from "react-router-dom";

export default function MovieManagement() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const currentPage = useSelector((state) => state.movie.currentPage) || 1;
  const itemsPerPage = 12;
  const handleAddMovie = () => {
    navigate("/admin/movies-management/add-movie");
  };

  const handlePageChange = (page) => dispatch(setCurrentPage(page));
  const {
    data: allMovies = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["movies", "GP01"],
    queryFn: () => getMovieListApi("GP01", currentPage, itemsPerPage),
  });
  const pagedMovies = paginate(allMovies, currentPage, itemsPerPage);
  const totalPages = Math.max(
    1,
    Math.ceil((allMovies?.length || 0) / itemsPerPage)
  );

  return (
    <div className="p-6 bg-gray-950 min-h-screen text-white">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Quản lý phim</h1>
        <button
          onClick={handleAddMovie}
          className="bg-pink-500 hover:bg-pink-600 text-white font-medium px-4 py-2 rounded-lg"
        >
          + Add Movie
        </button>
      </div>
      {isError && (
        <div className="mt-4 text-sm text-rose-400">Failed to load movies.</div>
      )}

      <table className="min-w-full border border-gray-800 rounded-lg overflow-hidden">
        <thead className="bg-gray-800 text-gray-300">
          <tr>
            <th className="px-4 py-3 text-left">#</th>
            <th className="px-4 py-3 text-left">Title</th>
            <th className="px-4 py-3 text-left">Image</th>
            <th className="px-4 py-3 text-left">Release Date</th>
            <th className="px-4 py-3 text-left">Status</th>
            <th className="px-4 py-3 text-right">Actions</th>
          </tr>
        </thead>

        {isLoading ? (
          <tbody className="divide-y divide-gray-800">
            {Array.from({ length: 5 }).map((_, i) => (
              <tr key={i}>
                <td className="px-4 py-3">
                  <div className="w-6 h-4 bg-gray-800 rounded animate-pulse" />
                </td>
                <td className="px-4 py-3">
                  <div className="w-32 h-4 bg-gray-800 rounded animate-pulse" />
                </td>
                <td className="px-4 py-3">
                  <div className="w-16 h-24 bg-gray-800 rounded animate-pulse" />
                </td>
                <td className="px-4 py-3">
                  <div className="w-24 h-4 bg-gray-800 rounded animate-pulse" />
                </td>
                <td className="px-4 py-3">
                  <div className="w-20 h-4 bg-gray-800 rounded animate-pulse" />
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="w-16 h-6 bg-gray-800 rounded animate-pulse inline-block mr-2" />
                  <div className="w-16 h-6 bg-gray-800 rounded animate-pulse inline-block" />
                </td>
              </tr>
            ))}
          </tbody>
        ) : (
          <tbody className="divide-y divide-gray-800">
            {pagedMovies.map((movie, index) => (
              <tr key={movie.maPhim}>
                <td className="px-4 py-3">
                  {(currentPage - 1) * itemsPerPage + index + 1}
                </td>
                <td className="px-4 py-3">{movie.tenPhim}</td>
                <td className="px-4 py-3">
                  <img
                    src={movie.hinhAnh}
                    alt={movie.tenPhim}
                    className="w-16 h-24 object-cover rounded"
                  />
                </td>
                <td className="px-4 py-3">{movie.ngayKhoiChieu}</td>
                <td className="px-4 py-3">
                  {movie.dangChieu ? "Đang chiếu" : "Sắp chiếu"}
                </td>
                <td className="px-4 py-3 text-right">
                  <button className="px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded text-sm mb-2">
                    Edit
                  </button>
                  <button className="px-3 py-1 bg-red-600 hover:bg-red-700 rounded text-sm ml-2">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {pagedMovies.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-6 text-center text-gray-400">
                  No movies found.
                </td>
              </tr>
            )}
          </tbody>
        )}
      </table>

      {/* Pagination */}
      <nav className="mt-8 flex justify-center space-x-2">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
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

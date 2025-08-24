import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getMovieListApi } from "../../../services/movie.api";
import { useSelector, useDispatch } from "react-redux";
import { setCurrentPage } from "../../../store/movie.slice";
import { paginate } from "../../../utils/pagination";
import { useNavigate } from "react-router-dom";
import { deleteMovieApi, updateMovieApi } from "../../../services/movie.api";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { format } from "date-fns";

export default function MovieManagement() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const currentPage = useSelector((state) => state.movie.currentPage) || 1;
  const itemsPerPage = 12;
  const queryClient = useQueryClient();
  const [editOpen, setEditOpen] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const { mutate: updateMovie, isPending: isUpdating } = useMutation({
    mutationFn: (formData) => updateMovieApi(formData),
    onSuccess: () => {
      setEditOpen(false);
      setSelectedMovie(null);
      alert("Movie updated successfully");
      queryClient.invalidateQueries({ queryKey: ["movies", "GP01"] });
    },
    onError: (error) => {
      console.log("🚀 ~ updateMovie error:", error?.response || error);
      alert(
        error?.response?.data?.content ||
          error?.response?.data?.message ||
          "Failed to update movie"
      );
    },
  });

  const openEdit = (movie) => {
    setSelectedMovie(movie);
    setEditOpen(true);
  };
  const handleEditMovie = (e) => {
    e.preventDefault();
    if (!selectedMovie) return;

    const form = new FormData(e.currentTarget);

    const tenPhim =
      form.get("tenPhim")?.toString().trim() || selectedMovie.tenPhim;
    const ngayKhoiChieuRaw = form.get("ngayKhoiChieu")?.toString().trim() || "";
    const ngayKhoiChieu = ngayKhoiChieuRaw
      ? format(new Date(ngayKhoiChieuRaw), "dd/MM/yyyy")
      : selectedMovie.ngayKhoiChieu;

    const trangThai = form.get("trangThai")?.toString();
    const dangChieu = trangThai
      ? trangThai === "dangChieu"
      : !!selectedMovie.dangChieu;
    const sapChieu = !dangChieu;

    const trailer =
      form.get("trailer")?.toString().trim() || selectedMovie.trailer || "";
    const moTa =
      form.get("moTa")?.toString().trim() || selectedMovie.moTa || "";
    const danhGia = Number(form.get("danhGia") ?? selectedMovie.danhGia ?? 0);
    const hot = !!form.get("hot") || !!selectedMovie.hot;

    const file = form.get("hinhAnh");

    const fd = new FormData();
    fd.append("maPhim", String(selectedMovie.maPhim));
    fd.append("tenPhim", tenPhim);
    fd.append("biDanh", selectedMovie.biDanh || tenPhim);
    fd.append("trailer", trailer);
    fd.append("moTa", moTa);
    fd.append("ngayKhoiChieu", ngayKhoiChieu);
    fd.append("danhGia", String(danhGia));
    fd.append("hot", String(hot));
    fd.append("dangChieu", String(dangChieu));
    fd.append("sapChieu", String(sapChieu));
    fd.append("maNhom", "GP01");

    // Important: if new file, append it; else send back the existing image as a string
    if (file && file instanceof File && file.size > 0) {
      fd.append("hinhAnh", file);
    } else if (selectedMovie.hinhAnh) {
      fd.append("hinhAnh", selectedMovie.hinhAnh);
    }

    updateMovie({ type: "upload", body: fd });
  };

  const closeEdit = () => {
    setEditOpen(false);
    setSelectedMovie(null);
  };
  const { mutate: deleteMovie, isPending: isDeleting } = useMutation({
    mutationFn: (maPhim) => deleteMovieApi(maPhim),
    onSuccess: () => {
      alert("Movie deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["movies", "GP01"] });
    },
    onError: (error) => {
      console.log("🚀 ~ deleteMovie ~ error:", error);
      alert("Failed to delete movie");
    },
  });

  const handleDeleteMovie = (maPhim, tenPhim) => {
    if (!maPhim) return;
    if (!window.confirm(`Are you sure you want to delete ${tenPhim}?`)) {
      return;
    }
    deleteMovie(maPhim);
  };
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
                  <button
                    className="px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded text-sm mb-2"
                    onClick={() => openEdit(movie)}
                  >
                    Edit
                  </button>
                  <button
                    className="px-3 py-1 bg-red-600 hover:bg-red-700 rounded text-sm ml-2"
                    onClick={() =>
                      handleDeleteMovie(movie.maPhim, movie.tenPhim)
                    }
                    disabled={isDeleting}
                  >
                    {isDeleting ? "Deleting..." : "Delete"}
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
      {/* Edit Movie Modal */}
      {editOpen && selectedMovie && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/60" onClick={closeEdit} />
          <div className="relative z-10 w-full max-w-3xl rounded-2xl border border-gray-800 bg-gray-900 p-6 shadow-xl overflow-y-auto max-h-[90vh]">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-600">
                Edit Movie
              </h3>
              <button
                onClick={closeEdit}
                className="px-2 py-1 rounded hover:bg-gray-800"
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleEditMovie} className="space-y-4">
              {/* Title */}
              <div>
                <label className="block text-sm text-gray-300 mb-1">
                  Title
                </label>
                <input
                  name="tenPhim"
                  defaultValue={selectedMovie.tenPhim}
                  className="w-full rounded-lg bg-gray-800 border border-gray-700 px-3 py-2"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm text-gray-300 mb-1">
                  Description
                </label>
                <textarea
                  name="moTa"
                  defaultValue={selectedMovie.moTa}
                  className="w-full rounded-lg bg-gray-800 border border-gray-700 px-3 py-2"
                />
              </div>

              {/* Trailer */}
              <div>
                <label className="block text-sm text-gray-300 mb-1">
                  Trailer URL
                </label>
                <input
                  name="trailer"
                  defaultValue={selectedMovie.trailer}
                  className="w-full rounded-lg bg-gray-800 border border-gray-700 px-3 py-2"
                />
              </div>

              {/* Review */}
              <div>
                <label className="block text-sm text-gray-300 mb-1">
                  Review (0–10)
                </label>
                <input
                  name="danhGia"
                  type="number"
                  min="0"
                  max="10"
                  defaultValue={selectedMovie.danhGia}
                  className="w-full rounded-lg bg-gray-800 border border-gray-700 px-3 py-2"
                />
              </div>

              {/* Release Date */}
              <div>
                <label className="block text-sm text-gray-300 mb-1">
                  Release Date
                </label>
                <input
                  name="ngayKhoiChieu"
                  type="date"
                  defaultValue={
                    selectedMovie?.ngayKhoiChieu
                      ? format(
                          selectedMovie.ngayKhoiChieu.includes("/")
                            ? parse(
                                selectedMovie.ngayKhoiChieu,
                                "dd/MM/yyyy",
                                new Date()
                              )
                            : new Date(selectedMovie.ngayKhoiChieu),
                          "yyyy-MM-dd"
                        )
                      : ""
                  }
                  className="w-full rounded-lg bg-gray-800 border border-gray-700 px-3 py-2"
                />
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm text-gray-300 mb-1">
                  Status
                </label>
                <div className="flex gap-4">
                  <label className="inline-flex items-center gap-2">
                    <input
                      type="radio"
                      name="trangThai"
                      value="dangChieu"
                      defaultChecked={selectedMovie.dangChieu}
                      className="h-4 w-4"
                    />
                    <span className="text-sm">Now Showing</span>
                  </label>
                  <label className="inline-flex items-center gap-2">
                    <input
                      type="radio"
                      name="trangThai"
                      value="sapChieu"
                      defaultChecked={selectedMovie.sapChieu}
                      className="h-4 w-4"
                    />
                    <span className="text-sm">Coming Soon</span>
                  </label>
                </div>
              </div>

              {/* Hot checkbox */}
              <label className="inline-flex items-center gap-2">
                <input
                  type="checkbox"
                  name="hot"
                  defaultChecked={selectedMovie.hot}
                  className="h-4 w-4"
                />
                <span className="text-sm text-gray-300">Hot Movie</span>
              </label>

              {/* Image */}
              <div>
                <label className="block text-sm text-gray-300 mb-1">
                  Image
                </label>
                {selectedMovie.hinhAnh && (
                  <img
                    src={selectedMovie.hinhAnh}
                    alt={selectedMovie.tenPhim}
                    className="w-32 h-48 object-cover rounded mb-2"
                  />
                )}
                <input
                  type="file"
                  name="hinhAnh"
                  accept=".png,.jpg,.jpeg"
                  className="block text-sm text-gray-400"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={closeEdit}
                  className="px-3 py-2 rounded-lg border border-gray-700 hover:bg-gray-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="px-4 py-2 rounded-lg bg-pink-500 hover:bg-pink-600 font-medium disabled:opacity-50"
                >
                  {isUpdating ? "Saving..." : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

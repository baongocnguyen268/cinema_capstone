import { useQuery } from "@tanstack/react-query";
import {
  getMovieListApi,
  getMovieShowtimesApi,
} from "../../../services/movie.api";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { setCurrentPage } from "../../../store/movie.slice";
import { paginate } from "../../../utils/pagination";
import { useState } from "react";

export default function MovieListPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const currentPage = useSelector((state) => state.movie.currentPage);
  const isLoggedIn = useSelector((state) => !!state?.auth?.user?.accessToken);

  const itemsPerPage = 12;

  const {
    data: movie,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["movie-list", currentPage, itemsPerPage],
    queryFn: () => getMovieListApi("GP01", currentPage, itemsPerPage),
  });

  const [busyId, setBusyId] = useState(null);

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Something went wrong!</p>;

  const handlePageChange = (page) => dispatch(setCurrentPage(page));

  const displayedMovies = Array.isArray(movie)
    ? paginate(movie, currentPage, itemsPerPage)
    : [];

  const handleBuy = async (maPhim) => {
    try {
      setBusyId(maPhim);
      // fetch first available schedule for this movie
      const showtimes = await getMovieShowtimesApi(maPhim);
      const firstSchedule =
        showtimes?.heThongRapChieu?.[0]?.cumRapChieu?.[0]?.lichChieuPhim?.[0];

      if (!firstSchedule?.maLichChieu) {
        alert("No showtimes available for this movie yet.");
        return;
      }

      const to = `/buy-tickets/${firstSchedule.maLichChieu}`;
      if (!isLoggedIn) {
        navigate(`/login?from=${encodeURIComponent(to)}`, {
          state: { from: to },
        });
      } else {
        navigate(to);
      }
    } catch (e) {
      console.error("BuyTicket error:", e);
      alert("Unable to load showtimes. Please try again.");
    } finally {
      setBusyId(null);
    }
  };

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
        key={movie?.maPhim}
        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
      >
        {displayedMovies.map((movie) => (
          <div
            key={movie.maPhim}
            className="bg-gray-800 rounded-md overflow-hidden flex flex-col"
          >
            <img
              src={movie.hinhAnh}
              alt={movie.tenPhim}
              className="w-full h-64 object-cover"
              loading="lazy"
            />
            <div className="p-2 flex-1">
              <h2 className="text-lg font-semibold">{movie.tenPhim}</h2>
              <p className="text-sm text-gray-400">
                {movie.moTa
                  ? movie.moTa.length > 100
                    ? movie.moTa.slice(0, 100) + "..."
                    : movie.moTa
                  : "No description"}
              </p>
            </div>

            {/* Actions */}
            <div className="p-2 flex gap-2">
              <Link
                to={`/movie-details/${movie.maPhim}`}
                className="flex-1 text-center bg-gray-700 hover:bg-gray-600 text-white px-3 py-2 rounded text-sm font-semibold"
              >
                Details
              </Link>
              <button
                type="button"
                onClick={() => handleBuy(movie.maPhim)}
                disabled={busyId === movie.maPhim}
                className={`flex-1 text-center px-3 py-2 rounded text-sm font-semibold ${
                  busyId === movie.maPhim
                    ? "bg-gray-600 cursor-wait"
                    : "bg-pink-500 hover:bg-pink-600 text-white"
                }`}
              >
                {busyId === movie.maPhim ? "Loading..." : "Buy Ticket"}
              </button>
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

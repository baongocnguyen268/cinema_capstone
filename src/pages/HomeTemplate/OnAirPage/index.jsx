import { Link, useNavigate } from "react-router-dom";
import { setCurrentPage } from "../../../store/movie.slice";
import { useSelector, useDispatch } from "react-redux";
import { paginate } from "../../../utils/pagination";
import { useOnAirWithShowtimes } from "../../../hooks/onAirShowtimesHook";

export default function OnAir() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const currentPage = useSelector((state) => state.movie.currentPage);
  const isLoggedIn = useSelector((state) => !!state?.auth?.user?.accessToken);

  const itemsPerPage = 8;

  const { data: movies, isLoading, isError } = useOnAirWithShowtimes("GP01");

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Something went wrong!</p>;

  const handlePageChange = (page) => dispatch(setCurrentPage(page));

  const displayedMovies = Array.isArray(movies)
    ? paginate(movies, currentPage, itemsPerPage)
    : [];

  const handleBuy = (maLichChieu) => {
    if (!maLichChieu) return;
    if (!isLoggedIn) {
      navigate("/login", { state: { from: `/buy-tickets/${maLichChieu}` } });
    } else {
      navigate(`/buy-tickets/${maLichChieu}`);
    }
  };

  return (
    <div className="bg-black text-white min-h-screen p-4">
      {/* Title */}
      <div className="flex items-center justify-center mb-8">
        <div className="flex-grow border-t border-gray-600 mx-4" />
        <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-600">
          On Air Movies
        </h1>
        <div className="flex-grow border-t border-gray-600 mx-4" />
      </div>

      {/* Movie Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
        {displayedMovies.map((movie) => (
          <div
            key={movie.maPhim}
            className="bg-gray-800 rounded-lg overflow-hidden hover:scale-105 transition-transform duration-300 flex flex-col"
          >
            <img
              src={movie.hinhAnh}
              alt={movie.tenPhim}
              className="w-full h-64 object-cover"
            />
            <div className="p-3 flex-1">
              <h2 className="text-lg font-semibold">{movie.tenPhim}</h2>
              <p className="text-sm text-gray-400">
                {movie.moTa
                  ? movie.moTa.slice(0, 100) + "..."
                  : "Coming Soon Description"}
              </p>
            </div>
            <div className="p-3 flex gap-2">
              <Link
                to={`/movie-details/${movie.maPhim}`}
                className="flex-1 text-center bg-gray-700 hover:bg-gray-600 text-white px-3 py-2 rounded text-sm font-semibold"
              >
                Details
              </Link>

              {movie.maLichChieu ? (
                <button
                  onClick={() => handleBuy(movie.maLichChieu)}
                  className="flex-1 text-center bg-pink-500 hover:bg-pink-600 text-white px-3 py-2 rounded text-sm font-semibold"
                  type="button"
                >
                  Buy Ticket
                </button>
              ) : (
                <button
                  disabled
                  className="flex-1 text-center bg-gray-700 border border-gray-600 text-gray-300 px-3 py-2 rounded text-sm font-semibold opacity-50 cursor-not-allowed"
                  type="button"
                >
                  No Showtimes
                </button>
              )}
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

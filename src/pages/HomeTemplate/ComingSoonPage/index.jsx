import { useQuery } from "@tanstack/react-query";
import { getComingSoonApi } from "../../../services/movie.api";
import { Link } from "react-router-dom";
import { setCurrentPage, setMovie } from "../../../store/movie.slice";
import { useSelector, useDispatch } from "react-redux";
import { paginate } from "../../../utils/pagination";
export default function ComingSoon() {
  const dispatch = useDispatch();
  const {
    data: movie,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["coming-soon"],
    queryFn: () => getComingSoonApi("GP01", currentPage, itemsPerPage),
  });
  const currentPage = useSelector((state) => state.movie.currentPage);
  const itemsPerPage = 8;
  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Something went wrong!</p>;
  const handlePageChange = (page) => dispatch(setCurrentPage(page));

  const displayedMovies = Array.isArray(movie)
    ? paginate(movie, currentPage, itemsPerPage)
    : [];
  return (
    <div className="bg-black text-white min-h-screen p-4">
      {/* Title */}
      <div className="flex items-center justify-center mb-8">
        <div className="flex-grow border-t border-gray-600 mx-4" />
        <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-600">
          Coming Soon
        </h1>
        <div className="flex-grow border-t border-gray-600 mx-4" />
      </div>

      {/* Movie Grid Layout */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
        {displayedMovies?.map((movie) => (
          <Link
            to={`/movie-details/${movie.maPhim}`}
            key={movie.maPhim}
            className="bg-gray-800 rounded-lg overflow-hidden hover:scale-105 transition-transform duration-300"
          >
            <img
              src={movie.hinhAnh}
              alt={movie.tenPhim}
              className="w-full h-64 object-cover"
            />
            <div className="p-3">
              <h2 className="text-lg font-semibold">{movie.tenPhim}</h2>
              <p className="text-sm text-gray-400">
                {movie.moTa
                  ? movie.moTa.slice(0, 100) + "..."
                  : "Coming Soon Description"}
              </p>
            </div>
          </Link>
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

import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getMovieDetailsApi } from "../../../services/movie.api";
import { useState } from "react";
import { format } from "date-fns";

export default function MovieDetails() {
  const { movieId } = useParams();
  const {
    data: movie,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["movie-details", movieId],
    queryFn: () => getMovieDetailsApi(movieId),
    enabled: !!movieId,
  });
  const [activeTab, setActiveTab] = useState("trailer");

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Something went wrong!</p>;
  return (
    <div className="bg-black text-pink-500 min-h-screen p-4">
      <div className="flex flex-col md:flex-row gap-6 max-w-6xl mx-auto">
        {/* Poster */}
        <img
          src={movie?.hinhAnh}
          alt={movie?.biDanh}
          className="w-[300px] h-[450px] object-cover rounded-lg shadow-lg"
        />

        {/* Movie Info */}
        <div className="flex-1">
          <h1 className="text-4xl font-bold">{movie?.tenPhim}</h1>
          <p className="text-yellow-400 mt-1 flex  items-center gap-2">
            {movie?.danhGia}/10
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width={20}
              height={20}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-star-icon lucide-star"
            >
              <path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z" />
            </svg>
          </p>
          <p className="text-sm text-gray-400 mb-4">0 reviews</p>

          {/* Tabs */}
          <div className="flex space-x-4 border-b border-gray-700 mb-4">
            <button
              onClick={() => setActiveTab("trailer")}
              className={`capitalize py-2 px-4 transition duration-200 ${
                activeTab === "trailer"
                  ? "border-b-2  border-pink-500 text-white"
                  : "text-gray-400"
              }`}
            >
              Trailer
            </button>
            <button
              onClick={() => setActiveTab("description")}
              className={`capitalize py-2 px-4 transition duration-200 ${
                activeTab === "description"
                  ? "border-b-2 border-pink-500 text-white"
                  : "text-gray-400"
              }`}
            >
              Description
            </button>
            <button
              onClick={() => setActiveTab("showtimes")}
              className={`capitalize py-2 px-4 transition duration-200 ${
                activeTab === "showtimes"
                  ? "border-b-2 border-pink-500 text-white"
                  : "text-gray-400"
              }`}
            >
              Showtimes
            </button>
          </div>

          {activeTab === "trailer" && (
            <div className="mt-6">
              <h2 className="text-xl font-semibold text-white mb-2">
                Watch Trailer
              </h2>
              {movie?.trailer ? (
                <div className="w-full">
                  <iframe
                    className="w-full rounded-lg"
                    height="480"
                    src={movie?.trailer?.replace("watch?v=", "embed/")}
                    title="Trailer"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
              ) : (
                <p className="text-gray-400">No trailer available.</p>
              )}
            </div>
          )}

          {activeTab === "description" && (
            <div className="mt-6">
              <p className="text-white text-sm leading-relaxed">
                {movie?.moTa || "No description available"}
              </p>
            </div>
          )}

          {activeTab === "showtimes" && (
            <div className="mt-6">
              <h2 className="text-xl font-semibold text-white mb-3">
                Showtimes
              </h2>
              <div className="bg-gray-900 p-4 rounded-lg shadow-md border border-gray-700 w-fit">
                <p className="text-sm text-gray-400">Premiere Date:</p>
                <p className="text-lg font-bold text-pink-400">
                  {movie?.ngayKhoiChieu
                    ? format(movie.ngayKhoiChieu, "dd/MM/yyyy")
                    : "No showtime available"}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

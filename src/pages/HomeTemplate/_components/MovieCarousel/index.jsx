import React from "react";
import { Card } from "flowbite-react";
import { useQuery } from "@tanstack/react-query";
import { getMovieListApi } from "../../../../services/movie.api";
import { Link } from "react-router-dom";

export default function MovieCard() {
  const {
    data: movies = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["movieList", 8],
    queryFn: async () => {
      const fullList = await getMovieListApi("GP01", 1);
      return fullList.slice(0, 8);
    },
  });
  if (isLoading) return <div className="text-white">Loading...</div>;
  if (isError) return <div className="text-red-500">Error loading movies</div>;
  return (
    <div className="bg-black">
      <div className="mt-8 mb-4">
        <div className="flex items-center justify-center">
          <div className="flex-grow border-t border-gray-300 dark:border-gray-600 mx-4" />
          <h1 className="text-center text-3xl font-extrabold text-gray-900 dark:text-white md:text-5xl lg:text-6xl">
            <span className="text-transparent bg-clip-text bg-gradient-to-r to-purple-600 from-pink-400">
              Movie Selection
            </span>
          </h1>
          <div className="flex-grow border-t border-gray-300 dark:border-gray-600 mx-4" />
        </div>
      </div>
      <div className="max-w-screen-xl mx-auto px-2 sm:px-6 md:px-12">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 mt-5">
          {movies.map((movie) => (
            <Link to={`/movie-details/${movie.maPhim}`} key={movie.maPhim}>
              <div
                key={movie.maPhim}
                className="bg-gray-900 text-white rounded-lg shadow-md border border-gray-800 overflow-hidden flex flex-col"
              >
                <img
                  src={movie.hinhAnh}
                  alt={movie.tenPhim}
                  className="w-full h-[500px] object-cover"
                />
                <div className="p-3 flex-1 flex items-end">
                  <h5 className="text-sm font-semibold tracking-tight line-clamp-2">
                    {movie.tenPhim}
                  </h5>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

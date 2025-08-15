import { useQuery } from "@tanstack/react-query";
import { getOnAirApi, getMovieShowtimesApi } from "../services/movie.api";

export const useOnAirWithShowtimes = (maNhom) => {
  return useQuery({
    queryKey: ["on-air", maNhom],
    queryFn: async () => {
      const onAirMovies = await getOnAirApi(maNhom);

      const moviesWithShowtimes = await Promise.all(
        onAirMovies.map(async (movie) => {
          const showtimes = await getMovieShowtimesApi(movie.maPhim);
          const firstSchedule =
            showtimes?.heThongRapChieu?.[0]?.cumRapChieu?.[0]
              ?.lichChieuPhim?.[0];

          return {
            ...movie,
            maLichChieu: firstSchedule?.maLichChieu || null,
          };
        })
      );

      return moviesWithShowtimes;
    },
  });
};

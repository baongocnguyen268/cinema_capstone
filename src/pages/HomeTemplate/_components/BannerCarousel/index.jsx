import React, { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { getBannerApi } from "../../../../services/movie.api";
import { initFlowbite } from "flowbite";
export default function HeroBanner() {
  const {
    data: banners = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["bannerMovies"],
    queryFn: getBannerApi,
  });

  useEffect(() => {
    if (banners.length > 0) {
      initFlowbite();
    }
  }, [banners]);

  if (isLoading)
    return <div className="text-white text-center">Loading banners...</div>;

  if (isError)
    return (
      <div className="text-red-500 text-center">Failed to load banners</div>
    );

  return (
    <div className="bg-black">
      <div
        id="gallery"
        className="relative w-full"
        data-carousel="slide"
        data-carousel-autoplay="true"
        data-carousel-interval="3000"
      >
        {/* Carousel wrapper */}
        <div className="relative w-full h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px] overflow-hidden rounded-lg">
          {banners.map((banner, index) => (
            <div
              key={banner.maBanner}
              className="hidden duration-700 ease-in-out"
              data-carousel-item={index === 0 ? "active" : ""}
            >
              <img
                src={banner.hinhAnh}
                className="w-full h-full object-cover rounded-lg"
                alt={`Banner ${index + 1}`}
              />
            </div>
          ))}
        </div>

        {/* Navigation buttons */}
        <button
          type="button"
          className="absolute top-0 start-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none"
          data-carousel-prev
        >
          <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/30 group-hover:bg-white/50 group-focus:ring-4 group-focus:ring-white">
            <svg
              className="w-4 h-4 text-white rtl:rotate-180"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 6 10"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 1 1 5l4 4"
              />
            </svg>
            <span className="sr-only">Previous</span>
          </span>
        </button>

        <button
          type="button"
          className="absolute top-0 end-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none"
          data-carousel-next
        >
          <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/30 group-hover:bg-white/50 group-focus:ring-4 group-focus:ring-white">
            <svg
              className="w-4 h-4 text-white rtl:rotate-180"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 6 10"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="m1 9 4-4-4-4"
              />
            </svg>
            <span className="sr-only">Next</span>
          </span>
        </button>
      </div>
    </div>
  );
}

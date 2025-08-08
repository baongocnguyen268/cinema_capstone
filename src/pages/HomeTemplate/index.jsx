import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import Navbar from "./_components/Header";
import MovieCard from "./_components/MovieCarousel";
import HeroBanner from "./_components/BannerCarousel";
import Footer from "./_components/Footer";

export default function HomeTemplate() {
  const { pathname } = useLocation();

  const isHome = pathname === "/" || pathname === "";

  return (
    <div className="bg-black">
      <Navbar />
      {isHome && (
        <>
          <HeroBanner />
          <MovieCard />
        </>
      )}
      <Outlet />
      <Footer />
    </div>
  );
}

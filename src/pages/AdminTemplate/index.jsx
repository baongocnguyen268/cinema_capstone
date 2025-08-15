import React from "react";
import { Outlet } from "react-router-dom";
import Header from "./_components/header";
import Sidebar from "./_components/sidebar";

export default function AdminTemplate() {
  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      <Header />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid grid-cols-12 gap-6 py-6">
        {/* left sidebar like your screenshot, but dark */}
        <div className="col-span-12 md:col-span-4 lg:col-span-3 xl:col-span-2">
          <div className="rounded-2xl bg-gray-950">
            <Sidebar />
          </div>
        </div>

        {/* content */}
        <main className="col-span-12 md:col-span-8 lg:col-span-9 xl:col-span-10">
          <div className="rounded-2xl bg-gray-950">
            <div className="rounded-2xl border border-gray-800 bg-gray-950 p-6 min-h-[60vh]">
              <Outlet />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

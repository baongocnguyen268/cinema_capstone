import React from "react";
import { NavLink } from "react-router-dom";

const IconFilm = (p) => (
  <svg
    viewBox="0 0 24 24"
    className={`w-5 h-5 ${p.className || ""}`}
    fill="none"
    stroke="currentColor"
    strokeWidth="1.7"
  >
    <rect x="3" y="4" width="18" height="16" rx="2" />
    <path d="M8 4v16M16 4v16M3 10h18M3 14h18" />
  </svg>
);
const IconUsers = (p) => (
  <svg
    viewBox="0 0 24 24"
    className={`w-5 h-5 ${p.className || ""}`}
    fill="none"
    stroke="currentColor"
    strokeWidth="1.7"
  >
    <circle cx="9" cy="8" r="3" />
    <path d="M15 11a4 4 0 1 1 0-8 4 4 0 0 1 0 8z" />
    <path d="M3 20a6 6 0 1 1 12 0H3zM15 20h6a6 6 0 0 0-6-6" />
  </svg>
);
const IconPopcorn = (p) => (
  <svg
    viewBox="0 0 24 24"
    className={`w-5 h-5 ${p.className || ""}`}
    fill="none"
    stroke="currentColor"
    strokeWidth="1.7"
  >
    <path d="M7 7h10l2 14H5L7 7Z" />
    <path d="M9 7V5a3 3 0 1 1 6 0v2" />
  </svg>
);

const itemColums = ({ isActive }) =>
  `group flex items-center gap-3 rounded-xl px-3 py-2 transition
   ${
     isActive
       ? "bg-gray-900 border border-gray-800 text-white"
       : "text-gray-300 hover:text-white hover:bg-gray-900 border border-transparent"
   }`;

export default function Sidebar() {
  return (
    <aside className="h-[calc(100vh-56px)] overflow-y-auto pr-2">
      <nav className="space-y-2">
        <NavLink to="/admin/movies-management" className={itemColums}>
          <IconFilm className="opacity-80" />
          <span>Quản lý phim</span>
        </NavLink>
        <NavLink to="/admin/users" className={itemColums}>
          <IconUsers className="opacity-80" />
          <span>Quản lý người dùng</span>
        </NavLink>
        <NavLink to="/admin/cinemas" className={itemColums}>
          <IconPopcorn className="opacity-80" />
          <span>Quản lý hệ thống rạp chiếu</span>
        </NavLink>
      </nav>
    </aside>
  );
}

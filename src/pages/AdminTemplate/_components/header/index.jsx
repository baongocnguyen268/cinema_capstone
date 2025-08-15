import React from "react";
import { replace, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { clearUser } from "../../../../store/auth.slice";

export default function Header() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    dispatch(clearUser());
    navigate("/auth", { replace: true });
  };

  return (
    <header className="sticky top-0 z-30 h-14 border-b border-gray-800 bg-gray-950/80 backdrop-blur">
      <div className="mx-auto max-w-7xl h-full px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        <div className="text-transparent text-2xl bg-clip-text bg-gradient-to-r from-pink-400 to-purple-600 font-semibold">
          Admin
        </div>
        <div className="flex items-center gap-4">
          <div className="text-transparent text-2xl bg-clip-text bg-gradient-to-r from-pink-400 to-purple-600 font-semibold">
            Movie Dashboard
          </div>
          <button
            onClick={handleLogout}
            className="bg-pink-500 hover:bg-pink-600 text-white px-3 py-2 rounded-lg text-sm font-bold"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}

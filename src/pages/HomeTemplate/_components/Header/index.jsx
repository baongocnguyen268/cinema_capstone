import { NavLink, useLocation } from "react-router-dom";
import React from "react";
import { clearUser } from "../../../../store/auth.slice";
import { useSelector, useDispatch } from "react-redux";

export default function Navbar() {
  const location = useLocation();
  const isMoviesActive = ["/movie-list", "/coming-soon", "/on-air"].includes(
    location.pathname
  );
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const handleLogout = () => {
    localStorage.removeItem("user");
    dispatch(clearUser());
    Navigate("/");
  };

  return (
    <nav className="bg-black px-6 py-4 flex justify-between items-center border-b border-[#333] z-50 relative">
      <NavLink
        to="/"
        className="text-2xl font-bold text-pink-500 flex items-center gap-1"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-6 h-6"
          viewBox="0 0 24 24"
          fill="url(#galaxyGradient)"
        >
          <defs>
            <linearGradient id="galaxyGradient" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#7F00FF" />
              <stop offset="50%" stopColor="#E100FF" />
              <stop offset="100%" stopColor="#00C9FF" />
            </linearGradient>
          </defs>
          <path d="M8 2a2 2 0 0 1 2 2h4a2 2 0 1 1 4 0h1a1 1 0 0 1 1 1v2H2V5a1 1 0 0 1 1-1h1a2 2 0 1 1 4 0zM3 8h18l-2 13H5L3 8z" />
        </svg>
        CineNova
      </NavLink>

      <ul className="hidden md:flex space-x-6 text-sm items-center">
        <li>
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive ? "text-pink-500" : "text-white hover:text-pink-400"
            }
          >
            Home
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/about"
            className={({ isActive }) =>
              isActive ? "text-pink-500" : "text-white hover:text-pink-400"
            }
          >
            About
          </NavLink>
        </li>

        <li className="relative group">
          <span
            className={`cursor-pointer px-3 py-2 ${
              isMoviesActive ? "text-pink-500" : "text-white"
            } hover:text-pink-400 inline-flex items-center gap-1`}
          >
            Movies
            <svg
              className="w-3 h-3 mt-[1px]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </span>

          <ul className="absolute top-full left-0 hidden group-hover:flex flex-col bg-black border border-gray-700 rounded-md shadow-lg z-50 min-w-[160px] py-1">
            <li>
              <NavLink
                to="/movie-list"
                className={({ isActive }) =>
                  `block px-4 py-2 text-sm ${
                    isActive ? "text-pink-500" : "text-white"
                  } hover:bg-pink-500 hover:text-white`
                }
              >
                All Movies
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/coming-soon"
                className={({ isActive }) =>
                  `block px-4 py-2 text-sm ${
                    isActive ? "text-pink-500" : "text-white"
                  } hover:bg-pink-500 hover:text-white`
                }
              >
                Coming Soon
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/on-air"
                className={({ isActive }) =>
                  `block px-4 py-2 text-sm ${
                    isActive ? "text-pink-500" : "text-white"
                  } hover:bg-pink-500 hover:text-white`
                }
              >
                On Air
              </NavLink>
            </li>
          </ul>
        </li>

        <li>
          <NavLink
            to="/news"
            className={({ isActive }) =>
              isActive ? "text-pink-500" : "text-white hover:text-pink-400"
            }
          >
            News
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/register"
            className={({ isActive }) =>
              isActive ? "text-pink-500" : "text-white hover:text-pink-400"
            }
          >
            Register
          </NavLink>
        </li>
      </ul>

      <div className="flex items-center space-x-2">
        <input
          type="text"
          placeholder="Search..."
          className="px-3 py-1 rounded text-sm bg-gray-800 text-white focus:outline-none"
        />
        <button className="bg-pink-500 hover:bg-pink-600 text-sm px-3 py-1 rounded text-white">
          Search
        </button>
        {!user ? (
          <NavLink to="/login">
            <button className="ml-2 bg-white hover:bg-gray-200 text-sm px-3 py-1 rounded text-black font-semibold">
              Login
            </button>
          </NavLink>
        ) : (
          <button
            onClick={handleLogout}
            className="ml-2 bg-gray-700 hover:bg-gray-600 text-sm px-3 py-1 rounded text-white font-semibold"
          >
            Logout
          </button>
        )}
      </div>
    </nav>
  );
}

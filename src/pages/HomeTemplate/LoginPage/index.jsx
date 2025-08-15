import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Navigate, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { LoginApi } from "../../../services/auth.api";
import { useDispatch } from "react-redux";
import { setUser } from "../../../store/auth.slice";

export default function LoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [values, setValues] = useState({
    taiKhoan: "",
    matKhau: "",
  });
  const { mutate: handleLogin, isPending } = useMutation({
    mutationFn: (valuesHandleLogin) => LoginApi(valuesHandleLogin),
    onSuccess: (user) => {
      if (!user) return;
      localStorage.setItem("token", user.accessToken);
      localStorage.setItem("user", JSON.stringify(user));
      dispatch(setUser(user));
      const isAdmin = user.maLoaiNguoiDung === "QuanTri";
      const redirectPath = isAdmin ? "/admin" : location.state?.from || "/";
      navigate(redirectPath, { replace: true });
    },
    onError: () => {
      alert("Login failed. Please check your credentials.");
    },
  });

  const handleOnChange = (event) => {
    setValues({
      ...values,
      [event.target.name]: event.target.value,
    });
  };
  const handleSubmit = (event) => {
    event.preventDefault();
    handleLogin(values);
  };

  const LoggedUser = (() => {
    try {
      return JSON.parse(localStorage.getItem("user"));
    } catch {
      return null;
    }
  })();

  if (LoggedUser) {
    const from = location.state?.from;
    if (from) return <Navigate to={from} replace />;
    if (LoggedUser.maLoaiNguoiDung === "QuanTri") {
      return <Navigate to="/admin/dashboard" replace />;
    }
    return <Navigate to="/" replace />;
  }
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-gray-900 border border-gray-800 rounded-2xl shadow-xl p-6">
        {/* Title */}
        <h1 className="text-3xl font-bold text-center mb-2 text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-600">
          Welcome back
        </h1>
        <p className="text-center text-gray-400 mb-6">
          Login to continue to{" "}
          <span className="text-pink-400 font-semibold">CineNova</span>
        </p>

        {/* Form */}
        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* Username */}
          <div>
            <label className="block text-sm text-gray-300 mb-1">Username</label>
            <input
              name="taiKhoan"
              onChange={handleOnChange}
              type="text"
              className="w-full rounded-lg bg-gray-800 border border-gray-700 px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-500"
              placeholder="your_username"
              value={values.taiKhoan}
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm text-gray-300 mb-1">Password</label>
            <input
              name="matKhau"
              onChange={handleOnChange}
              value={values.matKhau}
              type="password"
              className="w-full rounded-lg bg-gray-800 border border-gray-700 px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-500"
              placeholder="••••••••"
            />
          </div>

          {/* Options */}
          <div className="flex items-center justify-between text-sm">
            <label className="inline-flex items-center gap-2 text-gray-300">
              <input type="checkbox" className="accent-pink-500" /> Remember me
            </label>
            <Link
              to="/auth/forgot-password"
              className="text-pink-400 hover:underline"
            >
              Forgot password?
            </Link>
          </div>

          {/* Submit */}
          <button
            disabled={isPending}
            className="w-full rounded-lg bg-pink-500 hover:bg-pink-600 px-4 py-2 font-semibold text-white transition"
          >
            {isPending ? "Logging in..." : "Login"}
            {""}
          </button>
        </form>

        {/* Footer */}
        <p className="mt-4 text-center text-sm text-gray-400">
          Don’t have an account?{" "}
          <Link to="/auth/register" className="text-pink-400 hover:underline">
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}

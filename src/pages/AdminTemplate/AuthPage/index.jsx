import React, { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { LoginApi } from "../../../services/auth.api";
import { setUser } from "../../../store/auth.slice";
import { useNavigate, useLocation } from "react-router-dom";
export default function AuthPage() {
  const [values, setValues] = useState({
    taiKhoan: "",
    matKhau: "",
  });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { mutate: handleLogin, isPending } = useMutation({
    mutationFn: LoginApi,
    onSuccess: (user) => {
      if (!user) return;
      localStorage.setItem("token", user.accessToken);
      localStorage.setItem("user", JSON.stringify(user));
      dispatch(setUser(user));
      const from = location.state?.from;
      const redirectPath = typeof from === "string" ? from : "/admin/dashboard";
      navigate(redirectPath, { replace: true });
    },
    onError: () => alert("Login failed. Please check your credentials."),
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      <div className="w-full max-w-md bg-gray-900 p-6 rounded-lg">
        <h2 className="text-2xl font-bold mb-4">Login</h2>

        {/* Username */}
        <input
          type="text"
          placeholder="Username"
          value={values.taiKhoan}
          onChange={(event) =>
            setValues({ ...values, taiKhoan: event.target.value })
          }
          className="w-full p-2 mb-3 rounded bg-gray-800 border border-gray-700"
        />

        {/* Password */}
        <input
          type="password"
          placeholder="Password"
          value={values.matKhau}
          onChange={(event) =>
            setValues({ ...values, matKhau: event.target.value })
          }
          className="w-full p-2 mb-4 rounded bg-gray-800 border border-gray-700"
        />

        {/* Login Button */}
        <button
          disabled={isPending}
          onClick={() => handleLogin(values)}
          className="w-full bg-pink-500 hover:bg-pink-600 py-2 rounded"
        >
          {isPending ? "Logging in..." : "Login"}
        </button>
      </div>
    </div>
  );
}

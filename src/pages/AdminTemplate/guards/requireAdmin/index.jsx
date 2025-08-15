import { Navigate, useLocation } from "react-router-dom";
import React from "react";

export default function RequireAdmin({ children }) {
  const location = useLocation();
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const role = user?.role ?? user?.maLoaiNguoiDung;
  const isAdmin =
    String(role || "").toLowerCase() === "admin" ||
    String(role).toLowerCase() === "quantri";
  const from =
    location.pathname === "/admin" ? "/admin/dashboard" : location.pathname;
  if (!token || !isAdmin) {
    return <Navigate to="/auth" replace state={{ from }} />;
  }
  return children;
}

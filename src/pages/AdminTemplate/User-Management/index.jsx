import React from "react";

export default function UserManagement() {
  return (
    <div className="p-6 bg-gray-950 min-h-screen text-white">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Quản lý người dùng</h1>
        <button className="bg-pink-500 hover:bg-pink-600 text-white font-medium px-4 py-2 rounded-lg">
          + Thêm người dùng
        </button>
      </div>

      {/* Table */}
      <table className="min-w-full border border-gray-800 rounded-lg overflow-hidden">
        <thead className="bg-gray-800 text-gray-300">
          <tr>
            <th className="px-4 py-3 text-left">Tài khoản</th>
            <th className="px-4 py-3 text-left">Họ tên</th>
            <th className="px-4 py-3 text-left">Email</th>
            <th className="px-4 py-3 text-left">Số ĐT</th>
            <th className="px-4 py-3 text-left">Loại ND</th>
            <th className="px-4 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-800">
          {/* Skeleton rows */}
          {Array.from({ length: 5 }).map((_, i) => (
            <tr key={i}>
              <td className="px-4 py-3">
                <div className="w-24 h-4 bg-gray-800 rounded animate-pulse" />
              </td>
              <td className="px-4 py-3">
                <div className="w-32 h-4 bg-gray-800 rounded animate-pulse" />
              </td>
              <td className="px-4 py-3">
                <div className="w-40 h-4 bg-gray-800 rounded animate-pulse" />
              </td>
              <td className="px-4 py-3">
                <div className="w-24 h-4 bg-gray-800 rounded animate-pulse" />
              </td>
              <td className="px-4 py-3">
                <div className="w-20 h-4 bg-gray-800 rounded animate-pulse" />
              </td>
              <td className="px-4 py-3 text-right">
                <div className="w-16 h-6 bg-gray-800 rounded animate-pulse inline-block mr-2" />
                <div className="w-16 h-6 bg-gray-800 rounded animate-pulse inline-block" />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

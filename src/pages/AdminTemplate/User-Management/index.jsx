import {
  getUserListApi,
  addUserApi,
  updateUserApi,
  deleteUserApi,
} from "../../../services/user.api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useEffect } from "react";
import api from "../../../services/api";

export default function UserManagement() {
  const queryClient = useQueryClient();
  const [addOpen, setAddOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [me, setMe] = useState(null);
  useEffect(() => {
    (async () => {
      try {
        const res = await api.post("QuanLyNguoiDung/ThongTinTaiKhoan");
        setMe(res.data.content);
      } catch (e) {
        console.error("Thông tin tài khoản:", e?.response || e);
      }
    })();
  }, []);
  const isAdmin = me?.maLoaiNguoiDung === "QuanTri";
  const {
    data: users = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["users", "GP01"],
    queryFn: () => getUserListApi("GP01"),
  });

  const { mutate: addUser, isPending: isAdding } = useMutation({
    mutationFn: async (payload) => {
      try {
        return await addUserApi(payload);
      } catch (error) {
        console.error("🚀 ~ addUser error:", error);
        throw error;
      }
    },
    onSuccess: () => {
      setAddOpen(false);
      queryClient.invalidateQueries({ queryKey: ["users", "GP01"] });
      alert("Thêm người dùng thành công!");
    },
    onError: (error) => {
      alert(
        error?.response?.data?.content ||
          error?.response?.data?.message ||
          "Thêm người dùng thất bại!"
      );
    },
  });
  const { mutate: updateUser } = useMutation({
    mutationFn: async (data) => updateUserApi(data),
    onSuccess: () => {
      setEditOpen(false);
      setSelectedUser(null);
      queryClient.invalidateQueries({ queryKey: ["users", "GP01"] });
      alert("Cập nhật người dùng thành công!");
    },
    onError: (error) => {
      alert(
        error?.response?.data?.content ||
          error?.response?.data?.message ||
          "Cập nhật người dùng thất bại!"
      );
    },
  });
  const { mutate: deleteUser, isPending: isDeleting } = useMutation({
    mutationFn: (taiKhoan) => deleteUserApi(taiKhoan),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users", "GP01"] });
      alert("Xóa người dùng thành công!");
    },
    onError: (error) => {
      alert(
        error?.response?.data?.content ||
          error?.response?.data?.message ||
          "Xóa người dùng thất bại!"
      );
    },
  });
  const handleOpenAdd = () => setAddOpen(true);
  const handleCloseAdd = () => setAddOpen(false);
  const handleSubmitAdd = (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const payload = {
      taiKhoan: formData.get("taiKhoan")?.toString().trim(),
      matKhau: formData.get("matKhau")?.toString().trim(),
      email: formData.get("email")?.toString().trim(),
      soDT: formData.get("soDT")?.toString().trim(),
      maNhom: "GP01",
      maLoaiNguoiDung:
        formData.get("maLoaiNguoiDung")?.toString() || "KhachHang",
      hoTen: formData.get("hoTen")?.toString().trim(),
    };
    addUser(payload);
  };
  const handleCloseEdit = () => {
    setEditOpen(false);
    setSelectedUser(null);
  };
  const handleSubmitEdit = (event) => {
    event.preventDefault();
    if (!selectedUser) return;
    if (!isAdmin && selectedUser.taiKhoan !== me?.taiKhoan) {
      return alert("Bạn không có quyền sửa tài khoản này!");
    }
    const form = new FormData(event.currentTarget);
    const payload = {
      taiKhoan: selectedUser.taiKhoan,
      matKhau: form.get("matKhau")?.toString().trim() || selectedUser.matKhau,
      email: form.get("email")?.toString().trim() || selectedUser.email,
      soDT: form.get("soDT")?.toString().trim() || selectedUser.soDT,
      maNhom: "GP01",
      maLoaiNguoiDung:
        form.get("maLoaiNguoiDung")?.toString() || selectedUser.maLoaiNguoiDung,
      hoTen: form.get("hoTen")?.toString().trim() || selectedUser.hoTen,
    };
    updateUser({ ...selectedUser, ...payload });
  };
  if (!me) return <div className="p-6 text-white">Đang kiểm tra quyền...</div>;
  const handleDelete = (user) => {
    if (!window.confirm(`Xác nhận xóa người dùng ${user.taiKhoan}?`)) return;
    deleteUser(user.taiKhoan);
  };
  return (
    <div className="p-6 bg-gray-950 min-h-screen text-white">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Quản lý người dùng</h1>
        {isAdmin && (
          <button
            onClick={() => setAddOpen(true)}
            className="bg-pink-500 hover:bg-pink-600 text-white font-medium px-4 py-2 rounded-lg"
          >
            + Thêm người dùng
          </button>
        )}
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
          {isLoading ? (
            Array.from({ length: 5 }).map((_, i) => (
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
            ))
          ) : isError ? (
            <tr>
              <td colSpan={6} className="px-4 py-6 text-center text-rose-400">
                Không tải được danh sách người dùng.
              </td>
            </tr>
          ) : users?.length ? (
            users.map((user) => (
              <tr key={user.taiKhoan}>
                <td className="px-4 py-3">{user.taiKhoan}</td>
                <td className="px-4 py-3">{user.hoTen}</td>
                <td className="px-4 py-3">{user.email}</td>
                <td className="px-4 py-3">{user.soDT}</td>
                <td className="px-4 py-3">{user.maLoaiNguoiDung}</td>
                <td className="px-4 py-3 text-right">
                  <button
                    className="px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded text-sm mr-2"
                    onClick={() => setSelectedUser(user) || setEditOpen(true)}
                  >
                    Edit
                  </button>
                  <button
                    className="px-3 py-1 bg-red-600 hover:bg-red-700 rounded text-sm"
                    onClick={() => handleDelete(user)}
                  >
                    {isDeleting ? "Đang xóa..." : "Delete"}
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={6} className="px-4 py-6 text-center text-gray-400">
                Không có người dùng nào.
              </td>
            </tr>
          )}
        </tbody>
      </table>
      {/* Add User Modal */}
      {addOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/60"
            onClick={handleCloseAdd}
          />
          <div className="relative z-10 w-full max-w-md rounded-2xl border border-gray-800 bg-gray-900 p-6 shadow-xl">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold">Thêm người dùng</h3>
              <button
                onClick={handleCloseAdd}
                className="px-2 py-1 rounded hover:bg-gray-800"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmitAdd} className="space-y-3">
              <input
                name="taiKhoan"
                placeholder="Tài khoản"
                className="w-full rounded bg-gray-800 border border-gray-700 px-3 py-2"
                required
              />
              <input
                name="matKhau"
                type="password"
                placeholder="Mật khẩu"
                className="w-full rounded bg-gray-800 border border-gray-700 px-3 py-2"
                required
              />
              <input
                name="hoTen"
                placeholder="Họ tên"
                className="w-full rounded bg-gray-800 border border-gray-700 px-3 py-2"
                required
              />
              <input
                name="email"
                type="email"
                placeholder="Email"
                className="w-full rounded bg-gray-800 border border-gray-700 px-3 py-2"
                required
              />
              <input
                name="soDT"
                placeholder="Số điện thoại"
                className="w-full rounded bg-gray-800 border border-gray-700 px-3 py-2"
                required
              />
              <select
                name="maLoaiNguoiDung"
                defaultValue="KhachHang"
                className="w-full rounded bg-gray-800 border border-gray-700 px-3 py-2"
              >
                <option value="KhachHang">Khách Hàng</option>
                <option value="QuanTri">Quản Trị</option>
              </select>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={handleCloseAdd}
                  className="px-3 py-2 rounded-lg border border-gray-700 hover:bg-gray-800"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={isAdding}
                  className="px-4 py-2 rounded-lg bg-pink-500 hover:bg-pink-600 font-medium disabled:opacity-50"
                >
                  {isAdding ? "Đang thêm..." : "Thêm"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {editOpen && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/60"
            onClick={handleCloseEdit}
          />
          <div className="relative z-10 w-full max-w-md rounded-2xl border border-gray-800 bg-gray-900 p-6 shadow-xl">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold">Sửa người dùng</h3>
              <button
                onClick={handleCloseEdit}
                className="px-2 py-1 rounded hover:bg-gray-800"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmitEdit} className="space-y-3">
              <input
                disabled
                value={selectedUser.taiKhoan}
                className="w-full rounded bg-gray-800 border border-gray-700 px-3 py-2 opacity-70 cursor-not-allowed"
              />
              <input
                name="matKhau"
                type="password"
                placeholder="Mật khẩu (để trống nếu giữ nguyên)"
                className="w-full rounded bg-gray-800 border border-gray-700 px-3 py-2"
              />
              <input
                name="hoTen"
                defaultValue={selectedUser.hoTen}
                placeholder="Họ tên"
                className="w-full rounded bg-gray-800 border border-gray-700 px-3 py-2"
                required
              />
              <input
                name="email"
                type="email"
                defaultValue={selectedUser.email}
                placeholder="Email"
                className="w-full rounded bg-gray-800 border border-gray-700 px-3 py-2"
                required
              />
              <input
                name="soDT"
                defaultValue={selectedUser.soDT}
                placeholder="Số điện thoại"
                className="w-full rounded bg-gray-800 border border-gray-700 px-3 py-2"
                required
              />
              <select
                name="maLoaiNguoiDung"
                defaultValue={selectedUser.maLoaiNguoiDung}
                className="w-full rounded bg-gray-800 border border-gray-700 px-3 py-2"
              >
                <option value="KhachHang">Khách Hàng</option>
                <option value="QuanTri">Quản Trị</option>
              </select>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={handleCloseEdit}
                  className="px-3 py-2 rounded-lg border border-gray-700 hover:bg-gray-800"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-pink-500 hover:bg-pink-600 font-medium"
                >
                  Lưu
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

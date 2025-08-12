import api from "./api";
export const LoginApi = async (values) => {
  try {
    const response = await api.post("QuanLyNguoiDung/DangNhap", values);
    return response.data.content;
  } catch (error) {
    console.log("🚀 ~ LoginApi ~ error:", error);
  }
};

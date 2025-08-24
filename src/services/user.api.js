import api from "./api";

export const getUserListApi = async (maNhom = "GP01") => {
  try {
    const res = await api.get("QuanLyNguoiDung/LayDanhSachNguoiDung", {
      params: { MaNhom: maNhom },
    });
    return res.data.content;
  } catch (error) {
    console.error("🚀 ~ getUserListApi error:", error);
    throw error;
  }
};

import { tr } from "zod/v4/locales";
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

export const addUserApi = async (user) => {
  try {
    const res = await api.post("QuanLyNguoiDung/ThemNguoiDung", user);
    return res.data.content;
  } catch (error) {
    console.error("🚀 ~ addUserApi error:", error);
    throw error;
  }
};

export const deleteUserApi = async (taiKhoan) => {
  try {
    const res = await api.delete(
      `QuanLyNguoiDung/XoaNguoiDung?TaiKhoan=${taiKhoan}`
    );
    return res.data.content;
  } catch (error) {
    console.error("🚀 ~ deleteUserApi error:", error);
    throw error;
  }
};

export const updateUserApi = async (payload) => {
  try {
    console.log("[UPDATE payload]", payload);
    const res = await api.post(
      "QuanLyNguoiDung/CapNhatThongTinNguoiDung",
      payload
    );
    return res.data.content;
  } catch (error) {
    console.log("🚀 ~ updateUserApi error:", {
      status: error?.response?.status,
      data: error?.response?.data,
      message: error?.message,
    });
    throw error;
  }
};

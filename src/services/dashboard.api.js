import api from "./api";
import { getMovieListApi, getComingSoonApi } from "./movie.api";

export const fetchTotalMovie = async (maNhom = "GP01") => {
  try {
    const list = await getMovieListApi(maNhom, 1, 1000);
    return Array.isArray(list) ? list.length : 0;
  } catch (error) {
    console.error("Error fetching total movie:", error);
    throw error;
  }
};

export const fetchTotalComingSoon = async (maNhom = "GP01") => {
  try {
    const list = await getComingSoonApi(maNhom);
    return Array.isArray(list) ? list.length : 0;
  } catch (error) {
    console.error("Error fetching total coming soon:", error);
    throw error;
  }
};

export const fetchUsers = async (maNhom = "GP01") => {
  try {
    const { data } = await api.get("/QuanLyNguoiDung/LayDanhSachNguoiDung", {
      params: { MaNhom: maNhom },
    });
    const arr = data?.content;
    return Array.isArray(arr) ? arr : [];
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
};

import api from "./api";

export const getMovieListApi = async (maNhom, soTrang, soPhanTuTrenTrang) => {
  try {
    const response = await api.get(
      `QuanLyPhim/LayDanhSachPhim?maNhom=${maNhom}&soTrang=${soTrang}&soPhanTuTrenTrang=${soPhanTuTrenTrang}`
    );
    return response.data.content;
  } catch (error) {
    console.log("🚀 ~ getMovieListApi ~ error:", error);
  }
};
export const getBannerApi = async () => {
  try {
    const response = await api.get(`/QuanLyPhim/LayDanhSachBanner`);
    console.log("🚀 banner data:", response.data);
    return response.data.content;
  } catch (error) {
    console.log("🚀 ~ getBannerApi ~ error:", error);
  }
};
export const getMovieDetailsApi = async (movieId) => {
  try {
    const response = await api.get(
      `/QuanLyPhim/LayThongTinPhim?MaPhim=${movieId}`
    );
    return response.data.content;
  } catch (error) {
    console.log("🚀 ~ getMovieDetailsApi ~ error:", error);
  }
};

import api from "./api";

export const getCinemaSystemApi = async () => {
  try {
    const response = await api.get(`/QuanLyRap/LayThongTinHeThongRap`);
    return response.data.content;
  } catch (error) {
    console.error("Error fetching cinema system:", error);
    throw error;
  }
};
export const getCinemaClustersApi = async (maHeThongRap) => {
  try {
    const response = await api.get(
      `/QuanLyRap/LayThongTinCumRapTheoHeThong?maHeThongRap=${maHeThongRap}`
    );
    return response.data.content;
  } catch (error) {
    console.error("Error fetching cinema clusters:", error);
    throw error;
  }
};
export const getShowtimesBySystem = async (maHeThongRap, maNhom = "GP01") => {
  try {
    const response = await api.get(
      `/QuanLyRap/LayThongTinLichChieu?maHeThongRap=${maHeThongRap}&maNhom=${maNhom}`
    );
    return response.data.content;
  } catch (error) {
    console.error("Error fetching showtimes by system:", error);
    throw error;
  }
};

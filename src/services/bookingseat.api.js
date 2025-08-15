import api from "./api";

export const getSeatListApi = async (maLichChieu) => {
  try {
    const response = await api.get(
      `QuanLyDatVe/LayDanhSachPhongVe?MaLichChieu=${maLichChieu}`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const bookTicketApi = async ({ maLichChieu, danhSachVe }) => {
  try {
    const bookingPayload = {
      maLichChieu,
      danhSachVe,
    };
    const response = await api.post("QuanLyDatVe/DatVe", bookingPayload);
    return response.data;
  } catch (error) {
    throw error;
  }
};

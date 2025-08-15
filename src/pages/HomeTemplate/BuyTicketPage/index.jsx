import React, { useState, useMemo } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import {
  getSeatListApi,
  bookTicketApi,
} from "../../../services/bookingseat.api";

export default function BuyTicketPage() {
  const { maLichChieu } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  // Logged-in check: prefer Redux, fallback to localStorage
  const reduxUser = useSelector((s) => s?.auth?.user);
  const storedUser = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("user") || "null");
    } catch {
      return null;
    }
  }, []);
  const isLoggedIn = !!(reduxUser?.accessToken || storedUser?.accessToken);

  const [selectedSeats, setSelectedSeats] = useState([]); // array of maGhe

  // Load seat map
  const {
    data: seatList,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["seatList", maLichChieu],
    queryFn: () => getSeatListApi(maLichChieu),
    enabled: !!maLichChieu,
  });

  const { thongTinPhim, danhSachGhe = [] } = seatList?.content || {};

  // Select / unselect seats
  const toggleSeat = (seatId) => {
    setSelectedSeats((prev) =>
      prev.includes(seatId)
        ? prev.filter((id) => id !== seatId)
        : [...prev, seatId]
    );
  };

  // Summary
  const totalPrice = selectedSeats.reduce((sum, id) => {
    const info = danhSachGhe.find((g) => g.maGhe === id);
    return sum + (info?.giaVe || 0);
  }, 0);

  const seatNames = selectedSeats
    .map((id) => danhSachGhe.find((g) => g.maGhe === id)?.tenGhe)
    .filter(Boolean)
    .join(", ");

  // Booking mutation (relies on api interceptor for Authorization)
  const { mutate: bookTicket, isPending } = useMutation({
    mutationFn: bookTicketApi, // ({ maLichChieu, danhSachVe })
    onSuccess: () => {
      alert("Booking successful!");
      setSelectedSeats([]);
      refetch();
    },
    onError: (error) => {
      const msg =
        error?.response?.data?.content || error?.message || "Booking failed";
      alert(msg);
    },
  });

  const handlePrimaryAction = () => {
    if (!isLoggedIn) {
      // redirect to login and come back here after
      navigate("/login", { state: { from: location.pathname } });
      return;
    }
    if (!selectedSeats.length) return;

    const danhSachVe = selectedSeats.map((id) => {
      const info = danhSachGhe.find((g) => g.maGhe === id);
      return { maGhe: info.maGhe, giaVe: info.giaVe };
    });

    bookTicket({ maLichChieu, danhSachVe });
  };

  if (isLoading) return <p className="text-white p-4">Loading seats...</p>;
  if (isError) return <p className="text-white p-4">Something went wrong!</p>;

  return (
    <div className="bg-black text-white min-h-screen">
      {/* Title */}
      <div className="flex items-center justify-center mb-8 mt-8">
        <div className="flex-grow border-t border-gray-600 mx-4" />
        <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-600">
          Buy Tickets
        </h1>
        <div className="flex-grow border-t border-gray-600 mx-4" />
      </div>

      {/* Summary header */}
      <section className="relative overflow-hidden border-b border-gray-800 pb-6">
        <div className="px-4 md:px-10 flex gap-4 items-center">
          <div className="w-20 h-28 md:w-28 md:h-40 rounded-lg border border-gray-800 overflow-hidden bg-gray-800">
            {thongTinPhim?.hinhAnh && (
              <img
                src={thongTinPhim.hinhAnh}
                alt={thongTinPhim?.tenPhim}
                className="w-full h-full object-cover"
              />
            )}
          </div>
          <div>
            <h2 className="text-xl font-semibold">
              {thongTinPhim?.tenPhim || "—"}
            </h2>
            <p className="text-sm text-gray-400">
              {thongTinPhim?.tenCumRap || "—"}
              {thongTinPhim?.tenRap ? ` - ${thongTinPhim.tenRap}` : ""}
            </p>
            <p className="text-sm text-gray-400">
              {thongTinPhim?.ngayChieu || "—"}
              {thongTinPhim?.gioChieu ? ` - ${thongTinPhim.gioChieu}` : ""}
            </p>
          </div>
        </div>
      </section>

      {/* Main */}
      <main className="px-4 md:px-10 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Seat map */}
        <div className="lg:col-span-2 space-y-6">
          {/* Screen */}
          <div className="mt-2">
            <div className="mx-auto w-full md:w-3/4 lg:w-2/3">
              <div className="h-2 bg-gradient-to-r from-transparent via-pink-500 to-transparent rounded-full blur-[1px]" />
              <p className="text-center text-xs text-gray-400 mt-2">SCREEN</p>
            </div>
          </div>

          {/* Legend */}
          <div className="flex items-center gap-4 text-sm text-gray-300 mt-4">
            <Legend color="bg-gray-700" label="Available" />
            <Legend color="bg-pink-500" label="Selected" />
            <Legend color="bg-gray-500" label="Booked" />
          </div>

          {/* Seats */}
          <section className="mt-4 border border-gray-800 rounded-xl p-4 space-y-2">
            {(() => {
              const perRow = 16; // tune for your layout
              const rows = [];
              for (let i = 0; i < danhSachGhe.length; i += perRow) {
                rows.push(danhSachGhe.slice(i, i + perRow));
              }

              return rows.map((row, rowIndex) => (
                <div key={rowIndex} className="flex items-center gap-2">
                  <span className="w-5 text-xs text-gray-400">
                    {String.fromCharCode(65 + rowIndex)}
                  </span>
                  {row.map((seat) => {
                    const isSelected = selectedSeats.includes(seat.maGhe);
                    const classes = seat.daDat
                      ? "bg-gray-500 border-gray-600 text-gray-300 cursor-not-allowed"
                      : isSelected
                      ? "bg-pink-500 border-pink-400 text-white"
                      : "bg-gray-700 border-gray-600 hover:bg-pink-500 hover:border-pink-400";
                    return (
                      <button
                        key={seat.maGhe}
                        onClick={() => !seat.daDat && toggleSeat(seat.maGhe)}
                        disabled={seat.daDat}
                        title={seat.tenGhe}
                        className={`h-8 w-8 rounded-md border text-[10px] font-semibold ${classes}`}
                      >
                        {String(seat.tenGhe).padStart(2, "0")}
                      </button>
                    );
                  })}
                </div>
              ));
            })()}
          </section>
        </div>

        {/* Order Summary */}
        <aside className="space-y-4">
          {!isLoggedIn && (
            <div className="rounded-lg border border-yellow-700 bg-yellow-900/20 text-yellow-200 p-3 text-sm">
              You need to log in to book tickets.
            </div>
          )}

          <section className="border border-gray-800 rounded-2xl p-4 bg-gray-900/40">
            <h3 className="text-lg font-semibold mb-3">Order Summary</h3>
            <div className="space-y-2 text-sm">
              <Row label="Movie" value={thongTinPhim?.tenPhim || "—"} />
              <Row label="Theater" value={thongTinPhim?.tenCumRap || "—"} />
              <Row label="Date" value={thongTinPhim?.ngayChieu || "—"} />
              <Row label="Time" value={thongTinPhim?.gioChieu || "—"} />
              <Row label="Seats" value={seatNames || "—"} />
              <Row
                label="Price"
                value={
                  selectedSeats.length
                    ? `${totalPrice.toLocaleString("vi-VN")} đ`
                    : "—"
                }
              />
            </div>

            <div className="border-t border-gray-800 mt-3 pt-3 flex justify-between items-center">
              <span className="text-gray-300">Total</span>
              <span className="text-xl font-bold text-pink-400">
                {selectedSeats.length
                  ? `${totalPrice.toLocaleString("vi-VN")} đ`
                  : "0 đ"}
              </span>
            </div>

            <button
              type="button"
              onClick={handlePrimaryAction}
              disabled={
                (!isLoggedIn && false) ||
                (!selectedSeats.length && isLoggedIn) ||
                isPending
              }
              className={`w-full mt-4 rounded-lg px-4 py-2 font-semibold text-white transition
                ${
                  isLoggedIn
                    ? "bg-pink-500 hover:bg-pink-600"
                    : "bg-white text-black hover:bg-gray-200"
                }
                disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {isPending
                ? "Processing..."
                : isLoggedIn
                ? "Proceed to Payment"
                : "Log in to continue"}
            </button>

            {selectedSeats.length > 0 && (
              <button
                type="button"
                onClick={() => setSelectedSeats([])}
                className="w-full mt-2 rounded-lg px-4 py-2 font-semibold text-white bg-gray-700 hover:bg-gray-600"
              >
                Clear Selection
              </button>
            )}

            <p className="text-xs text-gray-500 mt-2">
              By continuing, you agree to our Terms and Privacy Policy.
            </p>
          </section>
        </aside>
      </main>
    </div>
  );
}

function Legend({ color, label }) {
  return (
    <div className="flex items-center gap-2">
      <span className={`h-3 w-3 rounded-sm ${color}`} />
      <span className="text-gray-400 text-xs">{label}</span>
    </div>
  );
}

function Row({ label, value }) {
  return (
    <div className="flex justify-between gap-4">
      <span className="text-gray-400">{label}</span>
      <span className="text-gray-200 text-right">{value}</span>
    </div>
  );
}

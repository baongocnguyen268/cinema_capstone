import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  getCinemaSystemApi,
  getCinemaClustersApi,
  getShowtimesBySystem,
} from "../../../services/cinema.api";

export default function CinemaManagement() {
  const [selectedSystemId, setSelectedSystemId] = useState("");

  const systemsQuery = useQuery({
    queryKey: ["cinemaSystem"],
    queryFn: getCinemaSystemApi,
  });

  useEffect(() => {
    if (!selectedSystemId && systemsQuery.data?.length) {
      setSelectedSystemId(systemsQuery.data[0].maHeThongRap);
    }
  }, [systemsQuery.data, selectedSystemId]);

  const clustersQuery = useQuery({
    queryKey: ["cinemaClusters", selectedSystemId],
    queryFn: () => getCinemaClustersApi(selectedSystemId),
    enabled: !!selectedSystemId,
  });

  const showtimesQuery = useQuery({
    queryKey: ["showtimes", selectedSystemId, "GP01"],
    queryFn: () => getShowtimesBySystem(selectedSystemId, "GP01"),
    enabled: !!selectedSystemId,
  });

  const clusters = useMemo(() => {
    const raw = clustersQuery.data;
    if (!raw) return [];
    if (Array.isArray(raw)) {
      if (raw.length && Array.isArray(raw[0]?.lstCumRap)) {
        return raw[0].lstCumRap;
      }
      return raw;
    }
    return [];
  }, [clustersQuery.data]);

  const selectedSystemName = useMemo(() => {
    if (!systemsQuery.data || !selectedSystemId) return "";
    return (
      systemsQuery.data.find((s) => s.maHeThongRap === selectedSystemId)
        ?.tenHeThongRap || ""
    );
  }, [systemsQuery.data, selectedSystemId]);

  return (
    <div className="p-6 bg-gray-950 min-h-screen text-white">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-bold">Quản lý hệ thống rạp chiếu</h1>
          <p className="mt-1 text-sm text-gray-400">
            Hệ thống:{" "}
            <span className="text-gray-200 font-medium">
              {selectedSystemId || "—"}{" "}
              {selectedSystemName ? `— ${selectedSystemName}` : ""}
            </span>
          </p>
        </div>

        {/* System selector */}
        <div className="flex items-center gap-3">
          <select
            className="rounded-lg bg-gray-800 border border-gray-700 px-3 py-2 text-sm"
            value={selectedSystemId || ""}
            onChange={(e) => setSelectedSystemId(e.target.value)}
            disabled={systemsQuery.isLoading || systemsQuery.isError}
          >
            {systemsQuery.isLoading && <option>Đang tải hệ thống…</option>}
            {systemsQuery.isError && <option>Lỗi tải hệ thống</option>}
            {!systemsQuery.isLoading &&
              !systemsQuery.isError &&
              systemsQuery.data?.map((sys) => (
                <option key={sys.maHeThongRap} value={sys.maHeThongRap}>
                  {sys.maHeThongRap} — {sys.tenHeThongRap}
                </option>
              ))}
          </select>

          <button className="bg-pink-500 hover:bg-pink-600 text-white font-medium px-4 py-2 rounded-lg">
            + Thêm rạp
          </button>
        </div>
      </div>

      {/* Table */}
      <table className="min-w-full border border-gray-800 rounded-lg overflow-hidden">
        <thead className="bg-gray-800 text-gray-300">
          <tr>
            <th className="px-4 py-3 text-left">Mã cụm rạp</th>
            <th className="px-4 py-3 text-left">Tên cụm rạp</th>
            <th className="px-4 py-3 text-left">Địa chỉ</th>
            <th className="px-4 py-3 text-left">Hệ thống</th>
            <th className="px-4 py-3 text-right">Actions</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-800">
          {/* Loading skeleton */}
          {(systemsQuery.isLoading || clustersQuery.isLoading) &&
            Array.from({ length: 6 }).map((_, i) => (
              <tr key={`sk-${i}`}>
                <td className="px-4 py-3">
                  <div className="h-4 w-24 bg-gray-800 rounded animate-pulse" />
                </td>
                <td className="px-4 py-3">
                  <div className="h-4 w-40 bg-gray-800 rounded animate-pulse" />
                </td>
                <td className="px-4 py-3">
                  <div className="h-4 w-72 bg-gray-800 rounded animate-pulse" />
                </td>
                <td className="px-4 py-3">
                  <div className="h-4 w-40 bg-gray-800 rounded animate-pulse" />
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="inline-block h-6 w-16 bg-gray-800 rounded animate-pulse mr-2" />
                  <div className="inline-block h-6 w-16 bg-gray-800 rounded animate-pulse" />
                </td>
              </tr>
            ))}

          {/* Error states */}
          {(systemsQuery.isError || clustersQuery.isError) &&
            !clustersQuery.isLoading && (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-center text-rose-400">
                  Không tải được dữ liệu hệ thống/cụm rạp.
                </td>
              </tr>
            )}

          {/* Data rows */}
          {!clustersQuery.isLoading &&
            !clustersQuery.isError &&
            clusters.length > 0 &&
            clusters.map((cum) => (
              <tr key={cum.maCumRap}>
                <td className="px-4 py-3">{cum.maCumRap}</td>
                <td className="px-4 py-3">{cum.tenCumRap}</td>
                <td className="px-4 py-3">{cum.diaChi}</td>
                <td className="px-4 py-3">
                  {selectedSystemName || selectedSystemId}
                </td>
                <td className="px-4 py-3 text-right">
                  <button className="px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded text-sm mr-2">
                    Edit
                  </button>
                  <button className="px-3 py-1 bg-red-600 hover:bg-red-700 rounded text-sm">
                    Delete
                  </button>
                </td>
              </tr>
            ))}

          {!clustersQuery.isLoading &&
            !clustersQuery.isError &&
            clusters.length === 0 &&
            selectedSystemId && (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-center text-gray-400">
                  Không có cụm rạp nào cho hệ thống: {selectedSystemId}
                </td>
              </tr>
            )}
        </tbody>
      </table>

      <div className="mt-4 text-xs text-gray-500">
        Lịch chiếu tải:{" "}
        {showtimesQuery.isFetching
          ? "Đang tải…"
          : Array.isArray(showtimesQuery.data)
          ? showtimesQuery.data.length
          : 0}
      </div>
    </div>
  );
}

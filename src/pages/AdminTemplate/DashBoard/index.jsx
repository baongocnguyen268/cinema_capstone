import React from "react";
import { useQuery } from "@tanstack/react-query";
import {
  fetchTotalMovie,
  fetchTotalComingSoon,
  fetchUsers,
} from "../../../services/dashboard.api";

export default function Dashboard() {
  const {
    data: totalMovies,
    isLoading: moviesLoading,
    isError: moviesError,
  } = useQuery({
    queryKey: ["totalMovies", "GP01"],
    queryFn: () => fetchTotalMovie("GP01"),
  });

  const {
    data: totalComingSoon,
    isLoading: comingLoading,
    isError: comingError,
  } = useQuery({
    queryKey: ["totalComingSoon", "GP01"],
    queryFn: () => fetchTotalComingSoon("GP01"),
  });

  const {
    data: users,
    isLoading: usersLoading,
    isError: usersError,
  } = useQuery({
    queryKey: ["users", "GP01"],
    queryFn: () => fetchUsers("GP01"),
  });

  const loading = moviesLoading || comingLoading || usersLoading;
  const errored = moviesError || comingError || usersError;

  return (
    <div className="min-h-screen bg-gray-950 text-white p-6">
      {errored && (
        <div className="mb-4 text-sm text-rose-400">
          Some KPIs failed to load. Showing what’s available.
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {loading ? (
          <>
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </>
        ) : (
          <>
            <KpiCard label="Total Movies" value={fmt(totalMovies ?? 0)} />
            <KpiCard
              label="Upcoming Releases"
              value={fmt(totalComingSoon ?? 0)}
            />
            <KpiCard
              label="Registered Users"
              value={fmt(
                Array.isArray(users) ? users.length : Number(users ?? 0)
              )}
            />
            <KpiCard label="Tickets Sold This Month" value="—" />
          </>
        )}
      </div>
    </div>
  );
}

function KpiCard({ label, value }) {
  return (
    <div className="rounded-2xl border border-gray-800 bg-gray-900 p-5 shadow-lg">
      <div className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-600">
        {value}
      </div>
      <div className="text-gray-400 mt-1">{label}</div>
    </div>
  );
}

function SkeletonCard() {
  return (
    <div className="rounded-2xl border border-gray-800 bg-gray-900 p-5 shadow-lg">
      <div className="w-12 h-12 bg-gray-800 rounded-full animate-pulse mb-3"></div>
      <div className="w-24 h-6 bg-gray-800 rounded animate-pulse mb-2"></div>
      <div className="w-32 h-4 bg-gray-800 rounded animate-pulse"></div>
    </div>
  );
}

const fmt = (n) => new Intl.NumberFormat("en-US").format(n ?? 0);

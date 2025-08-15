import React from "react";

export default function DashboardSkeleton() {
  return (
    <div className="min-h-screen bg-gray-950 text-white p-6">
      {/* KPI Skeleton Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
      </div>
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

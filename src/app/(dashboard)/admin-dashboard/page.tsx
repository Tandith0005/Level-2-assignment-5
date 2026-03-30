/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useQuery } from "@tanstack/react-query";
import {
  Calendar,
  Users,
  TrendingUp,
  ShieldCheck,
  ArrowRight,
  Eye,
} from "lucide-react";
import Link from "next/link";
import { formatDate } from "@/src/utils/formatDate";
import { getAdminDashboardStats } from "@/src/services/dashboard.service";


// ── Stat card ─────────────────────────────────────────────────────────────────
function StatCard({
  label,
  value,
  icon: Icon,
  color,
  bg,
  loading,
}: {
  label: string;
  value: number | string;
  icon: any;
  color: string;
  bg: string;
  loading: boolean;
}) {
  return (
    <div className="bg-[#0f0a0a] border border-white/8 rounded-3xl p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-zinc-500 text-sm">{label}</p>
          {loading ? (
            <div className="h-9 w-16 bg-white/5 rounded-lg mt-2 animate-pulse" />
          ) : (
            <p className="text-4xl font-bold text-white mt-2">{value ?? 0}</p>
          )}
        </div>
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${bg}`}>
          <Icon className={`w-6 h-6 ${color}`} />
        </div>
      </div>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function AdminPage() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: getAdminDashboardStats,
  });

  const statCards = [
    {
      label: "Total Users",
      value: stats?.totalUsers,
      icon: Users,
      color: "text-rose-400",
      bg: "bg-rose-500/10 border border-rose-500/20",
    },
    {
      label: "Total Events",
      value: stats?.totalEvents,
      icon: Calendar,
      color: "text-violet-400",
      bg: "bg-violet-500/10 border border-violet-500/20",
    },
    {
      label: "Public Events",
      value: stats?.publicEvents,
      icon: TrendingUp,
      color: "text-emerald-400",
      bg: "bg-emerald-500/10 border border-emerald-500/20",
    },
    {
      label: "Private Events",
      value: stats?.privateEvents,
      icon: ShieldCheck,
      color: "text-amber-400",
      bg: "bg-amber-500/10 border border-amber-500/20",
    },
  ];

  return (
    <div>
      {/* Header */}
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-2">
          <ShieldCheck className="w-6 h-6 text-rose-400" />
          <span className="text-xs font-bold text-rose-400 uppercase tracking-widest">Admin Panel</span>
        </div>
        <h1 className="text-4xl font-black text-white tracking-tight">Overview</h1>
        <p className="text-zinc-500 mt-2">Platform-wide stats and management.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {statCards.map((s) => (
          <StatCard key={s.label} {...s} loading={isLoading} />
        ))}
      </div>

      {/* Recent Users + Recent Events side by side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Recent Users */}
        <div className="bg-[#0f0a0a] border border-white/8 rounded-3xl p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-bold text-white">Recent Users</h2>
            <Link
              href="/admin-dashboard/users"
              className="flex items-center gap-1 text-xs text-rose-400 hover:text-rose-300 transition-colors"
            >
              View all <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="space-y-3">
            {isLoading
              ? Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="flex items-center gap-3 animate-pulse">
                    <div className="w-9 h-9 rounded-full bg-white/5 flex-shrink-0" />
                    <div className="flex-1 space-y-1.5">
                      <div className="h-3 bg-white/5 rounded w-1/3" />
                      <div className="h-2.5 bg-white/5 rounded w-1/2" />
                    </div>
                  </div>
                ))
              : (stats?.recentUsers ?? []).map((u: any) => (
                  <div key={u.id} className="flex items-center gap-3 p-2 rounded-xl hover:bg-white/5 transition-all">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-rose-500/30 to-red-600/30 border border-rose-500/20 flex items-center justify-center text-rose-300 text-sm font-bold flex-shrink-0">
                      {u.name?.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white truncate">{u.name}</p>
                      <p className="text-xs text-zinc-500 truncate">{u.email}</p>
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                      u.role === "ADMIN"
                        ? "bg-rose-500/10 text-rose-400 border-rose-500/20"
                        : "bg-zinc-500/10 text-zinc-400 border-zinc-500/20"
                    }`}>
                      {u.role}
                    </span>
                  </div>
                ))}
          </div>
        </div>

        {/* Recent Events */}
        <div className="bg-[#0f0a0a] border border-white/8 rounded-3xl p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-bold text-white">Recent Events</h2>
            <Link
              href="/admin-dashboard/events"
              className="flex items-center gap-1 text-xs text-rose-400 hover:text-rose-300 transition-colors"
            >
              View all <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="space-y-3">
            {isLoading
              ? Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="space-y-1.5 animate-pulse p-2">
                    <div className="h-3 bg-white/5 rounded w-2/3" />
                    <div className="h-2.5 bg-white/5 rounded w-1/3" />
                  </div>
                ))
              : (stats?.recentEvents ?? []).map((e: any) => (
                  <div key={e.id} className="flex items-center justify-between p-2 rounded-xl hover:bg-white/5 transition-all group">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white truncate">{e.title}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full border ${
                          e.type === "PUBLIC"
                            ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                            : "bg-amber-500/10 text-amber-400 border-amber-500/20"
                        }`}>
                          {e.type}
                        </span>
                        <span className="text-xs text-zinc-600">{formatDate(e.date)}</span>
                      </div>
                    </div>
                    <Link
                      href={`/events/${e.id}`}
                      className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg hover:bg-white/10 text-zinc-400 hover:text-white transition-all"
                    >
                      <Eye className="w-4 h-4" />
                    </Link>
                  </div>
                ))}
          </div>
        </div>
      </div>

      {/* Quick links */}
      <div className="bg-[#0f0a0a] border border-white/8 rounded-3xl p-8">
        <h2 className="text-lg font-bold text-white mb-5">Management</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link
            href="/admin-dashboard/users"
            className="group flex items-center gap-4 p-5 bg-white/[0.02] hover:bg-white/5 border border-white/5 hover:border-rose-500/20 rounded-2xl transition-all"
          >
            <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center flex-shrink-0">
              <Users className="w-6 h-6 text-rose-400" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-white group-hover:text-rose-300 transition-colors">Manage Users</h3>
              <p className="text-sm text-zinc-500">View, delete, and manage all users</p>
            </div>
            <ArrowRight className="w-4 h-4 text-zinc-600 group-hover:text-rose-400 group-hover:translate-x-1 transition-all" />
          </Link>

          <Link
            href="/admin-dashboard/events"
            className="group flex items-center gap-4 p-5 bg-white/[0.02] hover:bg-white/5 border border-white/5 hover:border-violet-500/20 rounded-2xl transition-all"
          >
            <div className="w-12 h-12 rounded-2xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center flex-shrink-0">
              <Calendar className="w-6 h-6 text-violet-400" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-white group-hover:text-violet-300 transition-colors">Manage Events</h3>
              <p className="text-sm text-zinc-500">View and delete any event on the platform</p>
            </div>
            <ArrowRight className="w-4 h-4 text-zinc-600 group-hover:text-violet-400 group-hover:translate-x-1 transition-all" />
          </Link>
        </div>
      </div>
    </div>
  );
}
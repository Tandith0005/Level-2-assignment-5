/* eslint-disable @typescript-eslint/no-explicit-any */
// src/app/(dashboard)/dashboard/page.tsx
"use client";

import { useQuery } from "@tanstack/react-query";
import {
  Calendar,
  Users,
  TrendingUp,
  Bell,
  LayoutDashboard,
  User,
  Mail,
  Plus,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import axiosInstance from "@/src/lib/axios";
import { useAuth } from "@/src/hooks/useAuth";
import { getDashboardStats } from "@/src/services/dashboard.service";


// ── Stat card ─────────────────────────────────────────────────────────────────
function StatCard({
  label,
  value,
  icon: Icon,
  color,
  loading,
}: {
  label: string;
  value: number | string;
  icon: any;
  color: string;
  loading: boolean;
}) {
  return (
    <div className="bg-[#111118] border border-white/10 rounded-3xl p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-zinc-500 text-sm">{label}</p>
          {loading ? (
            <div className="h-9 w-16 bg-white/5 rounded-lg mt-2 animate-pulse" />
          ) : (
            <p className="text-4xl font-bold text-white mt-2">{value ?? 0}</p>
          )}
        </div>
        <div className={`w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center ${color}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
}

// ── Mobile nav items ──────────────────────────────────────────────────────────
const mobileNavItems = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard, color: "text-violet-400", bg: "bg-violet-500/10 border-violet-500/20" },
  { href: "/dashboard/my-events", label: "My Events", icon: Calendar, color: "text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/20" },
  { href: "/dashboard/invitations", label: "Invitations", icon: Mail, color: "text-amber-400", bg: "bg-amber-500/10 border-amber-500/20" },
  { href: "/dashboard/notifications", label: "Notifications", icon: Bell, color: "text-rose-400", bg: "bg-rose-500/10 border-rose-500/20" },
  { href: "/dashboard/profile", label: "Profile", icon: User, color: "text-blue-400", bg: "bg-blue-500/10 border-blue-500/20" },
];

// ── Page ──────────────────────────────────────────────────────────────────────
export default function DashboardPage() {
  const { user } = useAuth();

  const { data: stats, isLoading } = useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: getDashboardStats,
  });

  const statCards = [
    { label: "My Events", value: stats?.myEvents, icon: Calendar, color: "text-violet-400" },
    { label: "Total Participants", value: stats?.totalParticipants, icon: Users, color: "text-emerald-400" },
    { label: "Upcoming Events", value: stats?.upcomingEvents, icon: TrendingUp, color: "text-amber-400" },
    { label: "Pending Invites", value: stats?.pendingInvitations, icon: Mail, color: "text-rose-400" },
  ];

  return (
    <div>
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-4xl font-black text-white tracking-tight">Dashboard</h1>
        <p className="text-zinc-500 mt-2">
          Welcome back, <span className="text-zinc-300 font-medium">{user?.name}</span>! Here&apos;s what&apos;s happening.
        </p>
      </div>

      {/* Mobile nav — only visible on mobile (sidebar is hidden lg:hidden) */}
      <div className="lg:hidden mb-8">
        <h2 className="text-lg font-bold text-white mb-4">Navigation</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {mobileNavItems.map(({ href, label, icon: Icon, color, bg }) => (
            <Link
              key={href}
              href={href}
              className={`flex flex-col items-start gap-3 p-4 rounded-2xl border bg-[#111118] hover:bg-[#16161f] transition-all ${bg.split(" ")[1]}`}
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${bg}`}>
                <Icon className={`w-5 h-5 ${color}`} />
              </div>
              <span className="text-sm font-semibold text-white">{label}</span>
            </Link>
          ))}

          {/* Create event shortcut */}
          <Link
            href="/dashboard/my-events/create"
            className="flex flex-col items-start gap-3 p-4 rounded-2xl border border-violet-500/30 bg-violet-600/10 hover:bg-violet-600/20 transition-all"
          >
            <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-violet-600/20 border border-violet-500/30">
              <Plus className="w-5 h-5 text-violet-400" />
            </div>
            <span className="text-sm font-semibold text-white">Create Event</span>
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {statCards.map((s) => (
          <StatCard key={s.label} {...s} loading={isLoading} />
        ))}
      </div>

      {/* Quick Actions — desktop */}
      <div className="bg-[#111118] border border-white/10 rounded-3xl p-8">
        <h2 className="text-xl font-semibold text-white mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            href="/dashboard/my-events/create"
            className="group p-6 bg-white/5 hover:bg-white/10 rounded-2xl border border-white/10 hover:border-violet-500/30 transition-all"
          >
            <Calendar className="w-8 h-8 text-violet-400 mb-4" />
            <h3 className="font-semibold text-white mb-1 flex items-center gap-2">
              Create Event
              <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
            </h3>
            <p className="text-sm text-zinc-500">Host your next event</p>
          </Link>

          <Link
            href="/events"
            className="group p-6 bg-white/5 hover:bg-white/10 rounded-2xl border border-white/10 hover:border-emerald-500/30 transition-all"
          >
            <Users className="w-8 h-8 text-emerald-400 mb-4" />
            <h3 className="font-semibold text-white mb-1 flex items-center gap-2">
              Browse Events
              <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
            </h3>
            <p className="text-sm text-zinc-500">Find events to join</p>
          </Link>

          <Link
            href="/dashboard/invitations"
            className="group relative p-6 bg-white/5 hover:bg-white/10 rounded-2xl border border-white/10 hover:border-amber-500/30 transition-all"
          >
            {stats?.pendingInvitations > 0 && (
              <span className="absolute top-4 right-4 w-5 h-5 bg-amber-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {stats.pendingInvitations}
              </span>
            )}
            <Bell className="w-8 h-8 text-amber-400 mb-4" />
            <h3 className="font-semibold text-white mb-1 flex items-center gap-2">
              Invitations
              <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
            </h3>
            <p className="text-sm text-zinc-500">
              {stats?.pendingInvitations > 0
                ? `${stats.pendingInvitations} pending invite${stats.pendingInvitations > 1 ? "s" : ""}`
                : "Check pending invites"}
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
}
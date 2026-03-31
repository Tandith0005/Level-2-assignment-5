"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Calendar,
  Users,
  LogOut,
  ShieldCheck,
  Flag,
  DoorOpen,
} from "lucide-react";
import { useAuth } from "@/src/hooks/useAuth";
import Image from "next/image";

const navItems = [
  { href: "/admin-dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/admin-dashboard/events", label: "All Events", icon: Calendar },
  { href: "/admin-dashboard/users", label: "All Users", icon: Users },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const isActive = (href: string) => pathname === href;

  return (
    <div className="fixed left-0 top-0 bottom-0 w-72 bg-[#0f0a0a] border-r border-rose-500/10 hidden lg:flex flex-col z-50">
      {/* Logo + Admin badge */}
      <Link href="/admin" className="flex flex-col items-center p-4 pb-2 border-b border-rose-500/10">
        <Image
          src="/SidebarLogo.jpg"
          alt="Planora Logo"
          width={162}
          height={102}
          loading="eager"
          className="w-40 h-auto mx-auto mb-3"
        />
        <span className="flex items-center gap-1.5 px-3 py-1 bg-rose-500/10 border border-rose-500/20 rounded-full text-xs font-bold text-rose-400 uppercase tracking-wider">
          <ShieldCheck className="w-3 h-3" />
          Admin Panel
        </span>
      </Link>

      {/* Navigation */}
      <div className="flex-1 p-4 overflow-y-auto">
        <nav className="space-y-1 px-3">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium transition-all ${
                  isActive(item.href)
                    ? "bg-rose-500/10 text-rose-300 border border-rose-500/20"
                    : "text-zinc-400 hover:bg-white/5 hover:text-white"
                }`}
              >
                <Icon className="w-5 h-5" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Divider */}
        <div className="mx-3 my-4 border-t border-white/5" />

        {/* Back to user dashboard */}
        <div className="px-3">
          <Link
            href="/dashboard"
            className="flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium text-zinc-500 hover:bg-white/5 hover:text-zinc-300 transition-all"
          >
            <Flag className="w-5 h-5" />
            Dashboard
          </Link>
        </div>

        {/* Back to Home */}
          <Link
            href="/"
            className="flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium text-rose-400 hover:bg-rose-500/10 hover:text-white transition-all"
          >
            <DoorOpen className="w-5 h-5" />
            Back to Home
          </Link>
      </div>

      {/* User Footer */}
      <div className="p-4 border-t border-rose-500/10 mt-auto">
        <div className="flex items-center gap-3 px-3 py-2">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-rose-500 to-red-600 flex items-center justify-center text-white font-bold flex-shrink-0">
            {user?.name?.charAt(0).toUpperCase() || "A"}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm text-white font-medium truncate">{user?.name}</p>
            <p className="text-xs text-rose-400/60 truncate">Administrator</p>
          </div>
        </div>

        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-400 hover:bg-red-500/10 rounded-2xl transition-all mt-2"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>
    </div>
  );
}
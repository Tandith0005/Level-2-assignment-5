/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Users,
  Search,
  Trash2,
  Loader2,
  ShieldCheck,
  Filter,
  CheckCircle,
  XCircle,
  Mail,
  Calendar,
} from "lucide-react";
import toast from "react-hot-toast";
import axiosInstance from "@/src/lib/axios";
import { formatDate } from "@/src/utils/formatDate";
import { adminSoftDelete, getAllUsersForAdmin } from "@/src/services/dashboard.service";

// ── User card ─────────────────────────────────────────────────────────────────
function UserCard({
  user,
  onDelete,
  isDeleting,
}: {
  user: any;
  onDelete: (id: string, name: string) => void;
  isDeleting: boolean;
}) {
  return (
    <div className={`bg-[#0f0a0a] border rounded-2xl p-5 transition-all ${
      user.isDeleted ? "border-red-500/10 opacity-60" : "border-white/8 hover:border-white/15"
    }`}>
      <div className="flex items-start justify-between gap-3 mb-4">
        {/* Avatar + name */}
        <div className="flex items-center gap-3 min-w-0">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold flex-shrink-0 ${
            user.role === "ADMIN"
              ? "bg-gradient-to-br from-rose-500/30 to-red-600/30 border border-rose-500/20 text-rose-300"
              : "bg-gradient-to-br from-violet-500/20 to-indigo-500/20 border border-violet-500/20 text-violet-300"
          }`}>
            {user.name?.charAt(0).toUpperCase() || "U"}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-white truncate">{user.name}</p>
            <div className="flex items-center gap-1 mt-0.5">
              <Mail className="w-3 h-3 text-zinc-600 flex-shrink-0" />
              <p className="text-xs text-zinc-500 truncate">{user.email}</p>
            </div>
          </div>
        </div>

        {/* Delete btn */}
        {!user.isDeleted && (
          <button
            onClick={() => onDelete(user.id, user.name)}
            disabled={isDeleting}
            className="w-8 h-8 rounded-lg bg-red-500/10 hover:bg-red-500/20 flex items-center justify-center text-red-400 hover:text-red-300 transition-all flex-shrink-0 disabled:opacity-50"
            title="Delete user"
          >
            {isDeleting ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Trash2 className="w-3.5 h-3.5" />
            )}
          </button>
        )}
      </div>

      {/* Badges row */}
      <div className="flex flex-wrap items-center gap-2">
        {/* Role */}
        <span className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
          user.role === "ADMIN"
            ? "bg-rose-500/10 text-rose-400 border-rose-500/20"
            : "bg-zinc-500/10 text-zinc-400 border-zinc-500/20"
        }`}>
          {user.role === "ADMIN" && <ShieldCheck className="w-2.5 h-2.5" />}
          {user.role}
        </span>

        {/* Verified */}
        {user.isVerified ? (
          <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <CheckCircle className="w-2.5 h-2.5" /> Verified
          </span>
        ) : (
          <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <XCircle className="w-2.5 h-2.5" /> Unverified
          </span>
        )}

        {/* Deleted */}
        {user.isDeleted && (
          <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-red-500/10 text-red-400 border border-red-500/20">
            <Trash2 className="w-2.5 h-2.5" /> Deleted
          </span>
        )}
      </div>

      {/* Joined date */}
      <div className="flex items-center gap-1.5 mt-3 pt-3 border-t border-white/5 text-xs text-zinc-600">
        <Calendar className="w-3 h-3" />
        Joined {formatDate(user.createdAt)}
      </div>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function AdminUsersPage() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<"" | "ADMIN" | "USER">("");
  const [page, setPage] = useState(1);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setDebouncedSearch(e.target.value);
      setPage(1);
    }, 400);
  };

  const { data, isLoading } = useQuery({
    queryKey: ["admin-users", debouncedSearch, roleFilter, page],
    queryFn: () => getAllUsersForAdmin({ q: debouncedSearch, page }),
  });

  const deleteMutation = useMutation({
    mutationFn: adminSoftDelete,
    onSuccess: () => {
      toast.success("User deleted");
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      queryClient.invalidateQueries({ queryKey: ["admin-stats"] });
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Failed to delete user");
    },
  });

  const handleDelete = (id: string, name: string) => {
    if (!confirm(`Delete user "${name}"? This cannot be undone.`)) return;
    deleteMutation.mutate(id);
  };

  // Client-side role filter (search endpoint returns all, we filter locally)
  let users: any[] = data?.data || [];
  if (roleFilter) {
    users = users.filter((u: any) => u.role === roleFilter);
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-black text-white tracking-tight">All Users</h1>
        <p className="text-zinc-500 mt-2 text-sm">
          View and manage all registered users on the platform
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
          <input
            value={search}
            onChange={handleSearchChange}
            placeholder="Search by name or email..."
            className="w-full bg-[#0f0a0a] border border-white/8 hover:border-white/15 focus:border-rose-500/40 focus:ring-2 focus:ring-rose-500/10 rounded-xl pl-10 pr-4 py-2.5 text-white placeholder:text-zinc-600 text-sm transition-all outline-none"
          />
        </div>

        {/* Role filter */}
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
          <select
            value={roleFilter}
            onChange={(e) => {
              setRoleFilter(e.target.value as any);
              setPage(1);
            }}
            className="bg-[#0f0a0a] border border-white/8 hover:border-white/15 focus:border-rose-500/40 rounded-xl pl-9 pr-8 py-2.5 text-sm text-white outline-none transition-all appearance-none cursor-pointer"
          >
            <option value="">All Roles</option>
            <option value="USER">Users</option>
            <option value="ADMIN">Admins</option>
          </select>
        </div>
      </div>

      {/* Count */}
      {!isLoading && (
        <p className="text-xs text-zinc-600 mb-4">
          Showing <span className="text-zinc-400 font-medium">{users.length}</span> user{users.length !== 1 ? "s" : ""}
        </p>
      )}

      {/* Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 9 }).map((_, i) => (
            <div key={i} className="bg-[#0f0a0a] border border-white/8 rounded-2xl p-5 animate-pulse">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-white/5 flex-shrink-0" />
                <div className="flex-1 space-y-1.5">
                  <div className="h-3.5 bg-white/5 rounded w-1/2" />
                  <div className="h-3 bg-white/5 rounded w-2/3" />
                </div>
              </div>
              <div className="flex gap-2">
                <div className="h-5 w-14 bg-white/5 rounded-full" />
                <div className="h-5 w-16 bg-white/5 rounded-full" />
              </div>
              <div className="mt-3 pt-3 border-t border-white/5">
                <div className="h-3 bg-white/5 rounded w-1/3" />
              </div>
            </div>
          ))}
        </div>
      ) : users.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center bg-[#0f0a0a] border border-white/8 rounded-3xl">
          <Users className="w-12 h-12 text-zinc-700 mb-3" />
          <p className="text-zinc-500 font-medium">No users found</p>
          <p className="text-zinc-600 text-sm mt-1">Try adjusting your search</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {users.map((user: any) => (
            <UserCard
              key={user.id}
              user={user}
              onDelete={handleDelete}
              isDeleting={
                deleteMutation.isPending && deleteMutation.variables === user.id
              }
            />
          ))}
        </div>
      )}
    </div>
  );
}
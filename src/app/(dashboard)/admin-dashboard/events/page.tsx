/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Calendar,
  MapPin,
  DollarSign,
  Trash2,
  Eye,
  Search,
  Loader2,
  Globe,
  Lock,
  Users,
  Filter,
} from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";
import { formatDate } from "@/src/utils/formatDate";
import { adminDeleteEvent, getAllEvents } from "@/src/services/dashboard.service";



// ── Page ──────────────────────────────────────────────────────────────────────
export default function AdminEventsPage() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [page, setPage] = useState(1);
  const debounceRef = useState<ReturnType<typeof setTimeout> | null>(null);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    if (debounceRef[0]) clearTimeout(debounceRef[0]);
    debounceRef[1](
      setTimeout(() => {
        setDebouncedSearch(e.target.value);
        setPage(1);
      }, 400)
    );
  };

  const { data, isLoading } = useQuery({
    queryKey: ["admin-events", debouncedSearch, typeFilter, page],
    queryFn: () =>
      getAllEvents({ search: debouncedSearch, type: typeFilter || undefined, page }),
  });

  const deleteMutation = useMutation({
    mutationFn: adminDeleteEvent,
    onSuccess: () => {
      toast.success("Event deleted");
      queryClient.invalidateQueries({ queryKey: ["admin-events"] });
      queryClient.invalidateQueries({ queryKey: ["admin-stats"] });
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Failed to delete event");
    },
  });

  const handleDelete = (id: string, title: string) => {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return;
    deleteMutation.mutate(id);
  };

  const events = data?.data?.data || data?.data || [];
  const meta = data?.data?.meta || data?.meta;

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-black text-white tracking-tight">All Events</h1>
        <p className="text-zinc-500 mt-2 text-sm">
          View and manage every event on the platform
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
            placeholder="Search events by title or organizer..."
            className="w-full bg-[#0f0a0a] border border-white/8 hover:border-white/15 focus:border-rose-500/40 focus:ring-2 focus:ring-rose-500/10 rounded-xl pl-10 pr-4 py-2.5 text-white placeholder:text-zinc-600 text-sm transition-all outline-none"
          />
        </div>

        {/* Type filter */}
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
          <select
            value={typeFilter}
            onChange={(e) => { setTypeFilter(e.target.value); setPage(1); }}
            className="bg-[#0f0a0a] border border-white/8 hover:border-white/15 focus:border-rose-500/40 rounded-xl pl-9 pr-8 py-2.5 text-sm text-white outline-none transition-all appearance-none cursor-pointer"
          >
            <option value="">All Types</option>
            <option value="PUBLIC">Public</option>
            <option value="PRIVATE">Private</option>
          </select>
        </div>
      </div>

      {/* Stats bar */}
      {meta && (
        <p className="text-xs text-zinc-600 mb-4">
          Showing <span className="text-zinc-400 font-medium">{events.length}</span> of{" "}
          <span className="text-zinc-400 font-medium">{meta.total}</span> events
        </p>
      )}

      {/* Table */}
      <div className="bg-[#0f0a0a] border border-white/8 rounded-3xl overflow-hidden">
        {/* Table header */}
        <div className="grid grid-cols-[1fr_auto_auto_auto_auto] gap-4 px-6 py-3 border-b border-white/5 text-xs font-semibold text-zinc-500 uppercase tracking-wider">
          <span>Event</span>
          <span className="hidden sm:block">Type</span>
          <span className="hidden md:block">Date</span>
          <span className="hidden lg:block">Fee</span>
          <span>Actions</span>
        </div>

        {/* Rows */}
        <div className="divide-y divide-white/5">
          {isLoading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="grid grid-cols-[1fr_auto_auto_auto_auto] gap-4 px-6 py-4 animate-pulse items-center">
                <div className="space-y-1.5">
                  <div className="h-4 bg-white/5 rounded w-2/3" />
                  <div className="h-3 bg-white/5 rounded w-1/3" />
                </div>
                <div className="h-5 w-16 bg-white/5 rounded-full hidden sm:block" />
                <div className="h-3 w-24 bg-white/5 rounded hidden md:block" />
                <div className="h-3 w-12 bg-white/5 rounded hidden lg:block" />
                <div className="flex gap-2">
                  <div className="w-8 h-8 bg-white/5 rounded-lg" />
                  <div className="w-8 h-8 bg-white/5 rounded-lg" />
                </div>
              </div>
            ))
          ) : events.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <Calendar className="w-12 h-12 text-zinc-700 mb-3" />
              <p className="text-zinc-500 font-medium">No events found</p>
              <p className="text-zinc-600 text-sm mt-1">Try adjusting your filters</p>
            </div>
          ) : (
            events.map((event: any) => (
              <div
                key={event.id}
                className="grid grid-cols-[1fr_auto_auto_auto_auto] gap-4 px-6 py-4 items-center hover:bg-white/[0.02] transition-all"
              >
                {/* Title + organizer */}
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-white truncate">{event.title}</p>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <Users className="w-3 h-3 text-zinc-600" />
                    <p className="text-xs text-zinc-500 truncate">
                      {event.creator?.name ?? "Unknown"}
                    </p>
                  </div>
                </div>

                {/* Type badge */}
                <span className={`hidden sm:flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                  event.type === "PUBLIC"
                    ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                    : "bg-amber-500/10 text-amber-400 border-amber-500/20"
                }`}>
                  {event.type === "PUBLIC"
                    ? <Globe className="w-2.5 h-2.5" />
                    : <Lock className="w-2.5 h-2.5" />}
                  {event.type}
                </span>

                {/* Date */}
                <div className="hidden md:flex items-center gap-1.5 text-xs text-zinc-500">
                  <Calendar className="w-3 h-3 text-zinc-600" />
                  {formatDate(event.date)}
                </div>

                {/* Fee */}
                <div className="hidden lg:flex items-center gap-1 text-xs">
                  {event.registrationFee === 0 ? (
                    <span className="text-emerald-400 font-semibold">Free</span>
                  ) : (
                    <span className="text-violet-400 font-semibold flex items-center gap-0.5">
                      <DollarSign className="w-3 h-3" />
                      {event.registrationFee}
                    </span>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <Link
                    href={`/events/${event.id}`}
                    className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-zinc-400 hover:text-white transition-all"
                    title="View event"
                  >
                    <Eye className="w-3.5 h-3.5" />
                  </Link>
                  <button
                    onClick={() => handleDelete(event.id, event.title)}
                    disabled={deleteMutation.isPending && deleteMutation.variables === event.id}
                    className="w-8 h-8 rounded-lg bg-red-500/10 hover:bg-red-500/20 flex items-center justify-center text-red-400 hover:text-red-300 transition-all disabled:opacity-50"
                    title="Delete event"
                  >
                    {deleteMutation.isPending && deleteMutation.variables === event.id ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Trash2 className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Pagination */}
      {meta && meta.totalPage > 1 && (
        <div className="flex items-center justify-center gap-3 mt-6">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-4 py-2 text-sm font-medium bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white rounded-xl border border-white/5 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >
            Previous
          </button>
          <span className="text-sm text-zinc-600">
            {page} / {meta.totalPage}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(meta.totalPage, p + 1))}
            disabled={page === meta.totalPage}
            className="px-4 py-2 text-sm font-medium bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white rounded-xl border border-white/5 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
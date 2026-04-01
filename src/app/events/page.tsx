"use client";

import { Suspense } from "react";
import Navbar from "@/src/components/common/Navbar";
import Footer from "@/src/components/common/footer";
import FilterBar from "@/src/components/event/FilterBar";
import EventGrid from "@/src/components/event/EventGrid";
import Pagination from "@/src/components/common/Pagination";
import { useEventFilters } from "@/src/hooks/useEventFilters";
import { useEvents } from "@/src/hooks/useEvents";

function EventContent() {
  const filters = useEventFilters();
  const { events, meta, loading, error } = useEvents({
    page: filters.page,
    urlSearch: filters.urlSearch,
    urlType: filters.urlType,
    urlMinFee: filters.urlMinFee,
    urlMaxFee: filters.urlMaxFee,
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="text-violet-400 animate-pulse">Loading events...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="text-red-500 bg-red-500/10 px-6 py-4 rounded-lg border border-red-500/20">
          Something went wrong. Please refresh or try again later.
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 min-h-screen pt-20 mt-10">
      <div className="mb-8 space-y-4">
        <h1 className="text-3xl font-bold text-white mb-6">Explore Events</h1>

        <FilterBar
          tempSearch={filters.tempSearch}
          tempType={filters.tempType}
          tempMinFee={filters.tempMinFee}
          tempMaxFee={filters.tempMaxFee}
          hasActiveFilters={filters.hasActiveFilters}
          onSearchChange={filters.setTempSearch}
          onTypeChange={filters.setTempType}
          onMinFeeChange={filters.setTempMinFee}
          onMaxFeeChange={filters.setTempMaxFee}
          onApply={filters.applyFilters}
          onReset={filters.resetFilters}
        />
      </div>

      <EventGrid
        events={events}
        hasActiveFilters={filters.hasActiveFilters}
        onReset={filters.resetFilters}
      />

      <Pagination
        page={filters.page}
        totalPages={meta?.totalPage ?? 1}
        onPageChange={filters.changePage}
      />
    </div>
  );
}

export default function EventPage() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center items-center min-h-screen text-white">
          Loading...
        </div>
      }
    >
      <Navbar />
      <EventContent />
      <Footer />
    </Suspense>
  );
}
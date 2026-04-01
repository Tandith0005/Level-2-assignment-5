"use client";

import { CalendarDays } from "lucide-react";
import EventCard from "@/src/components/event/EventCard";

interface EventGridProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  events: any[];
  hasActiveFilters: boolean;
  onReset: () => void;
}

export default function EventGrid({
  events,
  hasActiveFilters,
  onReset,
}: EventGridProps) {
  if (events.length === 0) {
    return (
      <div className="text-center py-20 bg-[#111118] rounded-xl border border-white/5">
        <CalendarDays className="w-16 h-16 text-zinc-600 mx-auto mb-4" />
        <p className="text-zinc-400 text-lg">
          No events found matching your criteria.
        </p>
        {hasActiveFilters && (
          <button
            onClick={onReset}
            className="mt-4 text-violet-400 hover:text-violet-300 underline"
          >
            Clear filters
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-15">
      {events.map((event) => (
        <EventCard key={event.id} event={event} />
      ))}
    </div>
  );
}
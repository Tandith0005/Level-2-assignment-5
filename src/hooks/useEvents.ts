"use client";

import { useEffect, useState } from "react";
import { getAllEvents } from "@/src/services/event.service";

interface EventFilters {
  page: number;
  urlSearch: string;
  urlType: string;
  urlMinFee: string;
  urlMaxFee: string;
}

export function useEvents({
  page,
  urlSearch,
  urlType,
  urlMinFee,
  urlMaxFee,
}: EventFilters) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [events, setEvents] = useState<any[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [meta, setMeta] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
// 46------------------------------------------------------------------------------
  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await getAllEvents({
          page,
          limit: 9,
          search: urlSearch || undefined,
          type: urlType || undefined,
          minFee: urlMinFee ? Number(urlMinFee) : undefined,
          maxFee: urlMaxFee ? Number(urlMaxFee) : undefined,
        });

        const eventsList = Array.isArray(response.data)
          ? response.data
          : response.data?.data || [];

        const metaInfo = response.meta || response.data?.meta || {};

        setEvents(eventsList);
        setMeta(metaInfo);
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Failed to fetch events";
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [page, urlSearch, urlType, urlMinFee, urlMaxFee]);

  return { events, meta, loading, error };
}
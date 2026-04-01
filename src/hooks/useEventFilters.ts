"use client";

import { useState } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";

export function useEventFilters() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  // Applied values come directly from the URL (source of truth)
  const page = Number(searchParams.get("page")) || 1;
  const urlSearch = searchParams.get("search") || "";
  const urlType = searchParams.get("type") || "";
  const urlMinFee = searchParams.get("minFee") || "";
  const urlMaxFee = searchParams.get("maxFee") || "";

  // Temp state initialises once from URL.
  // resetFilters() clears them explicitly — no useEffect needed.
  const [tempSearch, setTempSearch] = useState(urlSearch);
  const [tempType, setTempType] = useState(urlType);
  const [tempMinFee, setTempMinFee] = useState(urlMinFee);
  const [tempMaxFee, setTempMaxFee] = useState(urlMaxFee);

  const applyFilters = () => {
    const params = new URLSearchParams();
    params.set("page", "1");
    if (tempSearch) params.set("search", tempSearch);
    if (tempType) params.set("type", tempType);
    if (tempMinFee) params.set("minFee", tempMinFee);
    if (tempMaxFee) params.set("maxFee", tempMaxFee);
    router.push(`${pathname}?${params.toString()}`);
  };

  const resetFilters = () => {
    setTempSearch("");
    setTempType("");
    setTempMinFee("");
    setTempMaxFee("");
    router.push(pathname);
  };

  const changePage = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", newPage.toString());
    router.push(`${pathname}?${params.toString()}`);
  };

  const hasActiveFilters = !!(urlSearch || urlType || urlMinFee || urlMaxFee);

  return {
    page,
    urlSearch,
    urlType,
    urlMinFee,
    urlMaxFee,
    hasActiveFilters,
    tempSearch,
    tempType,
    tempMinFee,
    tempMaxFee,
    setTempSearch,
    setTempType,
    setTempMinFee,
    setTempMaxFee,
    applyFilters,
    resetFilters,
    changePage,
  };
}
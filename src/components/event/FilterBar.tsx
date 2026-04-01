"use client";

import { Filter, Search, X } from "lucide-react";

interface FilterBarProps {
  tempSearch: string;
  tempType: string;
  tempMinFee: string;
  tempMaxFee: string;
  hasActiveFilters: boolean;
  onSearchChange: (v: string) => void;
  onTypeChange: (v: string) => void;
  onMinFeeChange: (v: string) => void;
  onMaxFeeChange: (v: string) => void;
  onApply: () => void;
  onReset: () => void;
}

export default function FilterBar({
  tempSearch,
  tempType,
  tempMinFee,
  tempMaxFee,
  hasActiveFilters,
  onSearchChange,
  onTypeChange,
  onMinFeeChange,
  onMaxFeeChange,
  onApply,
  onReset,
}: FilterBarProps) {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") onApply();
  };

  return (
    <div className="bg-[#111118] p-4 rounded-xl border border-white/5 space-y-4">
      {/* Row 1: Search + action buttons */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <input
            type="text"
            placeholder="Search events or organizers..."
            value={tempSearch}
            onChange={(e) => onSearchChange(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full bg-[#0a0a0f] border border-white/10 rounded-lg pl-10 pr-4 py-2 text-white focus:outline-none focus:border-violet-500 transition-colors"
          />
        </div>

        <button
          onClick={onApply}
          className="flex items-center justify-center gap-2 bg-violet-600 hover:bg-violet-500 text-white px-6 py-2 rounded-lg font-medium transition-all shadow-lg shadow-violet-500/20 hover:shadow-violet-500/40"
        >
          <Filter className="w-4 h-4" />
          Apply Filters
        </button>

        {hasActiveFilters && (
          <button
            onClick={onReset}
            title="Clear all filters"
            className="flex items-center justify-center gap-2 bg-white/5 hover:bg-red-500/10 text-zinc-400 hover:text-red-400 border border-white/10 hover:border-red-500/20 px-4 py-2 rounded-lg transition-all"
          >
            <X className="w-4 h-4" />
            <span className="hidden sm:inline">Reset</span>
          </button>
        )}
      </div>

      {/* Row 2: Dropdown filters */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-white/5">
        <div className="space-y-1">
          <label className="text-xs text-zinc-500 uppercase font-semibold tracking-wider">
            Event Type
          </label>
          <select
            value={tempType}
            onChange={(e) => onTypeChange(e.target.value)}
            className="w-full bg-[#0a0a0f] border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-violet-500 cursor-pointer appearance-none"
          >
            <option value="">All Types</option>
            <option value="PUBLIC">Public</option>
            <option value="PRIVATE">Private</option>
          </select>
        </div>

        <div className="space-y-1">
          <label className="text-xs text-zinc-500 uppercase font-semibold tracking-wider">
            Min Fee ($)
          </label>
          <input
            type="number"
            placeholder="0"
            value={tempMinFee}
            onChange={(e) => onMinFeeChange(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full bg-[#0a0a0f] border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-violet-500"
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs text-zinc-500 uppercase font-semibold tracking-wider">
            Max Fee ($)
          </label>
          <input
            type="number"
            placeholder="Any"
            value={tempMaxFee}
            onChange={(e) => onMaxFeeChange(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full bg-[#0a0a0f] border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-violet-500"
          />
        </div>
      </div>

      {/* Row 3: Quick preset chips */}
      <div className="flex gap-2 pt-2">
        <button
          onClick={() => {
            onMinFeeChange("0");
            onMaxFeeChange("0");
          }}
          className="text-xs px-3 py-1 rounded-full bg-white/5 hover:bg-green-500/20 text-zinc-400 hover:text-green-400 border border-white/5 hover:border-green-500/30 transition-all"
        >
          Free Events Only
        </button>
        <button
          onClick={() => {
            onMinFeeChange("1");
            onMaxFeeChange("");
          }}
          className="text-xs px-3 py-1 rounded-full bg-white/5 hover:bg-violet-500/20 text-zinc-400 hover:text-violet-400 border border-white/5 hover:border-violet-500/30 transition-all"
        >
          Paid Events Only
        </button>
      </div>
    </div>
  );
}
"use client";

interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({
  page,
  totalPages,
  onPageChange,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex justify-center items-center gap-2 mt-12">
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1}
        className="px-4 py-2 rounded-lg bg-[#111118] border border-white/10 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/5 transition-colors"
      >
        Previous
      </button>

      <span className="text-zinc-400 px-4">
        Page <span className="text-white font-bold">{page}</span> of{" "}
        {totalPages}
      </span>

      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page === totalPages}
        className="px-4 py-2 rounded-lg bg-[#111118] border border-white/10 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/5 transition-colors"
      >
        Next
      </button>
    </div>
  );
}
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Star, Trash2, Pencil, ShieldCheck, X, Check } from "lucide-react";
import toast from "react-hot-toast";
import {
  createReview,
  getEventReviews,
  updateReview,
  deleteReview,
} from "@/src/services/review.service";
import { useAuth } from "@/src/hooks/useAuth";

// ── Types ─────────────────────────────────────────────────────────────────────
interface Review {
  id: string;
  userId: string;
  rating: number;
  comment: string;
  createdAt: string;
  isParticipant?: boolean;
  user: { name: string; email: string };
}

interface ReviewSectionProps {
  eventId: string;
  /** Pass true if the current user has an APPROVED participant record */
  isParticipant: boolean;
}

// ── Helpers ───────────────────────────────────────────────────────────────────
const StarRow = ({
  value,
  onChange,
  readOnly = false,
  size = 20,
}: {
  value: number;
  onChange?: (v: number) => void;
  readOnly?: boolean;
  size?: number;
}) => (
  <div className="flex gap-1">
    {[1, 2, 3, 4, 5].map((s) => (
      <Star
        key={s}
        width={size}
        height={size}
        onClick={() => !readOnly && onChange?.(s)}
        className={`transition-colors ${
          readOnly ? "" : "cursor-pointer hover:scale-110"
        } ${s <= value ? "text-amber-400 fill-amber-400" : "text-zinc-600"}`}
      />
    ))}
  </div>
);

const Avatar = ({ name }: { name: string }) => {
  const initials = name
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  return (
    <div className="w-9 h-9 rounded-full bg-violet-500/20 border border-violet-500/30 flex items-center justify-center text-xs font-bold text-violet-300 flex-shrink-0">
      {initials}
    </div>
  );
};

const formatRelative = (date: string) => {
  const diff = Date.now() - new Date(date).getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 30) return `${days}d ago`;
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

// ── Main Component ────────────────────────────────────────────────────────────
export default function ReviewSection({
  eventId,
  isParticipant,
}: ReviewSectionProps) {
  const { user, isAuthenticated } = useAuth();
  const queryClient = useQueryClient();

  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editRating, setEditRating] = useState(5);
  const [editComment, setEditComment] = useState("");

  // ── Fetch ──────────────────────────────────────────────────────────────────
  const { data, isLoading } = useQuery({
    queryKey: ["reviews", eventId],
    queryFn: () => getEventReviews(eventId).then((r) => r.data.data),
  });

  const reviews: Review[] = data?.reviews ?? [];
  const averageRating: number = data?.averageRating ?? 0;
  const total: number = data?.total ?? 0;

  const myReview = reviews.find((r) => r.userId === user?.id);
  const canReview = isAuthenticated && isParticipant && !myReview;

  // ── Mutations ──────────────────────────────────────────────────────────────
  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: ["reviews", eventId] });

  const createMutation = useMutation({
    mutationFn: () => createReview({ eventId, rating, comment }),
    onSuccess: () => {
      toast.success("Review submitted!");
      setRating(5);
      setComment("");
      invalidate();
    },
    onError: (e: any) =>
      toast.error(e.response?.data?.message || "Failed to submit review"),
  });

  const updateMutation = useMutation({
    mutationFn: (id: string) =>
      updateReview(id, { rating: editRating, comment: editComment }),
    onSuccess: () => {
      toast.success("Review updated!");
      setEditingId(null);
      invalidate();
    },
    onError: (e: any) =>
      toast.error(e.response?.data?.message || "Failed to update review"),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteReview(id),
    onSuccess: () => {
      toast.success("Review deleted");
      invalidate();
    },
    onError: (e: any) =>
      toast.error(e.response?.data?.message || "Failed to delete review"),
  });

  const startEdit = (r: Review) => {
    setEditingId(r.id);
    setEditRating(r.rating);
    setEditComment(r.comment);
  };

  // ── Distribution bar ───────────────────────────────────────────────────────
  const dist = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: reviews.filter((r) => r.rating === star).length,
    pct: total > 0 ? (reviews.filter((r) => r.rating === star).length / total) * 100 : 0,
  }));

  return (
    <section className="mt-8 px-6 sm:px-8 pb-8">
      {/* ── Section header ── */}
      <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
        <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
        Reviews
        {total > 0 && (
          <span className="text-sm font-normal text-zinc-500">({total})</span>
        )}
      </h3>

      {/* ── Summary row ── */}
      {total > 0 && (
        <div className="flex flex-col sm:flex-row gap-6 mb-8 p-5 rounded-2xl bg-white/4 border border-white/8">
          <div className="flex flex-col items-center justify-center min-w-[100px]">
            <span className="text-5xl font-black text-white">
              {averageRating.toFixed(1)}
            </span>
            <StarRow value={Math.round(averageRating)} readOnly size={16} />
            <span className="text-xs text-zinc-500 mt-1">{total} review{total !== 1 ? "s" : ""}</span>
          </div>
          <div className="flex-1 space-y-1.5">
            {dist.map(({ star, count, pct }) => (
              <div key={star} className="flex items-center gap-2 text-xs text-zinc-400">
                <span className="w-3 text-right">{star}</span>
                <Star width={11} height={11} className="text-amber-400 fill-amber-400 flex-shrink-0" />
                <div className="flex-1 h-1.5 rounded-full bg-white/10 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-amber-400 transition-all duration-500"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <span className="w-4 text-right">{count}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Write a review ── */}
      {canReview && (
        <div className="mb-8 p-5 rounded-2xl bg-violet-500/8 border border-violet-500/20">
          <p className="text-sm font-semibold text-violet-300 mb-3">Write a review</p>
          <StarRow value={rating} onChange={setRating} />
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Share your experience... (10–500 characters)"
            rows={3}
            className="w-full mt-3 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-zinc-200 placeholder-zinc-600 resize-none focus:outline-none focus:border-violet-500/50 transition-colors"
          />
          <div className="flex items-center justify-between mt-3">
            <span className={`text-xs ${comment.length > 500 ? "text-red-400" : "text-zinc-600"}`}>
              {comment.length}/500
            </span>
            <button
              onClick={() => createMutation.mutate()}
              disabled={
                createMutation.isPending ||
                comment.length < 1 ||
                comment.length > 500
              }
              className="px-5 py-2 rounded-xl text-sm font-semibold bg-violet-600 hover:bg-violet-500 disabled:opacity-40 disabled:cursor-not-allowed text-white transition-colors"
            >
              {createMutation.isPending ? "Submitting..." : "Submit Review"}
            </button>
          </div>
        </div>
      )}

      {/* ── Not a participant notice ── */}
      {isAuthenticated && !isParticipant && !myReview && (
        <p className="text-sm text-zinc-500 mb-6 italic">
          Only event participants can leave a review.
        </p>
      )}

      {/* ── Reviews list ── */}
      {isLoading ? (
        <div className="flex justify-center py-10">
          <div className="w-8 h-8 border-2 border-violet-500/30 border-t-violet-500 rounded-full animate-spin" />
        </div>
      ) : reviews.length === 0 ? (
        <p className="text-center text-zinc-600 py-10 text-sm">
          No reviews yet. Be the first to share your experience!
        </p>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => {
            const isOwner = user?.id === review.userId;
            const isEditing = editingId === review.id;
            // 7-day edit window
            const canEdit =
              isOwner &&
              (Date.now() - new Date(review.createdAt).getTime()) /
                86400000 <=
                7;

            return (
              <div
                key={review.id}
                className="p-5 rounded-2xl bg-white/4 border border-white/8 hover:border-white/12 transition-colors"
              >
                <div className="flex items-start gap-3">
                  <Avatar name={review.user.name} />

                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-0.5">
                      <span className="text-sm font-semibold text-white">
                        {review.user.name}
                      </span>

                      {/* Participant badge */}
                      {review.isParticipant && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/25">
                          <ShieldCheck width={11} height={11} />
                          Verified Attendee
                        </span>
                      )}

                      <span className="text-xs text-zinc-600 ml-auto">
                        {formatRelative(review.createdAt)}
                      </span>
                    </div>

                    {isEditing ? (
                      /* ── Edit form ── */
                      <div className="mt-2 space-y-2">
                        <StarRow value={editRating} onChange={setEditRating} />
                        <textarea
                          value={editComment}
                          onChange={(e) => setEditComment(e.target.value)}
                          rows={3}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-zinc-200 resize-none focus:outline-none focus:border-violet-500/50 transition-colors"
                        />
                        <div className="flex gap-2">
                          <button
                            onClick={() => updateMutation.mutate(review.id)}
                            disabled={
                              updateMutation.isPending ||
                              editComment.length < 1 ||
                              editComment.length > 500
                            }
                            className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-semibold bg-violet-600 hover:bg-violet-500 text-white disabled:opacity-40 transition-colors"
                          >
                            <Check width={13} height={13} />
                            {updateMutation.isPending ? "Saving..." : "Save"}
                          </button>
                          <button
                            onClick={() => setEditingId(null)}
                            className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-semibold bg-white/8 hover:bg-white/12 text-zinc-400 transition-colors"
                          >
                            <X width={13} height={13} />
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      /* ── Display ── */
                      <>
                        <StarRow value={review.rating} readOnly size={14} />
                        <p className="text-sm text-zinc-400 mt-1.5 leading-relaxed">
                          {review.comment}
                        </p>
                        {isOwner && (
                          <div className="flex gap-3 mt-2">
                            {canEdit && (
                              <button
                                onClick={() => startEdit(review)}
                                className="flex items-center gap-1 text-xs text-zinc-500 hover:text-violet-400 transition-colors"
                              >
                                <Pencil width={12} height={12} />
                                Edit
                              </button>
                            )}
                            <button
                              onClick={() => deleteMutation.mutate(review.id)}
                              disabled={deleteMutation.isPending}
                              className="flex items-center gap-1 text-xs text-zinc-500 hover:text-red-400 transition-colors"
                            >
                              <Trash2 width={12} height={12} />
                              Delete
                            </button>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
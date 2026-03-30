/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import {
  Calendar,
  MapPin,
  DollarSign,
  FileText,
  Globe,
  Lock,
  ArrowLeft,
  Sparkles,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";
import { createEvent } from "@/src/services/event.service";


// ── Field wrapper ─────────────────────────────────────────────────────────────
function Field({
  label,
  icon: Icon,
  children,
  hint,
}: {
  label: string;
  icon: any;
  children: React.ReactNode;
  hint?: string;
}) {
  return (
    <div className="flex flex-col gap-2">
      <label className="flex items-center gap-2 text-xs font-semibold text-zinc-400 uppercase tracking-wider">
        <Icon className="w-3.5 h-3.5 text-violet-400" />
        {label}
      </label>
      {children}
      {hint && <p className="text-xs text-zinc-600">{hint}</p>}
    </div>
  );
}

const inputClass =
  "w-full bg-[#0d0d14] border border-white/8 hover:border-white/15 focus:border-violet-500/60 focus:ring-2 focus:ring-violet-500/10 rounded-xl px-4 py-3 text-white placeholder:text-zinc-600 text-sm transition-all outline-none";

// ── Page ──────────────────────────────────────────────────────────────────────
export default function CreateEventPage() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [form, setForm] = useState({
    title: "",
    description: "",
    venue: "",
    date: "",
    type: "PUBLIC",
    registrationFee: 0,
  });

  const mutation = useMutation({
    mutationFn: () =>
      createEvent({
        ...form,
        registrationFee: Number(form.registrationFee),
        date: new Date(form.date).toISOString(),
      }),
    onSuccess: () => {
      toast.success("Event created successfully!");
      queryClient.invalidateQueries({ queryKey: ["my-events"] });
      router.push("/dashboard/my-events");
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Failed to create event");
    },
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) return toast.error("Title is required");
    if (!form.date) return toast.error("Date is required");
    if (!form.venue.trim()) return toast.error("Venue is required");
    mutation.mutate();
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-10">
        <Link
          href="/dashboard/my-events"
          className="w-9 h-9 rounded-xl bg-white/5 hover:bg-white/10 border border-white/8 flex items-center justify-center text-zinc-400 hover:text-white transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight">
            Create Event
          </h1>
          <p className="text-zinc-500 text-sm mt-0.5">
            Fill in the details to launch your event
          </p>
        </div>
      </div>

      {/* Form card */}
      <form
        onSubmit={handleSubmit}
        className="bg-[#111118] border border-white/8 rounded-3xl overflow-hidden shadow-2xl"
      >
        {/* Top accent */}
        <div className="h-px bg-gradient-to-r from-transparent via-violet-500/40 to-transparent" />

        <div className="p-8 space-y-7">
          {/* Title */}
          <Field label="Event Title" icon={FileText}>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Give your event a great name"
              className={inputClass}
            />
          </Field>

          {/* Description */}
          <Field
            label="Description"
            icon={FileText}
            hint="Tell attendees what to expect"
          >
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Describe your event..."
              rows={4}
              className={`${inputClass} resize-none`}
            />
          </Field>

          {/* Date + Venue */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <Field label="Date & Time" icon={Calendar}>
              <input
                type="datetime-local"
                name="date"
                value={form.date}
                onChange={handleChange}
                className={`${inputClass} [color-scheme:dark]`}
              />
            </Field>

            <Field label="Venue" icon={MapPin}>
              <input
                name="venue"
                value={form.venue}
                onChange={handleChange}
                placeholder="Location or online link"
                className={inputClass}
              />
            </Field>
          </div>

          {/* Type + Fee */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <Field label="Event Type" icon={Globe}>
              <select
                name="type"
                value={form.type}
                onChange={handleChange}
                className={inputClass}
              >
                <option value="PUBLIC">🌐 Public</option>
                <option value="PRIVATE">🔒 Private</option>
              </select>
            </Field>

            <Field
              label="Registration Fee ($)"
              icon={DollarSign}
              hint="Set 0 for a free event"
            >
              <input
                type="number"
                name="registrationFee"
                value={form.registrationFee}
                onChange={handleChange}
                min={0}
                step={0.01}
                placeholder="0"
                className={inputClass}
              />
            </Field>
          </div>

          {/* Type hint banner */}
          <div
            className={`flex items-start gap-3 p-4 rounded-xl border text-xs ${
              form.type === "PRIVATE"
                ? "bg-amber-500/5 border-amber-500/20 text-amber-300/70"
                : "bg-emerald-500/5 border-emerald-500/20 text-emerald-300/70"
            }`}
          >
            {form.type === "PRIVATE" ? (
              <Lock className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
            ) : (
              <Globe className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
            )}
            <span>
              {form.type === "PRIVATE"
                ? "Private events are invite-only. You control who joins via invitations."
                : "Public events are visible to everyone and open for anyone to join."}
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="px-8 py-5 bg-white/[0.02] border-t border-white/5 flex items-center justify-between gap-4">
          <Link
            href="/dashboard/my-events"
            className="px-5 py-2.5 text-sm font-medium text-zinc-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-xl border border-white/8 transition-all"
          >
            Cancel
          </Link>

          <button
            type="submit"
            disabled={mutation.isPending}
            className="flex items-center gap-2 px-7 py-2.5 text-sm font-bold text-white bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 rounded-xl shadow-lg shadow-violet-500/20 transition-all hover:scale-105 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            {mutation.isPending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Creating...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                Create Event
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
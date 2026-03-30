/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import {
  User,
  Mail,
  Shield,
  Calendar,
  Save,
  Loader2,
  Trash2,
  AlertTriangle,
  CheckCircle,
} from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "@/src/hooks/useAuth";
import { formatDate } from "@/src/utils/formatDate";
import { useRouter } from "next/navigation";
import { deleteAccount, getMe, updateProfile } from "@/src/services/auth.service";

// ── Shared styles ─────────────────────────────────────────────────────────────
const inputClass =
  "w-full bg-[#0d0d14] border border-white/8 hover:border-white/15 focus:border-violet-500/60 focus:ring-2 focus:ring-violet-500/10 rounded-xl px-4 py-3 text-white placeholder:text-zinc-600 text-sm transition-all outline-none disabled:opacity-50 disabled:cursor-not-allowed";

function Field({
  label,
  icon: Icon,
  children,
}: {
  label: string;
  icon: any;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2">
      <label className="flex items-center gap-2 text-xs font-semibold text-zinc-400 uppercase tracking-wider">
        <Icon className="w-3.5 h-3.5 text-violet-400" />
        {label}
      </label>
      {children}
    </div>
  );
}

// ── Profile Form — only mounts when data is ready ─────────────────────────────
function ProfileForm({ profile }: { profile: any }) {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { logout } = useAuth();

  const [name, setName] = useState(profile.name ?? "");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteInput, setDeleteInput] = useState("");

  const updateMutation = useMutation({
    mutationFn: () => updateProfile({ name }),
    onSuccess: () => {
      toast.success("Profile updated!");
      queryClient.invalidateQueries({ queryKey: ["me"] });
      queryClient.invalidateQueries({ queryKey: ["auth-user"] });
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Failed to update profile");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteAccount,
    onSuccess: async () => {
      toast.success("Account deleted. Goodbye 👋");
      await logout();
      router.push("/");
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Failed to delete account");
    },
  });

  const handleDelete = () => {
    if (deleteInput !== profile.email) {
      toast.error("Email doesn't match");
      return;
    }
    deleteMutation.mutate();
  };

  return (
    <div className="space-y-6">
      {/* ── Profile card ── */}
      <div className="bg-[#111118] border border-white/8 rounded-3xl overflow-hidden shadow-2xl">
        <div className="h-px bg-gradient-to-r from-transparent via-violet-500/40 to-transparent" />

        {/* Avatar + meta */}
        <div className="p-8 border-b border-white/5">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white text-2xl font-black flex-shrink-0 shadow-lg shadow-violet-500/30">
              {profile.name?.charAt(0).toUpperCase() || "U"}
            </div>
            <div>
              <h2 className="text-xl font-black text-white">{profile.name}</h2>
              <p className="text-zinc-500 text-sm">{profile.email}</p>
              <div className="flex items-center gap-2 mt-2">
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                  profile.role === "ADMIN"
                    ? "bg-violet-500/10 text-violet-400 border-violet-500/20"
                    : "bg-zinc-500/10 text-zinc-400 border-zinc-500/20"
                }`}>
                  {profile.role}
                </span>
                {profile.isVerified && (
                  <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    <CheckCircle className="w-3 h-3" /> Verified
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Editable fields */}
        <div className="p-8 space-y-6">
          <Field label="Display Name" icon={User}>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              className={inputClass}
            />
          </Field>

          <Field label="Email Address" icon={Mail}>
            <input
              value={profile.email}
              disabled
              className={inputClass}
            />
            <p className="text-xs text-zinc-600">Email cannot be changed</p>
          </Field>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <Field label="Role" icon={Shield}>
              <input value={profile.role} disabled className={inputClass} />
            </Field>
            <Field label="Member Since" icon={Calendar}>
              <input
                value={formatDate(profile.createdAt)}
                disabled
                className={inputClass}
              />
            </Field>
          </div>
        </div>

        {/* Footer */}
        <div className="px-8 py-5 bg-white/[0.02] border-t border-white/5 flex justify-end">
          <button
            onClick={() => updateMutation.mutate()}
            disabled={updateMutation.isPending || name === profile.name || !name.trim()}
            className="flex items-center gap-2 px-7 py-2.5 text-sm font-bold text-white bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 rounded-xl shadow-lg shadow-violet-500/20 transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            {updateMutation.isPending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Save Changes
              </>
            )}
          </button>
        </div>
      </div>

      {/* ── Danger zone ── */}
      <div className="bg-[#111118] border border-red-500/20 rounded-3xl overflow-hidden">
        <div className="h-px bg-gradient-to-r from-transparent via-red-500/30 to-transparent" />

        <div className="p-8">
          <div className="flex items-start gap-3 mb-6">
            <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-white font-bold">Danger Zone</h3>
              <p className="text-zinc-500 text-sm mt-1">
                Deleting your account is permanent and cannot be undone. All your events, participations and data will be removed.
              </p>
            </div>
          </div>

          {!showDeleteConfirm ? (
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-red-400 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 rounded-xl transition-all"
            >
              <Trash2 className="w-4 h-4" />
              Delete My Account
            </button>
          ) : (
            <div className="space-y-4">
              <div className="p-4 bg-red-500/5 border border-red-500/20 rounded-xl">
                <p className="text-sm text-red-300/80 mb-3">
                  Type your email <span className="font-mono font-bold text-red-400">{profile.email}</span> to confirm deletion:
                </p>
                <input
                  value={deleteInput}
                  onChange={(e) => setDeleteInput(e.target.value)}
                  placeholder="Enter your email to confirm"
                  className="w-full bg-[#0d0d14] border border-red-500/20 focus:border-red-500/50 focus:ring-2 focus:ring-red-500/10 rounded-xl px-4 py-3 text-white placeholder:text-zinc-600 text-sm transition-all outline-none"
                />
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={handleDelete}
                  disabled={deleteMutation.isPending || deleteInput !== profile.email}
                  className="flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-white bg-red-600 hover:bg-red-500 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {deleteMutation.isPending ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Trash2 className="w-4 h-4" />
                  )}
                  Confirm Delete
                </button>
                <button
                  onClick={() => { setShowDeleteConfirm(false); setDeleteInput(""); }}
                  className="px-5 py-2.5 text-sm font-medium text-zinc-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-xl border border-white/8 transition-all"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function ProfilePage() {
  const { data: profile, isLoading } = useQuery({
    queryKey: ["me"],
    queryFn: getMe,
  });

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-black text-white tracking-tight">Profile</h1>
        <p className="text-zinc-500 mt-2 text-sm">Manage your account information</p>
      </div>

      {isLoading ? (
        <div className="bg-[#111118] border border-white/8 rounded-3xl p-8 space-y-6 animate-pulse">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-2xl bg-white/5" />
            <div className="space-y-2 flex-1">
              <div className="h-5 bg-white/5 rounded w-1/3" />
              <div className="h-4 bg-white/5 rounded w-1/2" />
            </div>
          </div>
          <div className="h-12 bg-white/5 rounded-xl" />
          <div className="h-12 bg-white/5 rounded-xl" />
          <div className="grid grid-cols-2 gap-6">
            <div className="h-12 bg-white/5 rounded-xl" />
            <div className="h-12 bg-white/5 rounded-xl" />
          </div>
        </div>
      ) : profile ? (
        <ProfileForm profile={profile} />
      ) : (
        <p className="text-zinc-500 text-sm">Failed to load profile.</p>
      )}
    </div>
  );
}
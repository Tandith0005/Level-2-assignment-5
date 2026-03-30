"use client";

import { useAuth } from "@/src/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { ShieldCheck } from "lucide-react";
import AdminSidebar from "@/src/components/layout/AdminSidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isPending } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isPending && user?.role !== "ADMIN") {
      router.replace("/dashboard");
    }
  }, [user, isPending, router]);

  if (isPending) {
  return (
    <div className="min-h-screen pt-24 flex flex-col items-center justify-center bg-[#0f0a0a]">
      <div className="relative flex flex-col items-center">
        <div className="w-20 h-20 border-4 border-rose-500/10 border-t-rose-500 rounded-full animate-spin" />
        
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <ShieldCheck className="w-8 h-8 text-rose-400 animate-pulse" />
        </div>
      </div>
      <p className="text-rose-400 mt-8 text-sm font-medium tracking-[0.5px] animate-pulse">
        Loading admin overview...
      </p>
    </div>
  );
}

  if (user?.role !== "ADMIN") return null;

  return (
    <div className="flex min-h-screen bg-[#0a0a0f]">
      <AdminSidebar />
      <div className="flex-1 ml-0 lg:ml-72">
        <main className="pt-8 pb-12 px-4 sm:px-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
}
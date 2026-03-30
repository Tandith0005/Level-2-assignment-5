"use client";

import { useEffect } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { CheckCircle, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function PaymentSuccessPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const queryClient = useQueryClient();

  const eventId = params.id as string;
  const sessionId = searchParams.get("session_id");

  useEffect(() => {
    if (sessionId && eventId) {
      // Invalidate event cache so it shows updated status
      queryClient.invalidateQueries({ queryKey: ["event", eventId] });
      
      toast.success("Payment successful! Welcome to the event!", {
        icon: "🎉",
        duration: 4000,
      });

      // Auto redirect to event details after 2.5 seconds
      const timer = setTimeout(() => {
        router.push(`/events/${eventId}`);
      }, 2500);

      return () => clearTimeout(timer);
    }
  }, [sessionId, eventId, router, queryClient]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0a0f] to-[#050508] flex items-center justify-center">
      <div className="text-center max-w-md px-6">
        <div className="mx-auto w-24 h-24 bg-emerald-500/10 rounded-full flex items-center justify-center mb-8">
          <CheckCircle className="w-16 h-16 text-emerald-400" />
        </div>

        <h1 className="text-4xl font-bold text-white mb-4">Payment Successful!</h1>
        <p className="text-zinc-400 text-lg mb-10">
          Thank you for your payment. You are now officially registered for the event.
        </p>

        <div className="flex flex-col gap-4">
          <Link
            href={`/events/${eventId}`}
            className="flex items-center justify-center gap-2 bg-violet-600 hover:bg-violet-500 text-white font-semibold py-4 rounded-2xl transition-all"
          >
            Go to Event Details
            <ArrowRight className="w-5 h-5" />
          </Link>

          <Link
            href="/dashboard"
            className="text-zinc-500 hover:text-white transition-colors text-sm"
          >
            Go to Dashboard →
          </Link>
        </div>
      </div>
    </div>
  );
}
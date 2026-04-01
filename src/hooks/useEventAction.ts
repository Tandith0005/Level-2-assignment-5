"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  User,
  Lock,
  CheckCircle,
  CreditCard,
  Clock,
  DollarSign,
} from "lucide-react";
import toast from "react-hot-toast";
import { joinEvent } from "@/src/services/participant.service";
import { createCheckoutSession } from "@/src/services/payment.service";
import { ActionConfig, EventData } from "../types/event.types";


type PaymentStep = "idle" | "joined" | "redirecting";

function resolveActionConfig(
  eventData: EventData,
  userId: string | undefined,
  isOwner: boolean,
): ActionConfig {
  if (isOwner) {
    return { label: "You're the Organizer", disabled: true, type: "neutral", icon: User, action: null };
  }

  const myParticipant = eventData.participants?.find((p) => p.userId === userId);

  if (myParticipant) {
    if (myParticipant.status === "BANNED")
      return { label: "You've Been Banned", disabled: true, type: "neutral", icon: Lock, action: null };

    if (myParticipant.status === "REJECTED")
      return { label: "Request Rejected", disabled: true, type: "neutral", icon: Lock, action: null };

    if (myParticipant.status === "APPROVED")
      return { label: "You're Going! ✓", disabled: true, type: "success", icon: CheckCircle, action: null };

    if (myParticipant.status === "PENDING" && !myParticipant.isPaid && eventData.registrationFee > 0)
      return { label: "Complete Payment", disabled: false, type: "primary", icon: CreditCard, action: "completePayment" };

    if (myParticipant.status === "PENDING")
      return { label: "Awaiting Approval", disabled: true, type: "neutral", icon: Clock, action: null };
  }

  if (eventData.type === "PRIVATE")
    return { label: "Invitation Only", disabled: true, type: "neutral", icon: Lock, action: null };

  if (eventData.registrationFee > 0)
    return { label: `Pay $${eventData.registrationFee} & Join`, disabled: false, type: "primary", icon: DollarSign, action: "payAndJoin" };

  return { label: "Join Event — It's Free!!", disabled: false, type: "success", icon: CheckCircle, action: "joinFree" };
}

export function useEventAction(eventId: string, eventData: EventData | null, userId: string | undefined, isAuthenticated: boolean) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [paymentStep, setPaymentStep] = useState<PaymentStep>("idle");

  const invalidateEvent = () => {
    queryClient.invalidateQueries({ queryKey: ["event", eventId] });
    queryClient.invalidateQueries({ queryKey: ["notifications-count"] });
    queryClient.invalidateQueries({ queryKey: ["notifications"] });
  };

  const joinMutation = useMutation({
    mutationFn: () => joinEvent(eventId),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onSuccess: (data: any) => {
      if (data.requiresPayment) {
        setPaymentStep("joined");
        toast("Spot reserved! Complete payment to confirm your seat.", { icon: "🎟️" });
      } else {
        toast.success("Successfully joined the event! 🎉");
      }
      invalidateEvent();
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (err: any) => toast.error(err.response?.data?.message || "Failed to join event"),
  });

  const checkoutMutation = useMutation({
    mutationFn: () => createCheckoutSession(eventId),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onSuccess: (data: any) => {
      if (data.url) {
        setPaymentStep("redirecting");
        window.location.href = data.url;
      }
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Failed to create checkout session");
      setPaymentStep("joined");
    },
  });

  const isOwner = !!userId && userId === eventData?.creatorId;
  const actionConfig = eventData ? resolveActionConfig(eventData, userId, isOwner) : null;

  const hasPendingPayment = eventData?.participants?.some(
    (p) => p.userId === userId && !p.isPaid && p.status === "PENDING",
  ) ?? false;

  const isParticipant = eventData?.participants?.some(
    (p) => p.userId === userId && p.status === "APPROVED",
  ) ?? false;

  const handleMainAction = () => {
    if (!isAuthenticated) {
      toast.error("Please login to join this event");
      router.push(`/login?redirect=/events/${eventId}`);
      return;
    }
    if (actionConfig?.action === "completePayment" || actionConfig?.action === "payAndJoin") {
      checkoutMutation.mutate();
    } else if (actionConfig?.action === "joinFree") {
      joinMutation.mutate();
    }
  };

  const isProcessing =
    joinMutation.isPending || checkoutMutation.isPending || paymentStep === "redirecting";

  return {
    actionConfig,
    paymentStep,
    hasPendingPayment,
    isParticipant,
    isOwner,
    isProcessing,
    handleMainAction,
  };
}
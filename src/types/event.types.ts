import { ElementType } from "react";

export interface Participant {
  userId: string;
  status: "PENDING" | "APPROVED" | "REJECTED" | "BANNED";
  isPaid: boolean;
}

export interface EventData {
  id: string;
  title: string;
  description: string;
  date: string;
  venue: string;
  type: "PUBLIC" | "PRIVATE";
  registrationFee: number;
  creatorId: string;
  participants: Participant[];
  creator: {
    name: string;
    email: string;
  };
}

export type ActionType = "joinFree" | "payAndJoin" | "completePayment" | null;
export type ActionVariant = "success" | "primary" | "neutral";

export interface ActionConfig {
  label: string;
  disabled: boolean;
  type: ActionVariant;
  icon: ElementType;
  action: ActionType;
}
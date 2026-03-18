import { ReactNode } from "react";

export type WholesaleRole = "prospect" | "active" | "admin";

export interface WholesaleBenefit {
  title: string;
  description: string;
  icon: ReactNode;
}

export interface WholesalePriceInfo {
  discountLabel: string;
  percentage: number;
}

export interface WholesaleConsignmentStatus {
  isEligible: boolean;
  reason?: string;
}

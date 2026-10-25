// Shared lead types, labels and formatting. The records themselves come from the API (lib/api.ts).

export type Channel =
  | "instagram"
  | "facebook"
  | "whatsapp"
  | "google"
  | "youtube"
  | "website"
  | "linkedin"
  | "csv"
  | "referral"
  | "email"
  | "sms";

export const CHANNEL_LABEL: Record<Channel, string> = {
  instagram: "Instagram",
  facebook: "Facebook",
  whatsapp: "WhatsApp",
  google: "Google Ads",
  youtube: "YouTube",
  website: "Website",
  linkedin: "LinkedIn",
  csv: "CSV import",
  referral: "Referral",
  email: "Email",
  sms: "SMS",
};

/** Channels a lead can be filtered by or added from */
export const LEAD_SOURCES: Channel[] = ["instagram", "facebook", "whatsapp", "google", "youtube", "website", "linkedin", "csv", "referral"];

export const PLATFORMS = ["Shopify", "WooCommerce", "Magento", "Custom", "None"] as const;
export type Platform = (typeof PLATFORMS)[number];

export type Lead = {
  id: string;
  name: string;
  company: string;
  email: string | null;
  phone: string | null;
  domain: string | null;
  city: string | null;
  language: string | null;
  source: Channel;
  /** A pipeline stage id, or "churned" */
  stage: string;
  score: number;
  ownerId: string | null;
  ownerName: string | null;
  platform: Platform;
  storeSize: string | null;
  category: string | null;
  tags: string[];
  utm: { source: string; campaign: string; adset: string; ad: string } | null;
  /** Other channels the same merchant also came in from */
  duplicates: Channel[];
  lastActivity: string | null;
  firstReplyMin: number | null;
  trialDay: number | null;
  createdAt: number;
  updatedAt: number;
  /** When the lead became a paying customer */
  paidAt: number | null;
};

// ---- Formatting ----

/** "25 Oct 2026" */
export const formatDate = (ts: number) => new Date(ts).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });

/** "05:45 PM" */
export const formatTime = (ts: number) => new Date(ts).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true }).toUpperCase();

/** "Just now", "12 min ago", "2 h ago", "5 d ago" */
export function timeAgo(ts: number, now = Date.now()) {
  const min = Math.floor((now - ts) / 60_000);
  if (min < 1) return "Just now";
  if (min < 60) return `${min} min ago`;
  if (min < 24 * 60) return `${Math.floor(min / 60)} h ago`;
  return `${Math.floor(min / (24 * 60))} d ago`;
}

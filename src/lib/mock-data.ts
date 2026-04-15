export type DashboardStats = {
  imagesProcessed: number;
  creditsRemaining: number;
  creditsTotal: number;
  currentPlan: string;
  planStatus: string;
  memberSince: string;
  lastProcessedAt: string;
};

export type HistoryItem = {
  id: string;
  fileName: string;
  fileSize: string;
  dimensions: string;
  status: "Success" | "Failed";
  createdAt: string;
};

export type PlanCard = {
  name: string;
  description: string;
  price: string;
  billingNote: string;
  cta: string;
  badge?: string;
  features: string[];
};

export const dashboardStats: DashboardStats = {
  imagesProcessed: 28,
  creditsRemaining: 72,
  creditsTotal: 100,
  currentPlan: "Starter Monthly",
  planStatus: "Active",
  memberSince: "April 2026",
  lastProcessedAt: "Today, 5 minutes ago",
};

export const historyItems: HistoryItem[] = [
  {
    id: "job_001",
    fileName: "product-headphones.jpg",
    fileSize: "2.4 MB",
    dimensions: "2000 × 2000",
    status: "Success",
    createdAt: "Today, 5 minutes ago",
  },
  {
    id: "job_002",
    fileName: "founder-avatar.png",
    fileSize: "1.1 MB",
    dimensions: "1200 × 1200",
    status: "Success",
    createdAt: "Today, 1 hour ago",
  },
  {
    id: "job_003",
    fileName: "shoe-catalog.webp",
    fileSize: "3.8 MB",
    dimensions: "2400 × 2400",
    status: "Success",
    createdAt: "Yesterday, 8:32 PM",
  },
  {
    id: "job_004",
    fileName: "brand-mark.png",
    fileSize: "680 KB",
    dimensions: "1024 × 1024",
    status: "Failed",
    createdAt: "Yesterday, 11:15 AM",
  },
];

export const subscriptionPlans: PlanCard[] = [
  {
    name: "Starter Monthly",
    description: "Best for solo creators and light ecommerce work.",
    price: "$9",
    billingNote: "/month, includes 100 removals",
    cta: "Choose Starter",
    badge: "Current plan",
    features: [
      "100 AI background removals per month",
      "Personal dashboard and usage history",
      "Standard processing speed",
      "PayPal Sandbox checkout enabled in test flow",
    ],
  },
  {
    name: "Growth Monthly",
    description: "For teams handling frequent product images and marketing creatives.",
    price: "$29",
    billingNote: "/month, includes 500 removals",
    cta: "Upgrade to Growth",
    features: [
      "500 AI background removals per month",
      "Priority processing",
      "Shared team-ready workflow later",
      "PayPal subscription test flow ready",
    ],
  },
  {
    name: "Scale Monthly",
    description: "For heavy-volume stores and agencies needing stable throughput.",
    price: "$79",
    billingNote: "/month, includes 2,000 removals",
    cta: "Talk to sales",
    features: [
      "2,000 AI background removals per month",
      "Faster queue priority",
      "Future API + team seats support",
      "Priority support roadmap",
    ],
  },
];

export const usagePlans: PlanCard[] = [
  {
    name: "10-image pack",
    description: "Good for quick one-off jobs.",
    price: "$4",
    billingNote: "one-time payment",
    cta: "Buy 10 credits",
    features: [
      "10 one-time image removals",
      "Credits never expire in this mock flow",
      "Works alongside monthly subscriptions",
    ],
  },
  {
    name: "50-image pack",
    description: "For short campaigns and launch weeks.",
    price: "$12",
    billingNote: "one-time payment",
    cta: "Buy 50 credits",
    badge: "Most flexible",
    features: [
      "50 one-time image removals",
      "Lower cost per image",
      "Best fit for occasional spikes",
    ],
  },
  {
    name: "200-image pack",
    description: "For teams that want prepaid usage without a subscription.",
    price: "$36",
    billingNote: "one-time payment",
    cta: "Buy 200 credits",
    features: [
      "200 one-time image removals",
      "Best pay-as-you-go value",
      "Useful alongside PayPal Sandbox testing",
    ],
  },
];

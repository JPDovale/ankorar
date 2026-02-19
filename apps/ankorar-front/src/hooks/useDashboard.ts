import { useQuery } from "@tanstack/react-query";
import {
  getDashboardAiUsageRequest,
  parseAiUsageResponse,
  type AiUsageMetrics,
} from "@/services/dashboard/aiUsageRequest";
import {
  getDashboardActivityRequest,
  parseActivityResponse,
  type ActivityMetrics,
} from "@/services/dashboard/activityRequest";
import {
  getDashboardChurnRequest,
  parseChurnResponse,
  type ChurnMetrics,
} from "@/services/dashboard/churnRequest";
import {
  getDashboardMrrRequest,
  parseMrrResponse,
  type MrrMetrics,
} from "@/services/dashboard/mrrRequest";
import {
  getDashboardOpenAiCostsRequest,
  parseOpenAiCostsResponse,
  type OpenAiCostsData,
} from "@/services/dashboard/openaiCostsRequest";
import {
  getDashboardOverviewRequest,
  parseOverviewResponse,
  type OverviewMetrics,
} from "@/services/dashboard/overviewRequest";
import {
  getDashboardSubscriptionsRequest,
  parseSubscriptionsResponse,
  type SubscriptionsBreakdown,
} from "@/services/dashboard/subscriptionsRequest";
import {
  getDashboardUsersRecentRequest,
  parseUsersRecentResponse,
  type UsersRecentData,
} from "@/services/dashboard/usersRecentRequest";

export const dashboardOverviewQueryKey = ["dashboard", "overview"] as const;
export const dashboardUsersRecentQueryKey = ["dashboard", "users-recent"] as const;
export const dashboardChurnQueryKey = ["dashboard", "churn"] as const;
export const dashboardMrrQueryKey = ["dashboard", "mrr"] as const;
export const dashboardSubscriptionsQueryKey = ["dashboard", "subscriptions"] as const;
export const dashboardAiUsageQueryKey = ["dashboard", "ai-usage"] as const;
export const dashboardOpenAiCostsQueryKey = ["dashboard", "openai-costs"] as const;
export const dashboardActivityQueryKey = ["dashboard", "activity"] as const;

async function overviewQueryFn(): Promise<OverviewMetrics | null> {
  const response = await getDashboardOverviewRequest();
  return parseOverviewResponse(response as Parameters<typeof parseOverviewResponse>[0]);
}

async function usersRecentQueryFn(params?: {
  period?: "7d" | "30d";
  limit?: number;
  offset?: number;
}): Promise<UsersRecentData | null> {
  const response = await getDashboardUsersRecentRequest(params);
  return parseUsersRecentResponse(response as Parameters<typeof parseUsersRecentResponse>[0]);
}

async function churnQueryFn(): Promise<ChurnMetrics | null> {
  const response = await getDashboardChurnRequest();
  return parseChurnResponse(response as Parameters<typeof parseChurnResponse>[0]);
}

async function mrrQueryFn(): Promise<MrrMetrics | null> {
  const response = await getDashboardMrrRequest();
  return parseMrrResponse(response as Parameters<typeof parseMrrResponse>[0]);
}

async function subscriptionsQueryFn(): Promise<SubscriptionsBreakdown | null> {
  const response = await getDashboardSubscriptionsRequest();
  return parseSubscriptionsResponse(response as Parameters<typeof parseSubscriptionsResponse>[0]);
}

async function aiUsageQueryFn(): Promise<AiUsageMetrics | null> {
  const response = await getDashboardAiUsageRequest();
  return parseAiUsageResponse(response as Parameters<typeof parseAiUsageResponse>[0]);
}

async function openAiCostsQueryFn(params?: {
  start_time?: number;
  end_time?: number;
  limit?: number;
}): Promise<OpenAiCostsData | null> {
  const response = await getDashboardOpenAiCostsRequest(params);
  return parseOpenAiCostsResponse(response as Parameters<typeof parseOpenAiCostsResponse>[0]);
}

async function activityQueryFn(params?: { period?: "7" | "30" }): Promise<ActivityMetrics | null> {
  const response = await getDashboardActivityRequest(params);
  return parseActivityResponse(response as Parameters<typeof parseActivityResponse>[0]);
}

export function useDashboardOverview() {
  return useQuery({
    queryKey: dashboardOverviewQueryKey,
    queryFn: overviewQueryFn,
    refetchOnWindowFocus: false,
  });
}

export function useDashboardUsersRecent(params?: {
  period?: "7d" | "30d";
  limit?: number;
  offset?: number;
}) {
  return useQuery({
    queryKey: [...dashboardUsersRecentQueryKey, params?.period ?? "30d", params?.limit, params?.offset],
    queryFn: () => usersRecentQueryFn(params),
    refetchOnWindowFocus: false,
  });
}

export function useDashboardChurn() {
  return useQuery({
    queryKey: dashboardChurnQueryKey,
    queryFn: churnQueryFn,
    refetchOnWindowFocus: false,
  });
}

export function useDashboardMrr() {
  return useQuery({
    queryKey: dashboardMrrQueryKey,
    queryFn: mrrQueryFn,
    refetchOnWindowFocus: false,
  });
}

export function useDashboardSubscriptions() {
  return useQuery({
    queryKey: dashboardSubscriptionsQueryKey,
    queryFn: subscriptionsQueryFn,
    refetchOnWindowFocus: false,
  });
}

export function useDashboardAiUsage() {
  return useQuery({
    queryKey: dashboardAiUsageQueryKey,
    queryFn: aiUsageQueryFn,
    refetchOnWindowFocus: false,
  });
}

export function useDashboardOpenAiCosts(params?: {
  start_time?: number;
  end_time?: number;
  limit?: number;
}) {
  return useQuery({
    queryKey: [...dashboardOpenAiCostsQueryKey, params?.start_time, params?.end_time, params?.limit],
    queryFn: () => openAiCostsQueryFn(params),
    refetchOnWindowFocus: false,
  });
}

export function useDashboardActivity(params?: { period?: "7" | "30" }) {
  return useQuery({
    queryKey: [...dashboardActivityQueryKey, params?.period ?? "30"],
    queryFn: () => activityQueryFn(params),
    refetchOnWindowFocus: false,
  });
}

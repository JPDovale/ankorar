import { connection } from "@/services/ankorarApi/axios";

export interface OpenAiCostsData {
  total_amount: number;
  currency: string;
  by_line_item: Record<string, number>;
  by_day: Array<{ date: string; amount: number }>;
  buckets_count: number;
  error?: string;
}

export async function getDashboardOpenAiCostsRequest(params?: {
  start_time?: number;
  end_time?: number;
  limit?: number;
}) {
  const search = new URLSearchParams();
  if (params?.start_time != null) search.set("start_time", String(params.start_time));
  if (params?.end_time != null) search.set("end_time", String(params.end_time));
  if (params?.limit != null) search.set("limit", String(params.limit));
  const q = search.toString();
  return connection.get<OpenAiCostsData>(
    `/v1/dashboard/metrics/openai-costs${q ? `?${q}` : ""}`,
  );
}

export function parseOpenAiCostsResponse(response: {
  data?: OpenAiCostsData & { status?: number };
  status?: number;
}): OpenAiCostsData | null {
  if (
    response.status !== 200 ||
    !response.data ||
    !("total_amount" in response.data)
  )
    return null;
  return response.data as OpenAiCostsData;
}

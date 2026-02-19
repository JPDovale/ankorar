/**
 * Busca custos da organização na OpenAI Usage/Costs API.
 * Usa OPENAI_COSTS_API_KEY (não OPENAI_API_KEY): cada finalidade usa sua própria chave.
 * Ver: https://developers.openai.com/api/reference/resources/organization/subresources/audit_logs/methods/get_costs
 */

export type OpenAiCostResult = {
  object: string;
  amount?: { currency: string; value: number };
  line_item?: string;
  project_id?: string;
};

export type OpenAiCostBucket = {
  start_time: number;
  end_time: number;
  object: string;
  result: OpenAiCostResult[];
};

export type OpenAiCostsResponse = {
  object: "page";
  data: OpenAiCostBucket[];
  has_more: boolean;
  next_page?: string;
};

export type OpenAiCostsSummary = {
  total_amount: number;
  currency: string;
  by_line_item: Record<string, number>;
  by_day: Array<{ date: string; amount: number }>;
  buckets_count: number;
  error?: string;
};

const COSTS_URL = "https://api.openai.com/v1/organization/costs";

export async function getOpenAiCosts(params?: {
  start_time?: number;
  end_time?: number;
  limit?: number;
  group_by?: ("line_item" | "project_id")[];
}): Promise<OpenAiCostsSummary> {
  const apiKey = process.env.OPENAI_COSTS_API_KEY;
  if (!apiKey) {
    return {
      total_amount: 0,
      currency: "usd",
      by_line_item: {},
      by_day: [],
      buckets_count: 0,
      error: "OPENAI_COSTS_API_KEY não configurada (chave dedicada para API de custos; geração de mapas usa OPENAI_API_KEY)",
    };
  }

  const end = params?.end_time ?? Math.floor(Date.now() / 1000);
  const start = params?.start_time ?? end - 30 * 24 * 60 * 60; // 30 dias atrás
  const limit = Math.min(180, Math.max(1, params?.limit ?? 30));
  const groupBy = params?.group_by?.length ? params.group_by : ["line_item"];
  const searchParams = new URLSearchParams({
    start_time: String(start),
    end_time: String(end),
    bucket_width: "1d",
    limit: String(limit),
    group_by: groupBy.join(","),
  });

  try {
    const res = await fetch(`${COSTS_URL}?${searchParams.toString()}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      const text = await res.text();
      const is403 = res.status === 403;
      const isUsagePermission =
        is403 && (text.includes("api.usage.read") || text.includes("insufficient permissions"));
      const errorMessage = isUsagePermission
        ? "A API de custos é de organização e só aceita Admin API Key. Use essa chave em OPENAI_COSTS_API_KEY (não em OPENAI_API_KEY)."
        : `OpenAI API ${res.status}: ${text.slice(0, 200)}`;
      return {
        total_amount: 0,
        currency: "usd",
        by_line_item: {},
        by_day: [],
        buckets_count: 0,
        error: errorMessage,
      };
    }

    const body = (await res.json()) as OpenAiCostsResponse;
    const buckets = body.data ?? [];
    let total_amount = 0;
    const by_line_item: Record<string, number> = {};
    const by_day: Array<{ date: string; amount: number }> = [];
    let currency = "usd";

    for (const bucket of buckets) {
      let bucketAmount = 0;
      for (const r of bucket.result ?? []) {
        const value = r.amount?.value ?? 0;
        total_amount += value;
        bucketAmount += value;
        if (r.amount?.currency) currency = r.amount.currency;
        if (r.line_item) {
          by_line_item[r.line_item] = (by_line_item[r.line_item] ?? 0) + value;
        }
      }
      const date = new Date(bucket.start_time * 1000).toISOString().slice(0, 10);
      by_day.push({ date, amount: Math.round(bucketAmount * 100) / 100 });
    }

    by_day.sort((a, b) => a.date.localeCompare(b.date));

    return {
      total_amount: Math.round(total_amount * 100) / 100,
      currency,
      by_line_item,
      by_day,
      buckets_count: buckets.length,
    };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return {
      total_amount: 0,
      currency: "usd",
      by_line_item: {},
      by_day: [],
      buckets_count: 0,
      error: message,
    };
  }
}

import { OpenAiApiError } from "@/src/infra/errors/OpenAiApiError";
import OpenAI from "openai";

type GenerateJsonInput = {
  client: OpenAI;
  prompt: string;
  model?: string;
};

type GenerateJsonResponse = {
  data: unknown;
};

function safeParseJson(
  raw: string,
): { data: unknown; error: null } | { data: null; error: string } {
  const result = (() => {
    try {
      return { data: JSON.parse(raw) as unknown, error: null as string | null };
    } catch (e) {
      return {
        data: null,
        error: e instanceof Error ? e.message : "Invalid JSON",
      };
    }
  })();
  return result.error
    ? { data: null, error: result.error }
    : { data: result.data, error: null };
}

function serializeOpenAiError(err: unknown): {
  message: string;
  status?: number;
  code?: string;
  responseData?: unknown;
} {
  const message =
    err instanceof Error ? err.message : String(err);
  const out: ReturnType<typeof serializeOpenAiError> = { message };
  if (err && typeof err === "object") {
    if ("status" in err && typeof (err as { status: unknown }).status === "number") {
      out.status = (err as { status: number }).status;
    }
    if ("code" in err && typeof (err as { code: unknown }).code === "string") {
      out.code = (err as { code: string }).code;
    }
    if (
      "response" in err &&
      (err as { response?: { data?: unknown } }).response?.data !== undefined
    ) {
      out.responseData = (err as { response: { data: unknown } }).response.data;
    }
  }
  return out;
}

export function generateJson({
  client,
  prompt,
  model = "gpt-4o-mini",
}: GenerateJsonInput): Promise<GenerateJsonResponse> {
  return client.chat.completions
    .create({
      model,
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
    })
    .then((completion) => {
      const content = completion.choices[0]?.message?.content;
      if (!content || typeof content !== "string") {
        throw new OpenAiApiError("OpenAI returned empty or invalid content", {
          message: "Empty or invalid content",
          responseData: { choices: completion.choices },
        });
      }
      const parsed = safeParseJson(content);
      if (parsed.error != null) {
        throw new OpenAiApiError(parsed.error, {
          message: "JSON parse failed",
          responseData: { raw: content.slice(0, 500) },
        });
      }
      return { data: parsed.data };
    })
    .catch((err) => {
      if (err instanceof OpenAiApiError) {
        throw err;
      }
      const details = serializeOpenAiError(err);
      throw new OpenAiApiError(details.message, details);
    });
}

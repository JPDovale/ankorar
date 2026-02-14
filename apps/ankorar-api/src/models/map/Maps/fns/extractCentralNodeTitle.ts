import { JsonValue } from "../Map";

type ExtractCentralNodeTitleInput = JsonValue[];

type ExtractCentralNodeTitleResponse = string | null;

export function extractCentralNodeTitle(
  content: ExtractCentralNodeTitleInput,
): ExtractCentralNodeTitleResponse {
  const centralNode = content.find((node) => {
    if (typeof node !== "object" || node === null) {
      return false;
    }

    return (node as { type?: unknown }).type === "central";
  });

  if (!centralNode || typeof centralNode !== "object") {
    return null;
  }

  const text = (centralNode as { text?: unknown }).text;

  if (typeof text !== "string") {
    return null;
  }

  const normalizedTitle = text.trim();

  if (!normalizedTitle) {
    return null;
  }

  return normalizedTitle;
}

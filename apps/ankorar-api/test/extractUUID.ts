export function extractUUID(text: string): string {
  const uuidRegex =
    /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/;
  const match = text.match(uuidRegex);

  if (!match) {
    throw new Error("No UUID found in the provided text");
  }

  return match[0];
}

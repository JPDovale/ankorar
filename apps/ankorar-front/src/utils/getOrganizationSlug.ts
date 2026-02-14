export function getOrganizationSlug(name: string, id: string) {
  const letters = name
    .trim()
    .split(/\s+/)
    .map((word) => word[0] ?? "")
    .join("")
    .slice(0, 2)
    .toLowerCase();

  if (letters.length > 0) {
    return letters;
  }

  return id.slice(0, 2).toLowerCase();
}

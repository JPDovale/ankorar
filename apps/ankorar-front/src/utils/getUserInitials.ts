export function getUserInitials(name: string) {
  const initials = name
    .trim()
    .split(/\s+/)
    .map((word) => word[0] ?? "")
    .join("")
    .slice(0, 2)
    .toUpperCase();

  if (initials.length > 0) {
    return initials;
  }

  return "US";
}

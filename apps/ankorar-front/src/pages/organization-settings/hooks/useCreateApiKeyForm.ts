import { useState } from "react";
import type { CreateApiKeyExpiration } from "./useOrganizationApiKeys";

function getDefaultExpiresAtDate(): Date {
  const d = new Date();
  d.setFullYear(d.getFullYear() + 1);
  return d;
}

function toISODateString(date: Date): string {
  return date.toISOString().slice(0, 10);
}

export function useCreateApiKeyForm(
  onSubmit: (expiration: CreateApiKeyExpiration) => Promise<unknown>,
) {
  const [expiresAtDate, setExpiresAtDate] = useState<Date | null>(
    getDefaultExpiresAtDate,
  );
  const [isPermanent, setIsPermanent] = useState(false);

  const today = (() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  })();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const expiration: CreateApiKeyExpiration = isPermanent
      ? "permanent"
      : {
          expires_at:
            expiresAtDate != null
              ? toISODateString(expiresAtDate)
              : toISODateString(getDefaultExpiresAtDate()),
        };
    await onSubmit(expiration);
  };

  return {
    expiresAtDate,
    setExpiresAtDate,
    isPermanent,
    setIsPermanent,
    handleSubmit,
    today,
  };
}

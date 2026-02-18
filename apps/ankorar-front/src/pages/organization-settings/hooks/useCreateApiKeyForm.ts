import { useEffect, useRef, useState } from "react";
import type { CreateApiKeyPayload } from "./useOrganizationApiKeys";

function getDefaultExpiresAtDate(): Date {
  const d = new Date();
  d.setFullYear(d.getFullYear() + 1);
  return d;
}

function toISODateString(date: Date): string {
  return date.toISOString().slice(0, 10);
}

export function useCreateApiKeyForm(
  onSubmit: (payload: CreateApiKeyPayload) => Promise<unknown>,
  availableFeatures: string[],
  dialogOpen: boolean,
) {
  const [expiresAtDate, setExpiresAtDate] = useState<Date | null>(
    getDefaultExpiresAtDate,
  );
  const [isPermanent, setIsPermanent] = useState(false);
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>(() => [
    ...availableFeatures,
  ]);
  const hasSyncedFeaturesRef = useRef(false);

  useEffect(() => {
    if (!dialogOpen) {
      hasSyncedFeaturesRef.current = false;
      return;
    }
    if (availableFeatures.length > 0 && !hasSyncedFeaturesRef.current) {
      hasSyncedFeaturesRef.current = true;
      setSelectedFeatures([...availableFeatures]);
    }
  }, [dialogOpen, availableFeatures]);

  const today = (() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  })();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const expiration = isPermanent
      ? ("permanent" as const)
      : {
          expires_at:
            expiresAtDate != null
              ? toISODateString(expiresAtDate)
              : toISODateString(getDefaultExpiresAtDate()),
        };
    const features =
      selectedFeatures.length > 0 && selectedFeatures.length < availableFeatures.length
        ? selectedFeatures
        : undefined;
    await onSubmit({ expiration, features });
  };

  function toggleFeature(feature: string) {
    setSelectedFeatures((prev) =>
      prev.includes(feature)
        ? prev.filter((f) => f !== feature)
        : [...prev, feature],
    );
  }

  function selectAllFeatures() {
    setSelectedFeatures([...availableFeatures]);
  }

  function deselectAllFeatures() {
    setSelectedFeatures([]);
  }

  return {
    expiresAtDate,
    setExpiresAtDate,
    isPermanent,
    setIsPermanent,
    selectedFeatures,
    setSelectedFeatures,
    toggleFeature,
    selectAllFeatures,
    deselectAllFeatures,
    handleSubmit,
    today,
    availableFeatures,
  };
}

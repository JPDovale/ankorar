"use client";

import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { CreateApiKeyPayload } from "../hooks/useOrganizationApiKeys";
import { useCreateApiKeyForm } from "../hooks/useCreateApiKeyForm";
import { listAvailableApiKeyFeaturesRequest } from "@/services/organizations/listAvailableApiKeyFeaturesRequest";
import { CreateApiKeyFormBody } from "./CreateApiKeyFormBody";

const availableFeaturesQueryKey = ["organization", "api-keys", "available-features"] as const;

type CreateApiKeyDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (payload: CreateApiKeyPayload) => Promise<unknown>;
  isCreating: boolean;
};

export function CreateApiKeyDialog({
  open,
  onOpenChange,
  onSubmit,
  isCreating,
}: CreateApiKeyDialogProps) {
  const { data: availableFeaturesData } = useQuery({
    queryKey: availableFeaturesQueryKey,
    queryFn: async () => {
      const res = await listAvailableApiKeyFeaturesRequest();
      return res;
    },
    enabled: open,
  });

  const availableFeatures = availableFeaturesData?.data?.features ?? [];
  const form = useCreateApiKeyForm(onSubmit, availableFeatures, open);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="min-w-2xl">
        <DialogHeader>
          <DialogTitle>Gerar chave de API</DialogTitle>
          <DialogDescription>
            Defina a data de expiracao, as permissoes e se a chave e permanente.
          </DialogDescription>
        </DialogHeader>

        <form id="create-api-key-form" onSubmit={form.handleSubmit}>
          <CreateApiKeyFormBody
            expiresAtDate={form.expiresAtDate}
            onExpiresAtDateChange={form.setExpiresAtDate}
            isPermanent={form.isPermanent}
            onPermanentChange={form.setIsPermanent}
            availableFeatures={form.availableFeatures}
            selectedFeatures={form.selectedFeatures}
            onToggleFeature={form.toggleFeature}
            onSelectAllFeatures={form.selectAllFeatures}
            onDeselectAllFeatures={form.deselectAllFeatures}
            isCreating={isCreating}
            minDate={form.today}
          />

          <DialogFooter className="mt-6">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onOpenChange(false)}
            >
              Cancelar
            </Button>
            <Button type="submit" size="sm" disabled={isCreating}>
              {isCreating ? "Gerando..." : "Gerar chave"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

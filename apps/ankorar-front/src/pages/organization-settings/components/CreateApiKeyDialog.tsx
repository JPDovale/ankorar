"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { CreateApiKeyExpiration } from "../hooks/useOrganizationApiKeys";
import { useCreateApiKeyForm } from "../hooks/useCreateApiKeyForm";
import { CreateApiKeyFormBody } from "./CreateApiKeyFormBody";

type CreateApiKeyDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (expiration: CreateApiKeyExpiration) => Promise<unknown>;
  isCreating: boolean;
};

export function CreateApiKeyDialog({
  open,
  onOpenChange,
  onSubmit,
  isCreating,
}: CreateApiKeyDialogProps) {
  const form = useCreateApiKeyForm(onSubmit);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="min-w-2xl">
        <DialogHeader>
          <DialogTitle>Gerar chave de API</DialogTitle>
          <DialogDescription>
            Defina a data de expiracao ou marque para chave permanente.
          </DialogDescription>
        </DialogHeader>

        <form id="create-api-key-form" onSubmit={form.handleSubmit}>
          <CreateApiKeyFormBody
            expiresAtDate={form.expiresAtDate}
            onExpiresAtDateChange={form.setExpiresAtDate}
            isPermanent={form.isPermanent}
            onPermanentChange={form.setIsPermanent}
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

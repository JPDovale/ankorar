"use client";

import { Building2 } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Input,
  InputBox,
  InputRoot,
} from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export interface CreateOrganizationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (payload: { name: string }) => Promise<{ success: boolean; organizationId?: string }>;
  isCreating: boolean;
  limitReached: boolean;
  limitLabel?: string;
}

export function CreateOrganizationDialog({
  open,
  onOpenChange,
  onSubmit,
  isCreating,
  limitReached,
  limitLabel,
}: CreateOrganizationDialogProps) {
  const [name, setName] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed || limitReached || isCreating) return;
    const result = await onSubmit({ name: trimmed });
    if (result.success) {
      setName("");
      onOpenChange(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="border-navy-200/50 bg-ds-surface-elevated p-0 shadow-[0_1px_2px_rgba(13,27,42,0.06)] dark:border-navy-700/60 dark:bg-navy-900 sm:max-w-[400px]">
        <div className="rounded-t-xl border-b border-navy-200/40 bg-navy-50/80 px-6 pt-6 pb-4 dark:border-navy-700/60 dark:bg-navy-800/70">
          <div className="flex items-start gap-4">
            <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-amber-400/15 text-amber-600 dark:bg-amber-400/18 dark:text-amber-300">
              <Building2 className="size-5" />
            </div>
            <DialogHeader className="gap-1.5 text-left">
              <DialogTitle className="text-base font-semibold tracking-tight text-navy-900 dark:text-ds-white">
                Nova organização
              </DialogTitle>
              <DialogDescription className="text-sm text-text-secondary">
                Crie uma organização e convide pessoas. Você será o dono e poderá gerenciar membros e permissões.
                {limitLabel != null && (
                  <span className="mt-2 block text-xs text-text-muted">
                    {limitLabel}
                  </span>
                )}
              </DialogDescription>
            </DialogHeader>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5">
          <InputRoot disabled={limitReached || isCreating}>
            <Label
              htmlFor="create-org-name"
              className="text-xs font-medium text-text-secondary"
            >
              Nome da organização
            </Label>
            <InputBox
              data-disabled={limitReached || isCreating}
              className="mt-1.5 h-10"
            >
              <Input
                id="create-org-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex.: Minha equipe, Acme Inc."
                maxLength={256}
                disabled={limitReached || isCreating}
                autoFocus
              />
            </InputBox>
          </InputRoot>

          <DialogFooter className="mt-6 flex flex-row gap-2 border-t border-navy-200/40 pt-5 dark:border-navy-700/60">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onOpenChange(false)}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={!name.trim() || limitReached || isCreating}
            >
              {isCreating ? "Criando…" : "Criar organização"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

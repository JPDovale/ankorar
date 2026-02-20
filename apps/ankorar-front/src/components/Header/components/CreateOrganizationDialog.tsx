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
      <DialogContent className="border-zinc-200/80 bg-white p-0 shadow-[0_1px_2px_rgba(16,24,40,0.06)] sm:max-w-[400px]">
        <div className="rounded-t-xl border-b border-zinc-100 bg-zinc-50/80 px-6 pt-6 pb-4">
          <div className="flex items-start gap-4">
            <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-violet-500/10 text-violet-600">
              <Building2 className="size-5" />
            </div>
            <DialogHeader className="gap-1.5 text-left">
              <DialogTitle className="text-base font-semibold tracking-tight text-zinc-900">
                Nova organização
              </DialogTitle>
              <DialogDescription className="text-sm text-zinc-500">
                Crie uma organização e convide pessoas. Você será o dono e poderá gerenciar membros e permissões.
                {limitLabel != null && (
                  <span className="mt-2 block text-xs text-zinc-400">
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
              className="text-xs font-medium text-zinc-600"
            >
              Nome da organização
            </Label>
            <InputBox
              data-disabled={limitReached || isCreating}
              className="mt-1.5 h-10 border-zinc-300 bg-white transition-colors focus-within:border-violet-400"
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

          <DialogFooter className="mt-6 flex flex-row gap-2 border-t border-zinc-100 pt-5">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="border-zinc-300 text-zinc-700 hover:bg-zinc-50"
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

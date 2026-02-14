import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LoaderCircle, MailPlus } from "lucide-react";
import type { BaseSyntheticEvent } from "react";
import type { UseFormReturn } from "react-hook-form";

interface OrganizationSwitcherInviteFormProps {
  form: UseFormReturn<{ email: string }>;
  isCreatingInvite: boolean;
  onSubmit: (event?: BaseSyntheticEvent) => void;
}

export function OrganizationSwitcherInviteForm({
  form,
  isCreatingInvite,
  onSubmit,
}: OrganizationSwitcherInviteFormProps) {
  return (
    <div className="border-t border-zinc-200 px-3 py-2">
      <div className="mb-1 flex items-center gap-1.5">
        <MailPlus className="size-3.5 text-zinc-500" />
        <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-zinc-500">
          Enviar convite
        </p>
      </div>

      <form className="flex items-center gap-1.5" onSubmit={onSubmit}>
        <Input
          type="email"
          placeholder="email@dominio.com"
          className="h-8 text-xs"
          maxLength={256}
          autoComplete="email"
          {...form.register("email")}
        />
        <Button
          type="submit"
          size="sm"
          className="h-8 gap-1.5 bg-zinc-900 px-2.5 text-xs text-white hover:bg-zinc-800"
          disabled={isCreatingInvite}
        >
          {isCreatingInvite ? (
            <LoaderCircle className="size-3.5 animate-spin" />
          ) : (
            <MailPlus className="size-3.5" />
          )}
          Enviar
        </Button>
      </form>
    </div>
  );
}

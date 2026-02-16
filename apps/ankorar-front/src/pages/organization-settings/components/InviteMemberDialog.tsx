import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input, InputBox, InputError, InputRoot } from "@/components/ui/input";
import { LoaderCircle } from "lucide-react";
import type { UseFormRegister } from "react-hook-form";

interface InviteMemberDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (e: React.FormEvent) => void;
  register: UseFormRegister<{ email: string }>;
  errorMessage: string | undefined;
  isSubmitting: boolean;
}

export function InviteMemberDialog({
  open,
  onOpenChange,
  onSubmit,
  register,
  errorMessage,
  isSubmitting,
}: InviteMemberDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Convidar usuario</DialogTitle>
          <DialogDescription>
            Envie um convite por e-mail para adicionar um novo membro a
            organizacao.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={onSubmit} className="space-y-4">
          <InputRoot disabled={isSubmitting}>
            <label
              htmlFor="invite-member-email"
              className="text-xs font-medium text-zinc-600"
            >
              E-mail
            </label>

            <InputBox
              data-disabled={isSubmitting}
              data-has-error={Boolean(errorMessage)}
              className="mt-1 h-10 border-zinc-300 bg-white transition-colors focus-within:border-violet-400"
            >
              <Input
                id="invite-member-email"
                type="email"
                placeholder="email@dominio.com"
                autoComplete="email"
                maxLength={256}
                disabled={isSubmitting}
                {...register("email")}
              />
            </InputBox>

            {errorMessage && (
              <InputError role="alert">{errorMessage}</InputError>
            )}
          </InputRoot>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button type="submit" size="sm" disabled={isSubmitting}>
              {isSubmitting ? (
                <LoaderCircle className="size-4 animate-spin" />
              ) : (
                "Enviar convite"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

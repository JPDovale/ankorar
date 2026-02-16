import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface CreatedApiKeyDialogProps {
  apiKeyText: string | null;
  onCopy: () => void;
  onDismiss: () => void;
}

export function CreatedApiKeyDialog({
  apiKeyText,
  onCopy,
  onDismiss,
}: CreatedApiKeyDialogProps) {
  const isOpen = apiKeyText !== null;

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) onDismiss();
      }}
    >
      <DialogContent className="min-w-2xl">
        <DialogHeader>
          <DialogTitle>Chave de API criada</DialogTitle>
          <DialogDescription>
            Copie a chave abaixo. Ela nao sera exibida novamente.
          </DialogDescription>
        </DialogHeader>

        <div className="rounded-lg border border-zinc-200 bg-zinc-50 break-all font-mono text-zinc-800 text-xs p-2">
          {apiKeyText}
        </div>

        <DialogFooter>
          <Button variant="outline" size="sm" onClick={onDismiss}>
            Fechar
          </Button>
          <Button size="sm" onClick={onCopy}>
            Copiar chave
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

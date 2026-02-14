import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { LoaderCircle, Trash2 } from "lucide-react";

interface HomeDeleteMapDialogProps {
  mapPendingDeletion: {
    id: string;
    title: string;
  } | null;
  isDeletingMap: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function HomeDeleteMapDialog({
  mapPendingDeletion,
  isDeletingMap,
  onClose,
  onConfirm,
}: HomeDeleteMapDialogProps) {
  return (
    <Dialog
      open={mapPendingDeletion !== null}
      onOpenChange={(isOpen) => {
        if (!isOpen) {
          onClose();
        }
      }}
    >
      <DialogContent className="max-w-sm p-5">
        <DialogHeader>
          <DialogTitle className="text-base">Excluir mapa mental</DialogTitle>
          <DialogDescription className="text-sm">
            Essa ação irá mover o mapa para excluído. Deseja continuar?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant="secondary"
            className="text-xs"
            onClick={onClose}
            disabled={isDeletingMap}
          >
            Cancelar
          </Button>
          <Button
            variant="destructive"
            className="gap-2 text-xs"
            onClick={onConfirm}
            disabled={isDeletingMap}
          >
            {isDeletingMap ? (
              <LoaderCircle className="size-3.5 shrink-0 animate-spin" />
            ) : (
              <Trash2 className="size-3.5 shrink-0" />
            )}
            Excluir
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

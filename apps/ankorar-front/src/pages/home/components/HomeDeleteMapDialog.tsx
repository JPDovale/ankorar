import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AlertTriangle, LoaderCircle, Trash2 } from "lucide-react";

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
  const mapTitle = mapPendingDeletion?.title ?? "mapa selecionado";

  return (
    <Dialog
      open={mapPendingDeletion !== null}
      onOpenChange={(isOpen) => {
        if (!isOpen) {
          onClose();
        }
      }}
    >
      <DialogContent className="max-w-md overflow-hidden border-zinc-200 p-0">
        <div className="border-b border-zinc-200 bg-red-50/60 px-4 py-3">
          <DialogHeader className="gap-1.5">
            <span className="inline-flex size-7 items-center justify-center rounded-lg border border-red-200 bg-white text-red-600">
              <AlertTriangle className="size-4" />
            </span>
            <DialogTitle className="text-base text-zinc-900">Excluir mapa mental</DialogTitle>
            <DialogDescription className="text-xs text-zinc-600">
              Essa ação moverá o mapa para excluído e pode impactar vínculos atuais.
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="space-y-2.5 px-4 py-3">
          <div className="rounded-xl border border-red-200/80 bg-red-50/50 px-2.5 py-2">
            <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-red-700">
              Mapa selecionado
            </p>
            <p className="mt-1 truncate text-sm font-medium text-zinc-900">{mapTitle}</p>
          </div>
        </div>

        <DialogFooter className="border-t border-zinc-200 px-4 py-3">
          <Button
            variant="secondary"
            className="h-8 px-3 text-xs"
            onClick={onClose}
            disabled={isDeletingMap}
          >
            Cancelar
          </Button>
          <Button
            variant="destructive"
            className="h-8 gap-2 px-4 text-xs"
            onClick={onConfirm}
            disabled={isDeletingMap}
          >
            {isDeletingMap && <LoaderCircle className="size-3.5 shrink-0 animate-spin" />}
            {!isDeletingMap && <Trash2 className="size-3.5 shrink-0" />}
            Excluir mapa
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

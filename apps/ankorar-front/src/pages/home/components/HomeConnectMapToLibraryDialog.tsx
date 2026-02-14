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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { LibraryPreview } from "@/services/libraries/listLibrariesRequest";
import { LibraryBig, Link2, LoaderCircle, Network } from "lucide-react";

interface HomeConnectMapToLibraryDialogProps {
  libraries: LibraryPreview[];
  mapPendingLibraryConnection: {
    id: string;
    title: string;
  } | null;
  selectedLibraryId: string;
  onSelectedLibraryIdChange: (libraryId: string) => void;
  isConnectingMapToLibrary: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function HomeConnectMapToLibraryDialog({
  libraries,
  mapPendingLibraryConnection,
  selectedLibraryId,
  onSelectedLibraryIdChange,
  isConnectingMapToLibrary,
  onClose,
  onConfirm,
}: HomeConnectMapToLibraryDialogProps) {
  const mapTitle = mapPendingLibraryConnection?.title ?? "mapa selecionado";

  return (
    <Dialog
      open={mapPendingLibraryConnection !== null}
      onOpenChange={(isOpen) => {
        if (!isOpen) {
          onClose();
        }
      }}
    >
      <DialogContent className="max-w-md overflow-hidden border-zinc-200 p-0">
        <div className="border-b border-zinc-200 bg-zinc-50/70 px-4 py-3">
          <DialogHeader className="gap-1.5">
            <span className="inline-flex size-7 items-center justify-center rounded-lg border border-zinc-200 bg-white text-zinc-700">
              <Network className="size-4" />
            </span>
            <DialogTitle className="text-base text-zinc-900">Vincular biblioteca</DialogTitle>
            <DialogDescription className="text-xs text-zinc-600">
              Associe o mapa a uma biblioteca para facilitar organização por contexto.
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="space-y-2.5 px-4 py-3">
          <div className="rounded-xl border border-zinc-200 bg-zinc-50/60 px-2.5 py-2">
            <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-zinc-500">
              Mapa selecionado
            </p>
            <p className="mt-1 truncate text-sm font-medium text-zinc-900">{mapTitle}</p>
          </div>

          <div className="space-y-1">
            <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-zinc-500">
              Biblioteca de destino
            </p>
            <Select value={selectedLibraryId} onValueChange={onSelectedLibraryIdChange}>
              <SelectTrigger className="h-9 w-full border-zinc-200 bg-white text-sm">
                <SelectValue placeholder="Selecione uma biblioteca" />
              </SelectTrigger>
              <SelectContent align="start">
                {libraries.map((library) => (
                  <SelectItem key={library.id} value={library.id}>
                    <span className="inline-flex items-center gap-2">
                      <LibraryBig className="size-3.5 shrink-0 text-zinc-500" />
                      {library.name}
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter className="border-t border-zinc-200 px-4 py-3">
          <Button
            variant="secondary"
            className="h-8 px-3 text-xs"
            onClick={onClose}
            disabled={isConnectingMapToLibrary}
          >
            Cancelar
          </Button>
          <Button
            className="h-8 gap-2 px-4 text-xs"
            onClick={onConfirm}
            disabled={isConnectingMapToLibrary || !selectedLibraryId}
          >
            {isConnectingMapToLibrary && (
              <LoaderCircle className="size-3.5 shrink-0 animate-spin" />
            )}
            {!isConnectingMapToLibrary && <Link2 className="size-3.5 shrink-0" />}
            Vincular mapa
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

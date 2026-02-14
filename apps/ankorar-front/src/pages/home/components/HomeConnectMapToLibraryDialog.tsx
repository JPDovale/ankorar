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
import { LibraryBig, Link2, LoaderCircle } from "lucide-react";

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
  return (
    <Dialog
      open={mapPendingLibraryConnection !== null}
      onOpenChange={(isOpen) => {
        if (!isOpen) {
          onClose();
        }
      }}
    >
      <DialogContent className="max-w-sm p-5">
        <DialogHeader>
          <DialogTitle className="text-base">Vincular biblioteca</DialogTitle>
          <DialogDescription className="text-sm">
            Selecione uma biblioteca para vincular este mapa mental.
          </DialogDescription>
        </DialogHeader>

        <Select value={selectedLibraryId} onValueChange={onSelectedLibraryIdChange}>
          <SelectTrigger className="w-full">
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

        <DialogFooter>
          <Button
            variant="secondary"
            className="text-xs"
            onClick={onClose}
            disabled={isConnectingMapToLibrary}
          >
            Cancelar
          </Button>
          <Button
            className="gap-2 text-xs"
            onClick={onConfirm}
            disabled={isConnectingMapToLibrary || !selectedLibraryId}
          >
            {isConnectingMapToLibrary ? (
              <LoaderCircle className="size-3.5 shrink-0 animate-spin" />
            ) : (
              <Link2 className="size-3.5 shrink-0" />
            )}
            Vincular
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { LoaderCircle, Plus } from "lucide-react";

interface CreateLibraryDialogProps {
  isCreatingLibrary: boolean;
  isOpen: boolean;
  libraryName: string;
  onCreateLibrary: () => void;
  onLibraryNameChange: (name: string) => void;
  onOpenChange: (isOpen: boolean) => void;
}

export function CreateLibraryDialog({
  isCreatingLibrary,
  isOpen,
  libraryName,
  onCreateLibrary,
  onLibraryNameChange,
  onOpenChange,
}: CreateLibraryDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm p-5">
        <DialogHeader>
          <DialogTitle className="text-base">Criar biblioteca</DialogTitle>
        </DialogHeader>

        <Input
          value={libraryName}
          onChange={(event) => onLibraryNameChange(event.target.value)}
          placeholder="Nome da biblioteca"
          maxLength={256}
          autoFocus
        />

        <DialogFooter>
          <Button
            variant="secondary"
            className="text-xs"
            onClick={() => onOpenChange(false)}
            disabled={isCreatingLibrary}
          >
            Cancelar
          </Button>
          <Button
            className="gap-2 text-xs"
            onClick={onCreateLibrary}
            disabled={isCreatingLibrary}
          >
            {isCreatingLibrary && (
              <LoaderCircle className="size-3.5 shrink-0 animate-spin" />
            )}
            {!isCreatingLibrary && <Plus className="size-3.5 shrink-0" />}
            Criar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

import { CreationActionButton } from "@/components/actions/CreationActionButton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { MapPlus, WandSparkles } from "lucide-react";

interface HomeCreateMapPopoverProps {
  isCreatingMap: boolean;
  isOpen: boolean;
  mapTitle: string;
  onCreateMap: () => void;
  onMapTitleChange: (title: string) => void;
  onOpenChange: (isOpen: boolean) => void;
}

export function HomeCreateMapPopover({
  isCreatingMap,
  isOpen,
  mapTitle,
  onCreateMap,
  onMapTitleChange,
  onOpenChange,
}: HomeCreateMapPopoverProps) {
  return (
    <Popover open={isOpen} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>
        <CreationActionButton
          icon={MapPlus}
          label="Criar mapa mental"
          className="min-w-56"
        />
      </PopoverTrigger>

      <PopoverContent
        align="end"
        sideOffset={8}
        className="w-[22rem] border-zinc-200 p-0"
      >
        <div className="border-b border-zinc-200 bg-zinc-50/70 px-3.5 py-2.5">
          <p className="text-sm font-semibold text-zinc-900">
            Novo mapa mental
          </p>
          <p className="mt-1 text-xs text-zinc-500">
            Defina um nome rápido para começar a organizar ideias.
          </p>
        </div>

        <div className="space-y-2.5 px-3.5 py-3">
          <label className="space-y-1">
            <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-zinc-500">
              Título inicial
            </span>
            <div className="flex items-center gap-2 rounded-lg border border-zinc-200 bg-white px-3 shadow-[0_1px_2px_rgba(16,24,40,0.06)]">
              <WandSparkles className="size-4 shrink-0 text-zinc-500" />
              <Input
                value={mapTitle}
                onChange={(event) => onMapTitleChange(event.target.value)}
                placeholder="seg 15/02 10:30"
                maxLength={160}
                className="h-9 border-0 bg-transparent px-0 text-sm text-zinc-900 placeholder:text-zinc-400"
              />
            </div>
          </label>

          <div className="flex items-center justify-end gap-2 mt-2">
            <Button
              variant="secondary"
              className="h-8 px-3 text-xs"
              onClick={() => onOpenChange(false)}
              disabled={isCreatingMap}
            >
              Cancelar
            </Button>
            <CreationActionButton
              icon={MapPlus}
              label="Criar mapa"
              loading={isCreatingMap}
              loadingLabel="Criando mapa..."
              onClick={onCreateMap}
              disabled={isCreatingMap}
              className="h-8 px-4 text-xs"
            />
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}

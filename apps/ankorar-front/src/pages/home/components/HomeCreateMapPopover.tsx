import { CreationActionButton } from "@/components/actions/CreationActionButton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Toggle } from "@/components/ui/toggle";
import { MapPlus, Sparkles, WandSparkles } from "lucide-react";

interface HomeCreateMapPopoverProps {
  isCreatingMap: boolean;
  isOpen: boolean;
  mapTitle: string;
  mapDescription: string;
  generateWithAi: boolean;
  onCreateMap: () => void;
  onMapTitleChange: (title: string) => void;
  onMapDescriptionChange: (description: string) => void;
  onGenerateWithAiChange: (value: boolean) => void;
  onOpenChange: (isOpen: boolean) => void;
}

export function HomeCreateMapPopover({
  isCreatingMap,
  isOpen,
  mapTitle,
  mapDescription,
  generateWithAi,
  onCreateMap,
  onMapTitleChange,
  onMapDescriptionChange,
  onGenerateWithAiChange,
  onOpenChange,
}: HomeCreateMapPopoverProps) {
  const canSubmit = !generateWithAi || mapDescription.trim().length > 0;

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
            {generateWithAi
              ? "Descreva o conteúdo e a IA gera o mapa."
              : "Defina um nome rápido para começar a organizar ideias."}
          </p>
        </div>

        <div className="space-y-2.5 px-3.5 py-3">
          <div className="flex items-center gap-2">
            <Toggle
              size="sm"
              pressed={generateWithAi}
              onPressedChange={onGenerateWithAiChange}
              aria-label="Gerar com IA"
              className="h-8 gap-1.5 px-2.5 text-xs data-[state=on]:bg-violet-100 data-[state=on]:text-violet-800"
            >
              <Sparkles className="size-3.5" />
              Gerar com IA
            </Toggle>
          </div>

          {generateWithAi && (
            <label className="space-y-1 block">
              <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-zinc-500">
                Descrição do conteúdo
              </span>
              <textarea
                value={mapDescription}
                onChange={(e) => onMapDescriptionChange(e.target.value)}
                placeholder="Ex.: Mapa com as fases do projeto: planejamento, execução, revisão e entrega"
                maxLength={10000}
                rows={3}
                className="w-full resize-none rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 shadow-[0_1px_2px_rgba(16,24,40,0.06)] focus:outline-none focus:ring-2 focus:ring-zinc-300"
              />
            </label>
          )}

          <label className="space-y-1 block">
            <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-zinc-500">
              {generateWithAi ? "Título do mapa (opcional)" : "Título inicial"}
            </span>
            <div className="flex items-center gap-2 rounded-lg border border-zinc-200 bg-white px-3 shadow-[0_1px_2px_rgba(16,24,40,0.06)]">
              <WandSparkles className="size-4 shrink-0 text-zinc-500" />
              <Input
                value={mapTitle}
                onChange={(event) => onMapTitleChange(event.target.value)}
                placeholder={generateWithAi ? "Ex.: Projeto X" : "seg 15/02 10:30"}
                maxLength={256}
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
              icon={generateWithAi ? Sparkles : MapPlus}
              label={generateWithAi ? "Gerar com IA" : "Criar mapa"}
              loading={isCreatingMap}
              loadingLabel={generateWithAi ? "Gerando mapa..." : "Criando mapa..."}
              onClick={onCreateMap}
              disabled={isCreatingMap || !canSubmit}
              className="h-8 px-4 text-xs"
            />
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}

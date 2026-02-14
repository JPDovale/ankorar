import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface LibrariesPageHeaderProps {
  librariesSummaryText: string;
  onCreateLibrary: () => void;
}

export function LibrariesPageHeader({
  librariesSummaryText,
  onCreateLibrary,
}: LibrariesPageHeaderProps) {
  return (
    <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="space-y-1">
        <h1 className="text-xl font-semibold tracking-tight text-zinc-900">
          Bibliotecas
        </h1>
        <p className="text-xs text-zinc-500">{librariesSummaryText}</p>
      </div>

      <Button onClick={onCreateLibrary} className="min-w-56 gap-2 rounded-full">
        <Plus className="size-4" />
        Criar biblioteca
      </Button>
    </header>
  );
}

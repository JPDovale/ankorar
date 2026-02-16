import { useLibraries, useSuspenseLibraries } from "@/hooks/useLibraries";
import { useSuspenseMaps } from "@/hooks/useMaps";
import { useState } from "react";
import { toast } from "sonner";

export function useLibrariesPage() {
  const { data: libraries } = useSuspenseLibraries();
  const { data: maps } = useSuspenseMaps();
  const { createLibrary, isCreatingLibrary } = useLibraries();
  const ownMapIds = new Set(maps.map((map) => map.id));
  const [isCreatePopoverOpen, setIsCreatePopoverOpen] = useState(false);
  const [libraryName, setLibraryName] = useState("");
  const librariesSummaryText = `Você tem ${libraries.length} biblioteca${libraries.length === 1 ? "" : "s"} na organização atual.`;

  function handleCreatePopoverOpenChange(isOpen: boolean) {
    if (isCreatingLibrary) {
      return;
    }

    setIsCreatePopoverOpen(isOpen);
  }

  function handleLibraryNameChange(nextName: string) {
    setLibraryName(nextName);
  }

  async function handleCreateLibrary() {
    const normalizedName = libraryName.trim();

    if (!normalizedName) {
      toast.error("Informe um nome para a biblioteca.");
      return;
    }

    const { success } = await createLibrary({
      name: normalizedName,
    });

    if (!success) {
      return;
    }

    toast.success(`Biblioteca "${normalizedName}" criada com sucesso.`);
    setIsCreatePopoverOpen(false);
    setLibraryName("");
  }

  return {
    handleCreateLibrary,
    handleCreatePopoverOpenChange,
    handleLibraryNameChange,
    isCreatePopoverOpen,
    isCreatingLibrary,
    libraries,
    librariesSummaryText,
    libraryName,
    ownMapIds,
  };
}

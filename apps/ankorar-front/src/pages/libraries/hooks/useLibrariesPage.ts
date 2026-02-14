import { useLibraries, useSuspenseLibraries } from "@/hooks/useLibraries";
import { useState } from "react";
import { toast } from "sonner";

export function useLibrariesPage() {
  const { data: libraries } = useSuspenseLibraries();
  const { createLibrary, isCreatingLibrary } = useLibraries();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [libraryName, setLibraryName] = useState("");
  const librariesSummaryText = `Você tem ${libraries.length} biblioteca${libraries.length === 1 ? "" : "s"} na organização atual.`;

  function handleOpenCreateDialog() {
    setIsCreateDialogOpen(true);
  }

  function handleCreateDialogOpenChange(isOpen: boolean) {
    if (isCreatingLibrary) {
      return;
    }

    setIsCreateDialogOpen(isOpen);
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
    setIsCreateDialogOpen(false);
    setLibraryName("");
  }

  return {
    handleCreateDialogOpenChange,
    handleCreateLibrary,
    handleOpenCreateDialog,
    isCreateDialogOpen,
    isCreatingLibrary,
    libraries,
    librariesSummaryText,
    libraryName,
    setLibraryName,
  };
}

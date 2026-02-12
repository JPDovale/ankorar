import { useCallback } from "react";
import { useMindMapState } from "../../state/mindMap";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { type KeyBind, rootKeyBinds } from "../../config/rootKeyBinds";
import { cn } from "../../lib/utils";

interface KeyboardHelpDialogProps {
  className?: string;
}

export function KeyboardHelpDialog({
  className,
}: KeyboardHelpDialogProps = {}) {
  const helpOpen = useMindMapState((state) => state.helpOpen);
  const setHelpOpen = useMindMapState((state) => state.setHelpOpen);

  const handleOpenChange = useCallback(
    (nextOpen: boolean) => {
      if (nextOpen !== helpOpen) {
        setHelpOpen(nextOpen);
      }
    },
    [helpOpen, setHelpOpen],
  );

  const shortcuts = Object.entries(rootKeyBinds).reduce(
    (acc, [, value]) => [...acc, value],
    [] as KeyBind[],
  );

  return (
    <Dialog open={helpOpen} onOpenChange={handleOpenChange}>
      <DialogContent
        className={cn(
          "h-[520px] max-w-[520px] border-slate-200 bg-white flex flex-col",
          className,
        )}
      >
        <DialogHeader className="gap-1">
          <DialogTitle className="text-lg">Atalhos de teclado</DialogTitle>
          <p className="text-sm text-slate-500">
            Comandos para navegar, editar e controlar o mapa mental.
          </p>
        </DialogHeader>
        <div className="mt-3 min-h-0 flex-1 space-y-2 overflow-y-auto scrollbar -mr-6 pr-6">
          {shortcuts.map((shortcut) => (
            <div
              key={shortcut.shortCut}
              className="flex items-start justify-between gap-4 border-b border-slate-100 pb-2 text-sm last:border-none last:pb-0"
            >
              <span className="rounded-md min-w-fit bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-700">
                {shortcut.shortCut}
              </span>
              <span className="text-right text-slate-600">
                {shortcut.description}
              </span>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}

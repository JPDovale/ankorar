import type { CSSProperties } from "react";
import { useCallback } from "react";
import { useMindMapState } from "../../state/mindMap";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { type KeyBind, rootKeyBinds } from "../../config/rootKeyBinds";
import { cn } from "../../lib/utils";

export interface KeyboardHelpDialogStyleSlots {
  /** Modal content (dialog panel) */
  contentClassName?: string;
  contentStyle?: CSSProperties;
  /** Title ("Atalhos de teclado") */
  titleClassName?: string;
  /** Description paragraph below title */
  descriptionClassName?: string;
  /** Each shortcut row */
  itemClassName?: string;
  /** Shortcut key badge (e.g. "Ctrl + Enter") */
  shortcutKeyClassName?: string;
  /** Shortcut description text */
  shortcutDescriptionClassName?: string;
}

export interface KeyboardHelpDialogProps
  extends KeyboardHelpDialogStyleSlots {}

export function KeyboardHelpDialog({
  contentClassName,
  contentStyle,
  titleClassName,
  descriptionClassName,
  itemClassName,
  shortcutKeyClassName,
  shortcutDescriptionClassName,
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
          contentClassName,
        )}
        style={contentStyle}
      >
        <DialogHeader className="gap-1">
          <DialogTitle
            className={cn("text-lg", titleClassName)}
          >
            Atalhos de teclado
          </DialogTitle>
          <p
            className={cn(
              "text-sm text-slate-500",
              descriptionClassName,
            )}
          >
            Comandos para navegar, editar e controlar o mapa mental.
          </p>
        </DialogHeader>
        <div className="mt-3 min-h-0 flex-1 space-y-2 overflow-y-auto scrollbar -mr-6 pr-6">
          {shortcuts.map((shortcut) => (
            <div
              key={shortcut.shortCut}
              className={cn(
                "flex items-start justify-between gap-4 border-b border-slate-100 pb-2 text-sm last:border-none last:pb-0",
                itemClassName,
              )}
            >
              <span
                className={cn(
                  "rounded-md min-w-fit bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-700",
                  shortcutKeyClassName,
                )}
              >
                {shortcut.shortCut}
              </span>
              <span
                className={cn(
                  "text-right text-slate-600",
                  shortcutDescriptionClassName,
                )}
              >
                {shortcut.description}
              </span>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}

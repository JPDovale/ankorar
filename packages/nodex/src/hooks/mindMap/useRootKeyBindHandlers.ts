import { useEffect } from "react";
import { useShallow } from "zustand/react/shallow";
import { useMindMapState } from "../../state/mindMap";
import { type RootKeyBinds, rootKeyBinds } from "../../config/rootKeyBinds";

export function useRootKeyBindHandlers() {
  const { editingNodeId } = useMindMapState(
    useShallow((state) => ({
      editingNodeId: state.editingNodeId,
    }))
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isEditing = !!editingNodeId;
      let key = e.key;

      if (e.ctrlKey) {
        key = "Ctrl+" + e.key;
      }

      if (e.altKey) {
        key = "Alt+" + e.key;
      }

      const keyBind = rootKeyBinds[key as RootKeyBinds];

      if (keyBind?.skipOnEditing && isEditing) {
        return;
      }

      if (keyBind?.handler) {
        e.preventDefault();
        keyBind.handler();
      }
    };

    const listenerOptions = { capture: true };
    document.addEventListener("keydown", handleKeyDown, listenerOptions);
    return () => {
      document.removeEventListener("keydown", handleKeyDown, listenerOptions);
    };
  }, [editingNodeId]);
}

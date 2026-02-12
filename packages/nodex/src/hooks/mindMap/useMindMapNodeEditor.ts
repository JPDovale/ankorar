import type { FocusEvent, FormEvent, RefObject } from "react";
import { useLayoutEffect } from "react";
import { useMindMapState } from "../../state/mindMap";
import { useMindMapNode } from "./useMindMapNode";
import { useShallow } from "zustand/react/shallow";

type UseMindMapNodeEditorParams = {
  nodeId: string;
  text: string;
  textRef: RefObject<HTMLElement | null>;
};

type UseMindMapNodeEditorResult = {
  onFocus: () => void;
  onBlur: (event: FocusEvent<HTMLElement>) => void;
  onInput: (event: FormEvent<HTMLElement>) => void;
};

export function useMindMapNodeEditor({
  nodeId,
  text,
  textRef,
}: UseMindMapNodeEditorParams): UseMindMapNodeEditorResult {
  const { node } = useMindMapNode({ nodeId });
  const { editingNodeId, setEditingNode, updateNode } = useMindMapState(
    useShallow((state) => ({
      editingNodeId: state.editingNodeId,
      setEditingNode: state.setEditingNode,
      updateNode: state.updateNode,
    }))
  );

  const isEditing = editingNodeId === nodeId;

  useLayoutEffect(() => {
    const element = textRef.current;
    if (!element) {
      return;
    }
    if (!isEditing && element.textContent !== text) {
      element.textContent = text;
    }
  }, [text, textRef, isEditing]);

  useLayoutEffect(() => {
    const element = textRef.current;
    if (!element || !isEditing) {
      return;
    }
    const focusText = () => {
      element.focus();
      const selection = window.getSelection();
      if (!selection) {
        return;
      }
      const range = document.createRange();
      range.selectNodeContents(element);
      range.collapse(false);
      selection.removeAllRanges();
      selection.addRange(range);
    };
    requestAnimationFrame(focusText);
  }, [isEditing, textRef]);

  return {
    onFocus: () => {
      node?.select();
      node?.edit();
    },
    onBlur: () => {
      setEditingNode(null);
    },
    onInput: (event) => {
      if (!node) {
        return;
      }
      const element = (event.currentTarget ??
        textRef.current) as HTMLElement | null;
      node.text = element?.textContent ?? "";
      updateNode(node);
    },
  };
}

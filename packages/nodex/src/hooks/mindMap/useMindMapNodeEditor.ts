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
  const { editingNodeId, setEditingNode, readOnly } = useMindMapState(
    useShallow((state) => ({
      editingNodeId: state.editingNodeId,
      setEditingNode: state.setEditingNode,
      readOnly: state.readOnly,
    })),
  );

  const isEditing = editingNodeId === nodeId;

  useLayoutEffect(() => {
    const element = textRef.current;
    if (!element || element.textContent === text) {
      return;
    }

    if (isEditing) {
      const selection = window.getSelection();
      let cursorOffset = 0;

      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        const preRange = document.createRange();
        preRange.selectNodeContents(element);
        preRange.setEnd(range.startContainer, range.startOffset);
        cursorOffset = preRange.toString().length;
      }

      const oldLen = element.textContent?.length ?? 0;
      const newLen = text.length;
      const delta = newLen - oldLen;

      element.textContent = text;

      if (selection && element.firstChild) {
        const adjustedOffset = Math.min(
          Math.max(0, cursorOffset + delta),
          newLen,
        );
        const range = document.createRange();
        range.setStart(element.firstChild, adjustedOffset);
        range.collapse(true);
        selection.removeAllRanges();
        selection.addRange(range);
      }
    } else {
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
      if (!readOnly) {
        node?.edit();
      }
    },
    onBlur: () => {
      setEditingNode(null);
    },
    onInput: (event) => {
      if (readOnly) {
        return;
      }

      if (!node) {
        return;
      }
      const element = (event.currentTarget ??
        textRef.current) as HTMLElement | null;
      node
        .chain()
        .updateText(element?.textContent ?? "")
        .commit();
    },
  };
}

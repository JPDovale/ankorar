import type { CSSProperties } from "react";
import { useRootMouseHandlers } from "../../hooks/mindMap/useRootMouseHandlers";
import { useMindMapHistoryDebounce } from "../../hooks/mindMap/useMindMapHistoryDebounce";
import { useUpdateCenter } from "../../hooks/mindMap/useUpdateCenter";
import { useMindMapState } from "../../state/mindMap";
import { type ReactNode, useEffect, useRef } from "react";
import { Nodes } from "./Nodes";
import {
  NodeStylePopover,
  type NodeStylePopoverStyleSlots,
} from "./NodeStylePopover";
import { KeyboardHelpDialog } from "./KeyboardHelpDialog";
import { cn } from "../../lib/utils";

/** Slots para estilizar o Board, nós, barra de edição e modal de ajuda */
export interface BoardStyleSlots extends NodeStylePopoverStyleSlots {
  /** Raiz do board */
  className?: string;
  style?: CSSProperties;
  /** Container dos nós (área com transform scale/offset) */
  nodesWrapperClassName?: string;
  nodesWrapperStyle?: CSSProperties;
  /** Nó central */
  centralNodeClassName?: string;
  centralNodeStyle?: CSSProperties;
  centralNodeContentClassName?: string;
  centralNodeContentStyle?: CSSProperties;
  /** Nó padrão (ramo) */
  defaultNodeClassName?: string;
  defaultNodeStyle?: CSSProperties;
  defaultNodeContentClassName?: string;
  defaultNodeContentStyle?: CSSProperties;
  /** Nó de imagem */
  imageNodeClassName?: string;
  imageNodeStyle?: CSSProperties;
  imageNodeContentClassName?: string;
  imageNodeContentStyle?: CSSProperties;
  /** Modal de ajuda (Alt+H): conteúdo do diálogo */
  helpDialogContentClassName?: string;
  helpDialogContentStyle?: CSSProperties;
  /** Modal de ajuda: título */
  helpDialogTitleClassName?: string;
  /** Modal de ajuda: descrição */
  helpDialogDescriptionClassName?: string;
  /** Modal de ajuda: cada linha de atalho */
  helpDialogItemClassName?: string;
  /** Modal de ajuda: badge da tecla */
  helpDialogShortcutKeyClassName?: string;
  /** Modal de ajuda: texto da descrição do atalho */
  helpDialogShortcutDescriptionClassName?: string;
}

export interface BoardProps extends BoardStyleSlots {
  children?: ReactNode;
  /** Optional array of colors applied by branch: each direct child of the central node gets a color, and all its descendants keep the same color. */
  segmentColors?: string[];
}

export function Board({
  children,
  className,
  style,
  nodesWrapperClassName,
  nodesWrapperStyle,
  centralNodeClassName,
  centralNodeStyle,
  centralNodeContentClassName,
  centralNodeContentStyle,
  defaultNodeClassName,
  defaultNodeStyle,
  defaultNodeContentClassName,
  defaultNodeContentStyle,
  imageNodeClassName,
  imageNodeStyle,
  imageNodeContentClassName,
  imageNodeContentStyle,
  contentClassName: nodeStylePopoverContentClassName,
  contentStyle: nodeStylePopoverContentStyle,
  buttonClassName: nodeStylePopoverButtonClassName,
  buttonStyle: nodeStylePopoverButtonStyle,
  toggleItemClassName: nodeStylePopoverToggleItemClassName,
  selectTriggerClassName: nodeStylePopoverSelectTriggerClassName,
  selectContentClassName: nodeStylePopoverSelectContentClassName,
  textColors: nodeStylePopoverTextColors,
  backgroundColors: nodeStylePopoverBackgroundColors,
  segmentColors,
  helpDialogContentClassName,
  helpDialogContentStyle,
  helpDialogTitleClassName,
  helpDialogDescriptionClassName,
  helpDialogItemClassName,
  helpDialogShortcutKeyClassName,
  helpDialogShortcutDescriptionClassName,
}: BoardProps) {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const applySegmentColors = useMindMapState((s) => s.applySegmentColors);
  const nodes = useMindMapState((s) => s.nodes);

  const { ...mouseHandlers } = useRootMouseHandlers({
    rootRef,
  });

  useUpdateCenter({ rootRef });
  useMindMapHistoryDebounce({ delayMs: 3000 });

  useEffect(() => {
    if (segmentColors?.length) {
      applySegmentColors(segmentColors);
    }
  }, [segmentColors, applySegmentColors, nodes]);

  return (
    <div
      data-nodex-root
      className={cn("relative flex-1 overflow-hidden cursor-grab", className)}
      style={style}
      ref={rootRef}
      {...mouseHandlers}
    >
      {children}
      <KeyboardHelpDialog
        contentClassName={helpDialogContentClassName}
        contentStyle={helpDialogContentStyle}
        titleClassName={helpDialogTitleClassName}
        descriptionClassName={helpDialogDescriptionClassName}
        itemClassName={helpDialogItemClassName}
        shortcutKeyClassName={helpDialogShortcutKeyClassName}
        shortcutDescriptionClassName={helpDialogShortcutDescriptionClassName}
      />
      <NodeStylePopover
        contentClassName={nodeStylePopoverContentClassName}
        contentStyle={nodeStylePopoverContentStyle}
        buttonClassName={nodeStylePopoverButtonClassName}
        buttonStyle={nodeStylePopoverButtonStyle}
        toggleItemClassName={nodeStylePopoverToggleItemClassName}
        selectTriggerClassName={nodeStylePopoverSelectTriggerClassName}
        selectContentClassName={nodeStylePopoverSelectContentClassName}
        textColors={nodeStylePopoverTextColors}
        backgroundColors={nodeStylePopoverBackgroundColors}
      />
      <Nodes
        nodesWrapperClassName={nodesWrapperClassName}
        nodesWrapperStyle={nodesWrapperStyle}
        centralNodeClassName={centralNodeClassName}
        centralNodeStyle={centralNodeStyle}
        centralNodeContentClassName={centralNodeContentClassName}
        centralNodeContentStyle={centralNodeContentStyle}
        defaultNodeClassName={defaultNodeClassName}
        defaultNodeStyle={defaultNodeStyle}
        defaultNodeContentClassName={defaultNodeContentClassName}
        defaultNodeContentStyle={defaultNodeContentStyle}
        imageNodeClassName={imageNodeClassName}
        imageNodeStyle={imageNodeStyle}
        imageNodeContentClassName={imageNodeContentClassName}
        imageNodeContentStyle={imageNodeContentStyle}
      />
    </div>
  );
}

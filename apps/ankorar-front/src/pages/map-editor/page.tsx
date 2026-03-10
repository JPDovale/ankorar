import { MapLikeButton } from "@/components/maps/MapLikeButton";
import { SideBar } from "@/components/SideBar";
import { useTheme } from "@/hooks/useTheme";
import { useMapEditorPage } from "@/pages/map-editor/hooks/useMapEditorPage";
import {
  Background,
  Board,
  MindMapHeader,
  MineMap,
  Nodex,
  useMindMapState,
  ZenCard,
  type MindMapNode,
} from "@ankorar/nodex";
import { useCallback, useMemo, useState } from "react";
import { FileText, LoaderCircle, Sparkles } from "lucide-react";
import { NoteNode } from "@/pages/map-editor/components/NoteNode";
import { deepenMapNodeRequest } from "@/services/maps/deepenMapNodeRequest";

export function MapEditorPage() {
  const { isLoadingMap, isReadOnly, map, saveStatus } = useMapEditorPage();
  const { themeMode } = useTheme();
  const isDark = themeMode === "dark";
  const [isDeepening, setIsDeepening] = useState(false);
  const findNode = useMindMapState((s) => s.findNode);
  const findNodeParent = useMindMapState((s) => s.findNodeParent);
  const updateNode = useMindMapState((s) => s.updateNode);

  const getContextPath = useCallback(
    (nodeId: string): string[] => {
      const path: string[] = [];
      let parent = findNodeParent(nodeId);
      while (parent) {
        path.push(parent.text.trim() || "(sem título)");
        parent = findNodeParent(parent.id);
      }
      path.reverse();
      return path;
    },
    [findNodeParent],
  );

  const onDeepenWithAi = useCallback(
    async (node: MindMapNode) => {
      if (!map || isReadOnly || isDeepening) return;
      setIsDeepening(true);
      try {
        const contextPath = getContextPath(node.id);
        const res = await deepenMapNodeRequest({
          mapId: map.id,
          node: {
            id: node.id,
            text: node.text,
            style: node.style ? { color: node.style.color } : undefined,
          },
          contextPath: contextPath.length > 0 ? contextPath : undefined,
        });
        const newChildren = res.data?.newChildren ?? [];
        if (newChildren.length === 0) return;
        const current = findNode(node.id);
        if (!current) return;
        const updatedNode: MindMapNode = {
          ...current,
          childrens: [...current.childrens, ...(newChildren as MindMapNode[])],
        };
        updateNode(updatedNode);
      } catch (e) {
        console.error("Falha ao aprofundar nó com IA", e);
      } finally {
        setIsDeepening(false);
      }
    },
    [map, isReadOnly, isDeepening, findNode, updateNode, getContextPath],
  );

  const addNoteNode = useCallback(
    (node: MindMapNode) => {
      if (!map || isReadOnly) return;
      const makeChildNode = useMindMapState.getState().makeChildNode;
      const updateNode = useMindMapState.getState().updateNode;
      const newChild = makeChildNode(node);
      const noteChild: MindMapNode = {
        ...newChild,
        type: "custom",
        customType: "note",
        customPayload: {},
        text: "Nota",
        style: {
          ...newChild.style,
          w: 200,
          h: 56,
        },
      };
      const parentUpdated = {
        ...node,
        childrens: [...node.childrens, noteChild],
      };
      updateNode(parentUpdated);
    },
    [map, isReadOnly],
  );

  const nodeEditorCustomButtons = useMemo(
    () => [
      {
        key: "gerar-com-ia",
        children: (
          <span
            className="inline-flex items-center justify-center gap-1"
            title="Gerar com IA"
          >
            {isDeepening ? (
              <LoaderCircle className="size-4 animate-spin" aria-hidden />
            ) : (
              <Sparkles className="size-4" aria-hidden />
            )}
          </span>
        ),
        onAction: onDeepenWithAi,
      },
      {
        key: "inserir-nota",
        children: (
          <span
            className="inline-flex items-center justify-center gap-1"
            title="Inserir nota"
          >
            <FileText className="size-4" aria-hidden />
          </span>
        ),
        onAction: addNoteNode,
      },
    ],
    [onDeepenWithAi, isDeepening, addNoteNode],
  );

  const customNodeRenderers = useMemo(
    () => ({ note: NoteNode }),
    [],
  );

  const hasMap = Boolean(map);
  const showLoadingState = isLoadingMap;
  const showNotFoundState = !isLoadingMap && !hasMap;
  const showEditor = !isLoadingMap && hasMap;
  return (
    <div className="h-dvh overflow-hidden bg-ds-surface p-2">
      <div className="flex h-full gap-2">
        <SideBar showExpandControlWhenCollapsed />

        <main className="relative min-w-0 flex-1 overflow-hidden rounded-2xl border border-border bg-card shadow-[0_1px_2px_rgba(16,24,40,0.06)]">
          <div className="h-full w-full p-0">
            {showLoadingState && (
              <section className="flex h-full items-center justify-center bg-card text-sm text-muted-foreground">
                <span className="inline-flex items-center gap-2">
                  <LoaderCircle className="size-4 animate-spin" />
                  Carregando mapa mental...
                </span>
              </section>
            )}

            {showNotFoundState && (
              <section className="flex h-full items-center justify-center bg-card text-sm text-muted-foreground">
                Mapa mental não encontrado.
              </section>
            )}

            {showEditor && map && (
              <Nodex
                className="rounded-none border-0 bg-ds-surface text-foreground shadow-none dark:bg-navy-950 dark:text-navy-100"
                readOnly={isReadOnly}
                nodeEditorCustomButtons={nodeEditorCustomButtons}
                newNodesTextColor={isDark ? "#fafaf8" : null}
                customNodeRenderers={customNodeRenderers}
              >
                <div className="flex h-16 shrink-0 items-center justify-between gap-3 border-b border-border bg-card pr-3">
                  <div className="min-w-0 flex-1">
                    <MindMapHeader
                      title={map.title}
                      className="h-16 border-border bg-card text-foreground"
                      titleClassName="text-sm font-semibold text-foreground"
                      menuTriggerClassName="text-slate-500 hover:bg-slate-100 hover:text-slate-700 dark:text-navy-300 dark:hover:bg-navy-800/70 dark:hover:text-navy-100"
                      popoverContentClassName="border-slate-200 bg-white/95 dark:border-navy-700/70 dark:bg-navy-900/95"
                      menuItemClassName="text-slate-700 hover:bg-slate-100 dark:text-navy-200 dark:hover:bg-navy-800/70"
                      saveStatus={saveStatus}
                      showExportImageButton
                      exportBackgroundColor={isDark ? "#0d1b2a" : "#f5efe4"}
                    />
                  </div>
                  {isReadOnly && (
                    <div className="flex shrink-0 items-center gap-2">
                      <span className="text-xs text-muted-foreground">
                        (visualização)
                      </span>
                      <MapLikeButton
                        mapId={map.id}
                        likesCount={map.likes_count}
                        likedByMe={map.liked_by_me}
                        aria-label={
                          map.liked_by_me
                            ? "Desmarcar gostei do mapa"
                            : "Marcar como gostei do mapa"
                        }
                      />
                    </div>
                  )}
                </div>
                <Board
                  className="bg-ds-surface dark:bg-navy-950"
                  contentClassName="border-amber-200/60 bg-ds-surface-elevated/95 dark:border-navy-700/70 dark:bg-navy-900/95"
                  buttonClassName="border-amber-200/60 bg-ds-surface-elevated text-foreground hover:bg-amber-50 dark:border-navy-700 dark:bg-navy-900 dark:text-navy-200 dark:hover:bg-navy-800/70"
                  toggleItemClassName="dark:data-[state=on]:bg-navy-700 dark:data-[state=on]:text-navy-100"
                  selectTriggerClassName="border-amber-200/60 bg-ds-surface-elevated dark:border-navy-700 dark:bg-navy-900 dark:text-navy-200"
                  selectContentClassName="border-amber-200/60 bg-ds-surface-elevated text-foreground dark:border-navy-700 dark:bg-navy-900 dark:text-navy-200"
                  helpDialogContentClassName="border-amber-200/60 bg-ds-surface-elevated dark:border-navy-700 dark:bg-navy-900"
                  helpDialogTitleClassName="text-foreground dark:text-navy-100"
                  helpDialogDescriptionClassName="text-muted-foreground dark:text-navy-300"
                  helpDialogItemClassName="border-amber-200/60 dark:border-navy-700"
                  helpDialogShortcutKeyClassName="border-amber-200/60 bg-amber-50 text-foreground dark:border-navy-600 dark:bg-navy-800 dark:text-navy-200"
                  helpDialogShortcutDescriptionClassName="text-muted-foreground dark:text-navy-300"
                >
                  <Background
                    className="bg-ds-surface dark:bg-navy-950"
                    style={{
                      backgroundImage: isDark
                        ? "radial-gradient(rgba(197, 212, 224, 0.14) 1px, transparent 1px)"
                        : "radial-gradient(rgba(13, 27, 42, 0.08) 1px, transparent 1px)",
                    }}
                  />
                  <MineMap />
                  <MineMap
                    className={
                      isDark
                        ? "border-navy-700/70 bg-navy-900/75"
                        : "border-amber-200/60 bg-ds-surface-elevated/70"
                    }
                    style={{
                      backgroundColor: isDark
                        ? "rgba(13, 27, 42, 0.78)"
                        : "rgba(250, 250, 248, 0.75)",
                      borderColor: isDark
                        ? "rgba(197, 212, 224, 0.24)"
                        : "rgba(212, 136, 42, 0.22)",
                    }}
                    svgStyle={{
                      opacity: isDark ? 0.95 : 1,
                    }}
                    borderStrokeColor={isDark ? "rgba(197, 212, 224, 0.28)" : "rgba(13, 27, 42, 0.15)"}
                    viewportStrokeColor={
                      isDark ? "rgba(224, 158, 68, 0.45)" : "rgba(212, 136, 42, 0.45)"
                    }
                  />
                  <ZenCard
                    className="border-amber-200/60 bg-ds-surface-elevated/60 text-muted-foreground dark:border-navy-700/70 dark:bg-navy-900/65 dark:text-navy-200"
                    subtitleClassName="text-muted-foreground/70 dark:text-navy-300"
                  />
                </Board>
              </Nodex>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

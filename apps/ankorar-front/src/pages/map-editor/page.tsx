import { MapLikeButton } from "@/components/maps/MapLikeButton";
import { SideBar } from "@/components/SideBar";
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
import { LoaderCircle, Sparkles } from "lucide-react";
import { deepenMapNodeRequest } from "@/services/maps/deepenMapNodeRequest";

export function MapEditorPage() {
  const { isLoadingMap, isReadOnly, map, saveStatus } = useMapEditorPage();
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
    ],
    [onDeepenWithAi, isDeepening],
  );

  const hasMap = Boolean(map);
  const showLoadingState = isLoadingMap;
  const showNotFoundState = !isLoadingMap && !hasMap;
  const showEditor = !isLoadingMap && hasMap;
  return (
    <div className="h-dvh overflow-hidden bg-zinc-100/80 p-2">
      <div className="flex h-full gap-2">
        <SideBar showExpandControlWhenCollapsed />

        <main className="relative min-w-0 flex-1 overflow-hidden rounded-2xl border border-zinc-200/80 bg-white shadow-[0_1px_2px_rgba(16,24,40,0.06)]">
          <div className="h-full w-full p-0">
            {showLoadingState && (
              <section className="flex h-full items-center justify-center bg-white text-sm text-zinc-600">
                <span className="inline-flex items-center gap-2">
                  <LoaderCircle className="size-4 animate-spin" />
                  Carregando mapa mental...
                </span>
              </section>
            )}

            {showNotFoundState && (
              <section className="flex h-full items-center justify-center bg-white text-sm text-zinc-600">
                Mapa mental não encontrado.
              </section>
            )}

            {showEditor && map && (
              <Nodex
                readOnly={isReadOnly}
                nodeEditorCustomButtons={nodeEditorCustomButtons}
              >
                <div className="flex h-16 shrink-0 items-center justify-between gap-3 border-b border-slate-200 bg-white pr-3">
                  <div className="min-w-0 flex-1">
                    <MindMapHeader
                      title={map.title}
                      className="h-16"
                      saveStatus={saveStatus}
                      showExportImageButton
                    />
                  </div>
                  {isReadOnly && (
                    <div className="flex shrink-0 items-center gap-2">
                      <span className="text-xs text-zinc-500">
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
                <Board>
                  <Background />
                  <MineMap />
                  <ZenCard />
                </Board>
              </Nodex>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

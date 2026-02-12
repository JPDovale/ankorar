import { SideBar } from "@/components/SideBar";
import { useMap } from "@/hooks/useMap";
import {
  Background,
  Board,
  clearMindMapHistory,
  MindMapHeader,
  type MindMapSaveStatus,
  MineMap,
  Nodex,
  ZenCard,
  type MindMapNode,
  useMindMapDebounce,
  useMindMapState,
} from "@ankorar/nodex";
import { LoaderCircle } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router";

const initialMindMapState = (() => {
  const state = useMindMapState.getState();

  return {
    nodes: JSON.parse(JSON.stringify(state.nodes)) as MindMapNode[],
    offset: {
      x: state.offset.x,
      y: state.offset.y,
    },
    scale: state.scale,
  };
})();

function getNodesFromContent(content: unknown[]): MindMapNode[] {
  if (!Array.isArray(content)) {
    return [];
  }

  return JSON.parse(JSON.stringify(content)) as MindMapNode[];
}

export function MapEditorPage() {
  const params = useParams<{ map_id: string }>();
  const mapId = params.map_id ?? "";
  const { map, isLoadingMap, updateMapContent, isUpdatingMapContent } = useMap({
    id: mapId,
  });
  const nodes = useMindMapState((state) => state.nodes);
  const [lastPersistedSnapshot, setLastPersistedSnapshot] = useState<{
    mapId: string | null;
    serializedContent: string | null;
  }>({
    mapId: null,
    serializedContent: null,
  });
  const hydratedMapIdRef = useRef<string | null>(null);
  const currentSerializedNodes = JSON.stringify(nodes);
  const lastPersistedSerializedContent =
    map && lastPersistedSnapshot.mapId === map.id
      ? lastPersistedSnapshot.serializedContent
      : map
        ? JSON.stringify(map.content)
        : null;
  const isDirty =
    map !== null &&
    currentSerializedNodes !== (lastPersistedSerializedContent ?? "[]");
  const saveStatus: MindMapSaveStatus = !map
    ? "saved"
    : isUpdatingMapContent
      ? "saving"
      : isDirty
        ? "unsaved"
        : "saved";

  useMindMapDebounce(
    async (nodes) => {
      if (!mapId || !map) {
        return;
      }

      const serializedNodes = JSON.stringify(nodes);

      if (serializedNodes === lastPersistedSerializedContent) {
        return;
      }

      const result = await updateMapContent(nodes);

      if (result.success) {
        setLastPersistedSnapshot({
          mapId,
          serializedContent: serializedNodes,
        });
      }
    },
    {
      delayMs: 3000,
    },
  );

  useEffect(() => {
    if (!map) {
      return;
    }

    if (hydratedMapIdRef.current === map.id) {
      return;
    }

    const nodes = getNodesFromContent(map.content);
    clearMindMapHistory();

    useMindMapState.setState({
      nodes: JSON.parse(JSON.stringify(nodes)) as MindMapNode[],
      offset: {
        x: initialMindMapState.offset.x,
        y: initialMindMapState.offset.y,
      },
      scale: initialMindMapState.scale,
      selectedNodeId: null,
      editingNodeId: null,
      zenMode: false,
      helpOpen: false,
    });
    hydratedMapIdRef.current = map.id;
  }, [map]);

  return (
    <div className="flex h-dvh bg-zinc-100/70">
      <SideBar />

      <main className="h-dvh flex-1 overflow-hidden p-0">
        <div className="h-full w-full p-0">
          {isLoadingMap ? (
            <section className="flex h-full items-center justify-center bg-white text-sm text-zinc-600">
              <span className="inline-flex items-center gap-2">
                <LoaderCircle className="size-4 animate-spin" />
                Carregando mapa mental...
              </span>
            </section>
          ) : !map ? (
            <section className="flex h-full items-center justify-center bg-white text-sm text-zinc-600">
              Mapa mental não encontrado.
            </section>
          ) : (
            <Nodex>
              <MindMapHeader
                title={map.title}
                className="h-16"
                saveStatus={saveStatus}
              />
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
  );
}

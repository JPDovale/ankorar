import { useMap } from "@/hooks/useMap";
import {
  clearMindMapHistory,
  layoutMindMapNodes,
  type MindMapNode,
  type MindMapSaveStatus,
  useMindMapDebounce,
  useMindMapState,
} from "@ankorar/nodex";
import { useEffect, useMemo, useRef, useState } from "react";
import { useParams, useSearchParams } from "react-router";

type LastPersistedSnapshot = {
  mapId: string | null;
  serializedContent: string | null;
};

const initialMindMapState = (() => {
  const state = useMindMapState.getState();

  return {
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

export function useMapEditorPage() {
  const params = useParams<{ map_id: string }>();
  const [searchParams] = useSearchParams();
  const mapId = params.map_id ?? "";
  const requestedViewMode = searchParams.get("mode") === "view";

  const { map, isLoadingMap, updateMapContent, isUpdatingMapContent } = useMap({
    id: mapId,
  });
  const isReadOnly = requestedViewMode || (map ? !map.can_edit : false);
  const nodes = useMindMapState((state) => state.nodes);
  const hydratedMapIdRef = useRef<string | null>(null);

  const [lastPersistedSnapshot, setLastPersistedSnapshot] =
    useState<LastPersistedSnapshot>({
      mapId: null,
      serializedContent: null,
    });

  const currentSerializedNodes = JSON.stringify(nodes);
  const lastPersistedSerializedContent = useMemo(() => {
    if (!map) {
      return null;
    }

    if (lastPersistedSnapshot.mapId === map.id) {
      return lastPersistedSnapshot.serializedContent;
    }

    return JSON.stringify(map.content);
  }, [lastPersistedSnapshot, map]);

  const hasLoadedMap = map !== null;
  const isDirty =
    hasLoadedMap &&
    currentSerializedNodes !== (lastPersistedSerializedContent ?? "[]");

  const saveStatus: MindMapSaveStatus | null =
    hasLoadedMap && !isReadOnly
      ? isUpdatingMapContent
        ? "saving"
        : isDirty
          ? "unsaved"
          : "saved"
      : null;

  useMindMapDebounce(
    async (nextNodes, previewDataUrl) => {
      if (!mapId || !map || isReadOnly) {
        return;
      }
      if (nextNodes.length === 0) {
        return;
      }

      const serializedNodes = JSON.stringify(nextNodes);

      if (serializedNodes === lastPersistedSerializedContent) {
        return;
      }

      const result = await updateMapContent(nextNodes, {
        ...(previewDataUrl != null && { preview: previewDataUrl }),
      });

      if (result.success) {
        setLastPersistedSnapshot({
          mapId,
          serializedContent: serializedNodes,
        });
      }
    },
    {
      delayMs: 2000,
    },
  );

  useEffect(() => {
    if (!map) {
      return;
    }

    if (hydratedMapIdRef.current === map.id) {
      return;
    }

    const rawNodes = getNodesFromContent(map.content);
    const mapNodes = layoutMindMapNodes(rawNodes);
    clearMindMapHistory();

    useMindMapState.setState({
      nodes: mapNodes,
      offset: {
        x: initialMindMapState.offset.x,
        y: initialMindMapState.offset.y,
      },
      scale: initialMindMapState.scale,
      selectedNodeId: null,
      editingNodeId: null,
      zenMode: false,
      helpOpen: false,
      readOnly: isReadOnly,
    });
    hydratedMapIdRef.current = map.id;
  }, [isReadOnly, map]);

  useEffect(() => {
    useMindMapState.getState().setReadOnly(isReadOnly);
  }, [isReadOnly]);

  return {
    isLoadingMap,
    isReadOnly,
    map,
    saveStatus,
  };
}

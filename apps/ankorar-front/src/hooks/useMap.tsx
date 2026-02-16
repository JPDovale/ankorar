import { useCallback } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getMapRequest, type MapDetails } from "@/services/maps/getMapRequest";
import { type MapPreview } from "@/services/maps/listMapsRequest";
import {
  type UpdateMapContentRequestBody,
  updateMapContentRequest,
} from "@/services/maps/updateMapContentRequest";
import { mapsQueryKey } from "@/hooks/useMaps";

interface UseMapProps {
  id: string;
}

interface UpdateMapContentMutationResult {
  success: boolean;
}

type MapNodeType = "default" | "central" | "image";
type SanitizedNode = {
  id: string;
  pos: { x: number; y: number };
  text: string;
  type: MapNodeType;
  style: {
    h: number;
    w: number;
    color: string;
    isBold: boolean;
    padding: { x: number; y: number };
    fontSize: number;
    isItalic: boolean;
    textAlign: "left" | "center" | "right";
    textColor: string;
    wrapperPadding: number;
    backgroundColor: string;
  };
  sequence: number;
  childrens: SanitizedNode[];
  isVisible: boolean;
};

export const mapQueryKey = (id: string) => ["map", id] as const;

function extractUnexpectedErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  return "Não foi possível concluir a operação.";
}

async function getMapByIdQueryFn(id: string): Promise<MapDetails | null> {
  const response = await getMapRequest({
    mapId: id,
  });

  if (response.status === 200 && response.data?.map) {
    return response.data.map;
  }

  return null;
}

function extractCentralNodeTitle(content: unknown[]): string | null {
  const centralNode = content.find((node) => {
    if (typeof node !== "object" || node === null) {
      return false;
    }

    return (node as { type?: unknown }).type === "central";
  });

  if (!centralNode || typeof centralNode !== "object") {
    return null;
  }

  const text = (centralNode as { text?: unknown }).text;

  if (typeof text !== "string") {
    return null;
  }

  const normalizedTitle = text.trim();

  if (!normalizedTitle) {
    return null;
  }

  return normalizedTitle;
}

function toNumber(value: unknown, fallback = 0) {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  return fallback;
}

function toBoolean(value: unknown, fallback = true) {
  if (typeof value === "boolean") {
    return value;
  }

  return fallback;
}

function toString(value: unknown, fallback = "") {
  if (typeof value === "string") {
    return value;
  }

  return fallback;
}

function sanitizeNodeType(type: unknown): MapNodeType {
  if (type === "central" || type === "default" || type === "image") {
    return type;
  }

  return "default";
}

function sanitizeNode(
  node: unknown,
  visited: WeakSet<object>,
): SanitizedNode | null {
  if (typeof node !== "object" || node === null) {
    return null;
  }

  if (visited.has(node)) {
    return null;
  }

  visited.add(node);

  const source = node as Record<string, unknown>;
  const sourcePos =
    typeof source.pos === "object" && source.pos !== null
      ? (source.pos as Record<string, unknown>)
      : {};
  const sourceStyle =
    typeof source.style === "object" && source.style !== null
      ? (source.style as Record<string, unknown>)
      : {};
  const sourcePadding =
    typeof sourceStyle.padding === "object" && sourceStyle.padding !== null
      ? (sourceStyle.padding as Record<string, unknown>)
      : {};
  const childrensRaw = Array.isArray(source.childrens) ? source.childrens : [];
  const textAlign = sourceStyle.textAlign;
  const sanitizedTextAlign =
    textAlign === "left" || textAlign === "center" || textAlign === "right"
      ? textAlign
      : "left";

  const childrens = childrensRaw.reduce<SanitizedNode[]>((acc, child) => {
    const sanitizedChild = sanitizeNode(child, visited);

    if (!sanitizedChild) {
      return acc;
    }

    acc.push(sanitizedChild);
    return acc;
  }, []);

  return {
    id: toString(source.id, ""),
    pos: {
      x: toNumber(sourcePos.x, 0),
      y: toNumber(sourcePos.y, 0),
    },
    text: toString(source.text, ""),
    type: sanitizeNodeType(source.type),
    style: {
      h: toNumber(sourceStyle.h, 36),
      w: toNumber(sourceStyle.w, 91),
      color: toString(sourceStyle.color, "#0f172a"),
      isBold: toBoolean(sourceStyle.isBold, false),
      padding: {
        x: toNumber(sourcePadding.x, 24),
        y: toNumber(sourcePadding.y, 16),
      },
      fontSize: toNumber(sourceStyle.fontSize, 14),
      isItalic: toBoolean(sourceStyle.isItalic, false),
      textAlign: sanitizedTextAlign,
      textColor: toString(sourceStyle.textColor, "#0f172a"),
      wrapperPadding: toNumber(sourceStyle.wrapperPadding, 32),
      backgroundColor: toString(sourceStyle.backgroundColor, "transparent"),
    },
    sequence: toNumber(source.sequence, 0),
    childrens,
    isVisible: toBoolean(source.isVisible, true),
  };
}

function sanitizeMapContent(content: unknown[]): unknown[] {
  const visited = new WeakSet<object>();

  return content.reduce<unknown[]>((acc, node) => {
    const sanitizedNode = sanitizeNode(node, visited);

    if (!sanitizedNode) {
      return acc;
    }

    acc.push(sanitizedNode);

    return acc;
  }, []);
}

async function updateMapContentMutationFn(
  payload: UpdateMapContentRequestBody,
): Promise<UpdateMapContentMutationResult> {
  const response = await updateMapContentRequest(payload);

  if (response.status !== 200) {
    return {
      success: false,
    };
  }

  return {
    success: true,
  };
}

export function useMap({ id }: UseMapProps) {
  const queryClient = useQueryClient();

  const mapQuery = useQuery({
    queryKey: mapQueryKey(id),
    queryFn: () => getMapByIdQueryFn(id),
    enabled: Boolean(id),
    staleTime: 2 * 60 * 1000,
    retry: false,
    refetchOnWindowFocus: false,
  });
  const canEditCurrentMap = mapQuery.data?.can_edit ?? false;

  const updateMapContentMutation = useMutation({
    mutationFn: updateMapContentMutationFn,
    onSuccess: (result, variables) => {
      if (!result.success || !id) {
        return;
      }

      const nextTitle = extractCentralNodeTitle(variables.content);
      const now = new Date().toISOString();

      queryClient.setQueryData<MapDetails | null>(
        mapQueryKey(id),
        (currentMap) => {
          if (!currentMap) {
            return currentMap;
          }

          return {
            ...currentMap,
            title: nextTitle ?? currentMap.title,
            content: variables.content,
            updated_at: now,
          };
        },
      );

      queryClient.setQueryData<MapPreview[] | undefined>(
        mapsQueryKey,
        (currentMaps) => {
          if (!currentMaps) {
            return currentMaps;
          }

          return currentMaps.map((map) => {
            if (map.id !== id) {
              return map;
            }

            return {
              ...map,
              title: nextTitle ?? map.title,
              updated_at: now,
              ...(variables.preview !== undefined && {
                preview: variables.preview,
              }),
            };
          });
        },
      );

      queryClient.invalidateQueries({
        queryKey: mapsQueryKey,
      });
    },
  });

  const updateMapContent = useCallback(
    async (
      content: unknown[],
      options?: { preview?: string | null },
    ): Promise<UpdateMapContentMutationResult> => {
      if (!id) {
        return {
          success: false,
        };
      }

      if (!canEditCurrentMap) {
        return {
          success: false,
        };
      }

      const sanitizedContent = sanitizeMapContent(content);

      return updateMapContentMutation
        .mutateAsync({
          mapId: id,
          content: sanitizedContent,
          ...(options?.preview !== undefined && { preview: options.preview }),
        })
        .catch((error) => {
          console.error(extractUnexpectedErrorMessage(error));

          return {
            success: false,
          };
        });
    },
    [canEditCurrentMap, id, updateMapContentMutation],
  );

  return {
    map: mapQuery.data ?? null,
    isLoadingMap: mapQuery.isPending,
    refetchMap: mapQuery.refetch,
    updateMapContent,
    isUpdatingMapContent: updateMapContentMutation.isPending,
  };
}

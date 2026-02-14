import { SideBar } from "@/components/SideBar";
import { useMapEditorPage } from "@/pages/map-editor/hooks/useMapEditorPage";
import {
  Background,
  Board,
  MindMapHeader,
  MineMap,
  Nodex,
  ZenCard,
} from "@ankorar/nodex";
import { LoaderCircle } from "lucide-react";

export function MapEditorPage() {
  const { isLoadingMap, isReadOnly, map, saveStatus } = useMapEditorPage();
  const hasMap = Boolean(map);
  const showLoadingState = isLoadingMap;
  const showNotFoundState = !isLoadingMap && !hasMap;
  const showEditor = !isLoadingMap && hasMap;
  let mapTitle = "";

  if (map) {
    mapTitle = map.title;

    if (isReadOnly) {
      mapTitle = `${mapTitle} (visualização)`;
    }
  }

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
              <Nodex readOnly={isReadOnly}>
                <MindMapHeader
                  title={mapTitle}
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
    </div>
  );
}

import {
  Background,
  Board,
  MindMapHeader,
  MineMap,
  Nodex,
  ZenCard,
  useMindMapDebounce,
} from "@ankorar/nodex";

export function MindMapPage() {
  useMindMapDebounce((_nodes, _previewDataUrl) => undefined, {
    delayMs: 3000,
  });

  return (
    <section className="h-[calc(100dvh-11rem)] min-h-[38rem]">
      <Nodex>
        <MindMapHeader title="Mind Map" />
        <Board>
          <Background />
          <MineMap />
          <ZenCard />
        </Board>
      </Nodex>
    </section>
  );
}

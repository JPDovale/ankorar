import { useSuspenseNotesGraph } from "@/hooks/useNotesGraph";
import { NotesGraphCanvas } from "./NotesGraphCanvas";

export function NotesGraphContent() {
  const { data } = useSuspenseNotesGraph();

  return <NotesGraphCanvas nodes={data.nodes} edges={data.edges} />;
}

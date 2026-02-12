import { useMindMapHistory, createMindMapSnapshot } from "../../state/mindMapHistory";
import { useMindMapState } from "../../state/mindMap";

export const handleRedoRootKeyBind = () => {
  const state = useMindMapState.getState();
  const current = createMindMapSnapshot({
    nodes: state.nodes,
    selectedNodeId: state.selectedNodeId,
    editingNodeId: state.editingNodeId,
    offset: state.offset,
    scale: state.scale,
  });

  useMindMapHistory.getState().redo(current, (snapshot) => {
    useMindMapState.setState({
      nodes: snapshot.nodes,
      selectedNodeId: snapshot.selectedNodeId,
      editingNodeId: snapshot.editingNodeId,
      offset: snapshot.offset,
      scale: snapshot.scale,
    });
  });
};

import { useMindMapState } from "../../state/mindMap";

export const handleAltEKeyBind = () => {
  const { showAllNodes } = useMindMapState.getState();
  showAllNodes();
};

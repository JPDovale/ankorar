import { useMindMapState } from "../../state/mindMap";

export const handleAltWKeyBind = () => {
  const { hideNonCentralChildren } = useMindMapState.getState();
  hideNonCentralChildren();
};

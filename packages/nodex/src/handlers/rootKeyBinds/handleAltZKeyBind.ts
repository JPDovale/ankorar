import { useMindMapState } from "../../state/mindMap";

export const handleAltZKeyBind = () => {
  const { zenMode, setZenMode } = useMindMapState.getState();
  setZenMode(!zenMode);
};

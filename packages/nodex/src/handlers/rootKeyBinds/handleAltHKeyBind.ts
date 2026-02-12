import { useMindMapState } from "../../state/mindMap";

export const handleAltHKeyBind = () => {
  const { setHelpOpen, helpOpen } = useMindMapState.getState();
  setHelpOpen(!helpOpen);
};

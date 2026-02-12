import { useMindMapState } from "../../state/mindMap";

export const handleMoveByWorldKeyBind = (x: number, y: number) => {
  const { offset, setOffset } = useMindMapState.getState();
  setOffset({ x: offset.x + x, y: offset.y + y });
};

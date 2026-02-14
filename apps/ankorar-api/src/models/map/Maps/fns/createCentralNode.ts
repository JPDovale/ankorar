import { JsonValue } from "../Map";

type CreateCentralNodeInput = string;

type CreateCentralNodeResponse = JsonValue;

export function createCentralNode(title: CreateCentralNodeInput): CreateCentralNodeResponse {
  return {
    id: "1",
    pos: {
      x: 0,
      y: 0,
    },
    text: title,
    type: "central",
    style: {
      h: 68,
      w: 308,
      color: "#0f172a",
      isBold: true,
      padding: {
        x: 96,
        y: 32,
      },
      fontSize: 24,
      isItalic: false,
      textAlign: "left",
      textColor: "#0f172a",
      wrapperPadding: 4,
      backgroundColor: "#ffffff",
    },
    sequence: 0,
    childrens: [],
    isVisible: true,
    parent: null,
  };
}

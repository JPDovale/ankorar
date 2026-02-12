import { handleAltEKeyBind } from "../handlers/rootKeyBinds/handleAltEKeyBind";
import { handleAltHKeyBind } from "../handlers/rootKeyBinds/handleAltHKeyBind";
import { handleAltWKeyBind } from "../handlers/rootKeyBinds/handleAltWKeyBind";
import { handleAltZKeyBind } from "../handlers/rootKeyBinds/handleAltZKeyBind";
import { handleArrowHorizontalRootKeyBind } from "../handlers/rootKeyBinds/handleArrowHorizontalRootKeyBind";
import { handleArrowVerticalRootKeyBind } from "../handlers/rootKeyBinds/handleArrowVerticalRootKeyBind";
import { handleBackEspaceKeyBind } from "../handlers/rootKeyBinds/handleBackEspaceKeyBind";
import { handleEscapeKeyBind } from "../handlers/rootKeyBinds/handleEscapeKeyBind";
import { handleEnterRootKeyBind } from "../handlers/rootKeyBinds/handleEnterRootKeyBind";
import { handleERootKeyBind } from "../handlers/rootKeyBinds/handleERootKeyBind";
import { handleEspaceKeyBind } from "../handlers/rootKeyBinds/handleEspaceKeyBind";
import { handleMoveByWorldKeyBind } from "../handlers/rootKeyBinds/handleMoveByWorldKeyBind";
import { handleTabRootKeyBind } from "../handlers/rootKeyBinds/handleTabRootKeyBind";
import { handleTransformNodeKeyBind } from "../handlers/rootKeyBinds/handleTransformNodeKeyBind";
import { handleRedoRootKeyBind } from "../handlers/rootKeyBinds/handleRedoRootKeyBind";
import { handleUndoRootKeyBind } from "../handlers/rootKeyBinds/handleUndoRootKeyBind";
import { handleZoomByKeyBind } from "../handlers/rootKeyBinds/handleZoonByKeyBind";

export type KeyBind = {
  description: string;
  shortCut: string;
  handler: () => void;
  skipOnEditing: boolean;
};

export const rootKeyBinds: { [x: string]: KeyBind } = {
  ArrowLeft: {
    description: "Seleciona o node à esquerda ou o node pai.",
    shortCut: "Seta esquerda",
    handler: () => handleArrowHorizontalRootKeyBind("left"),
    skipOnEditing: true,
  },
  ArrowRight: {
    description: "Seleciona o node à direita ou o node pai.",
    shortCut: "Seta direita",
    handler: () => handleArrowHorizontalRootKeyBind("right"),
    skipOnEditing: true,
  },
  ArrowUp: {
    description: "Seleciona o node acima ou o node pai.",
    shortCut: "Seta para cima",
    handler: () => handleArrowVerticalRootKeyBind("up"),
    skipOnEditing: true,
  },
  ArrowDown: {
    description: "Seleciona o node abaixo ou o node pai.",
    shortCut: "Seta para baixo",
    handler: () => handleArrowVerticalRootKeyBind("down"),
    skipOnEditing: true,
  },
  Enter: {
    description: "Cria um node irmão e entra em edição.",
    shortCut: "Enter",
    handler: () => handleEnterRootKeyBind(),
    skipOnEditing: true,
  },
  "Ctrl+Enter": {
    description: "Cria um node irmão e entra em edição.",
    shortCut: "Ctrl + Enter",
    handler: () => handleEnterRootKeyBind(),
    skipOnEditing: false,
  },
  Tab: {
    description: "Cria um node filho e entra em edição.",
    shortCut: "Tab",
    handler: () => handleTabRootKeyBind(),
    skipOnEditing: false,
  },
  e: {
    description: "Alterna a visibilidade dos filhos do node selecionado.",
    shortCut: "E",
    handler: () => handleERootKeyBind(),
    skipOnEditing: true,
  },
  "Ctrl+=": {
    description: "Aumenta o zoom.",
    shortCut: "Ctrl + =",
    handler: () => handleZoomByKeyBind(0.1),
    skipOnEditing: false,
  },
  "Ctrl++": {
    description: "Aumenta o zoom.",
    shortCut: "Ctrl + +",
    handler: () => handleZoomByKeyBind(0.1),
    skipOnEditing: false,
  },
  "Ctrl+-": {
    description: "Diminui o zoom.",
    shortCut: "Ctrl + -",
    handler: () => handleZoomByKeyBind(-0.1),
    skipOnEditing: false,
  },
  "Alt+ArrowLeft": {
    description: "Move o mapa para a esquerda.",
    shortCut: "Alt + Seta esquerda",
    handler: () => handleMoveByWorldKeyBind(80, 0),
    skipOnEditing: false,
  },
  "Alt+ArrowRight": {
    description: "Move o mapa para a direita.",
    shortCut: "Alt + Seta direita",
    handler: () => handleMoveByWorldKeyBind(-80, 0),
    skipOnEditing: false,
  },
  "Alt+ArrowUp": {
    description: "Move o mapa para cima.",
    shortCut: "Alt + Seta para cima",
    handler: () => handleMoveByWorldKeyBind(0, 80),
    skipOnEditing: false,
  },
  "Alt+ArrowDown": {
    description: "Move o mapa para baixo.",
    shortCut: "Alt + Seta para baixo",
    handler: () => handleMoveByWorldKeyBind(0, -80),
    skipOnEditing: false,
  },
  "Alt+e": {
    description: "Mostra todos os nodes.",
    shortCut: "Alt + E",
    handler: () => handleAltEKeyBind(),
    skipOnEditing: true,
  },
  "Alt+w": {
    description: "Oculta os nodes que não são filhos do node central.",
    shortCut: "Alt + W",
    handler: () => handleAltWKeyBind(),
    skipOnEditing: true,
  },
  "Alt+h": {
    description: "Abre ou fecha a ajuda.",
    shortCut: "Alt + H",
    handler: () => handleAltHKeyBind(),
    skipOnEditing: false,
  },
  "Alt+z": {
    description: "Ativa ou desativa o modo zen.",
    shortCut: "Alt + Z",
    handler: () => handleAltZKeyBind(),
    skipOnEditing: false,
  },
  "Ctrl+b": {
    description: "Alterna o texto em negrito.",
    shortCut: "Ctrl + B",
    handler: () => handleTransformNodeKeyBind(["bold"]),
    skipOnEditing: true,
  },
  "Ctrl+i": {
    description: "Alterna o texto em itálico.",
    shortCut: "Ctrl + I",
    handler: () => handleTransformNodeKeyBind(["italic"]),
    skipOnEditing: true,
  },
  "Ctrl+p": {
    description: "Transforma o node em imagem e entra em edição.",
    shortCut: "Ctrl + P",
    handler: () => handleTransformNodeKeyBind(["image"]),
    skipOnEditing: false,
  },
  "Ctrl+z": {
    description: "Desfaz a última alteração.",
    shortCut: "Ctrl + Z",
    handler: () => handleUndoRootKeyBind(),
    skipOnEditing: false,
  },
  "Ctrl+y": {
    description: "Refaz a última alteração desfeita.",
    shortCut: "Ctrl + Y",
    handler: () => handleRedoRootKeyBind(),
    skipOnEditing: false,
  },
  Escape: {
    description: "Sai da edição e remove o node vazio.",
    shortCut: "Esc",
    handler: () => handleEscapeKeyBind(),
    skipOnEditing: false,
  },
  Backspace: {
    description: "Remove o node selecionado.",
    shortCut: "Backspace",
    handler: () => handleBackEspaceKeyBind(),
    skipOnEditing: true,
  },
  " ": {
    description: "Entra em edição do node selecionado.",
    shortCut: "Espaço",
    handler: () => handleEspaceKeyBind(),
    skipOnEditing: true,
  },
} as const;

export type RootKeyBinds = keyof typeof rootKeyBinds;

import { JsonValue } from "../Map";
import { buildDeepenPrompt } from "./buildDeepenPrompt";
import { normalizeDeepenNodesFromAi } from "./normalizeDeepenNodesFromAi";

type TreeNode = {
  id?: string;
  text?: string;
  type?: string;
  style?: { color?: string };
  childrens?: TreeNode[];
  [key: string]: unknown;
};

function isTreeNode(value: unknown): value is TreeNode {
  return value !== null && typeof value === "object" && "childrens" in value;
}

function deepCloneNode(node: TreeNode): TreeNode {
  const clone: TreeNode = { ...node };
  if (Array.isArray(clone.childrens) && clone.childrens.length > 0) {
    clone.childrens = clone.childrens.map((c) =>
      isTreeNode(c) ? deepCloneNode(c) : c,
    );
  } else {
    clone.childrens = [];
  }
  return clone;
}

function collectLeavesWithPath(
  nodes: TreeNode[],
  pathFromRoot: string[],
): Array<{ node: TreeNode; contextPath: string[] }> {
  const leaves: Array<{ node: TreeNode; contextPath: string[] }> = [];
  for (const node of nodes) {
    if (!isTreeNode(node)) continue;
    const nodeText =
      typeof node.text === "string" ? node.text.trim() || "(sem título)" : "";
    const parentPath = pathFromRoot;
    const childrens = Array.isArray(node.childrens) ? node.childrens : [];
    if (childrens.length === 0) {
      leaves.push({ node, contextPath: parentPath });
    } else {
      const childPath = [...pathFromRoot, nodeText];
      leaves.push(
        ...collectLeavesWithPath(
          childrens.filter((c): c is TreeNode => isTreeNode(c)),
          childPath,
        ),
      );
    }
  }
  return leaves;
}

export type DeepenAllLeafNodesDeps = {
  generateJson: (params: {
    client: unknown;
    prompt: string;
  }) => Promise<{ data: unknown }>;
  client: unknown;
};

/**
 * For each leaf node in the map tree, calls the deepen AI and appends the
 * generated children to that node. Modifies a deep clone of content; does not
 * mutate the original. Returns the expanded content ready to persist.
 */
export async function deepenAllLeafNodes(
  content: JsonValue[],
  deps: DeepenAllLeafNodesDeps,
): Promise<JsonValue[]> {
  if (!Array.isArray(content) || content.length === 0) {
    return content;
  }

  const roots = content.filter((c): c is TreeNode => isTreeNode(c));
  if (roots.length === 0) return content;

  const clonedRoots = roots.map((r) => deepCloneNode(r));
  const leaves = collectLeavesWithPath(clonedRoots, []).filter(
    ({ node }) => typeof node.text === "string" && node.text.trim().length > 0,
  );

  const results = await Promise.all(
    leaves.map(async ({ node, contextPath }) => {
      const nodeText = (node.text as string).trim();
      const prompt = buildDeepenPrompt(nodeText, contextPath);
      const result = await deps.generateJson({
        client: deps.client,
        prompt,
      });
      const parentStyle = node.style ?? {};
      const newChildren = normalizeDeepenNodesFromAi(result.data, parentStyle);
      return { node, newChildren };
    }),
  );

  for (const { node, newChildren } of results) {
    if (newChildren.length > 0) {
      const existing = Array.isArray(node.childrens) ? node.childrens : [];
      node.childrens = [...existing, ...newChildren];
    }
  }

  return clonedRoots as JsonValue[];
}

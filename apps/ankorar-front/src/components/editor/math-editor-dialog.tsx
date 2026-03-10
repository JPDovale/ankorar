import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import katex from "katex";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const ENV_NAMES = new Set([
  "pmatrix",
  "bmatrix",
  "vmatrix",
  "Bmatrix",
  "Vmatrix",
  "matrix",
  "cases",
  "aligned",
  "gathered",
  "array",
  "align",
  "align*",
  "equation",
  "equation*",
]);

const STRUCT_COMMANDS = new Set([
  "\\begin",
  "\\end",
  "\\left",
  "\\right",
  "\\frac",
  "\\sqrt",
  "\\sum",
  "\\prod",
  "\\int",
  "\\iint",
  "\\iiint",
  "\\lim",
  "\\binom",
  "\\to",
  "\\infty",
  "\\cdot",
  "\\times",
  "\\div",
  "\\pm",
  "\\mp",
  "\\leq",
  "\\geq",
  "\\neq",
  "\\approx",
  "\\equiv",
  "\\sim",
  "\\subset",
  "\\supset",
  "\\in",
  "\\notin",
  "\\cup",
  "\\cap",
  "\\forall",
  "\\exists",
  "\\partial",
  "\\nabla",
  "\\alpha",
  "\\beta",
  "\\gamma",
  "\\delta",
  "\\epsilon",
  "\\theta",
  "\\lambda",
  "\\mu",
  "\\pi",
  "\\sigma",
  "\\phi",
  "\\omega",
  "\\Delta",
  "\\Sigma",
  "\\Omega",
  "\\mathbb",
  "\\mathrm",
  "\\mathcal",
  "\\text",
  "\\textbf",
]);

function esc(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function highlightLatex(source: string): string {
  const out: string[] = [];
  let i = 0;
  const len = source.length;

  while (i < len) {
    const ch = source[i];

    if (ch === "\\") {
      const cmdMatch = source.slice(i).match(/^\\[a-zA-Z*]+/);
      if (cmdMatch) {
        const cmd = cmdMatch[0];
        const cls = STRUCT_COMMANDS.has(cmd)
          ? "latex-hl-command"
          : "latex-hl-command";
        out.push(`<span class="${cls}">${esc(cmd)}</span>`);
        i += cmd.length;

        if ((cmd === "\\begin" || cmd === "\\end") && source[i] === "{") {
          const closeIdx = source.indexOf("}", i);
          if (closeIdx !== -1) {
            const envName = source.slice(i + 1, closeIdx);
            out.push(`<span class="latex-hl-brace">{</span>`);
            out.push(`<span class="latex-hl-env">${esc(envName)}</span>`);
            out.push(`<span class="latex-hl-brace">}</span>`);
            i = closeIdx + 1;
          }
        }
        continue;
      }
      const escaped = source.slice(i, i + 2);
      out.push(`<span class="latex-hl-command">${esc(escaped)}</span>`);
      i += 2;
      continue;
    }

    if (ch === "^" || ch === "_") {
      out.push(`<span class="latex-hl-op">${ch}</span>`);
      i++;
      if (i < len && source[i] !== "{") {
        const valMatch = source.slice(i).match(/^[a-zA-Z0-9]/);
        if (valMatch) {
          out.push(`<span class="latex-hl-value">${esc(valMatch[0])}</span>`);
          i += valMatch[0].length;
        }
      }
      continue;
    }

    if (ch === "{") {
      out.push(`<span class="latex-hl-brace">{</span>`);
      i++;
      let depth = 1;
      let inner = "";
      while (i < len && depth > 0) {
        if (source[i] === "{") depth++;
        else if (source[i] === "}") {
          depth--;
          if (depth === 0) break;
        }
        inner += source[i];
        i++;
      }

      const hasNestedCommands = /\\[a-zA-Z]/.test(inner);
      if (hasNestedCommands) {
        out.push(highlightLatex(inner));
      } else {
        const trimmed = inner.trim();
        const isEnvName = ENV_NAMES.has(trimmed);
        if (isEnvName) {
          out.push(`<span class="latex-hl-env">${esc(inner)}</span>`);
        } else if (trimmed.length > 0) {
          out.push(`<span class="latex-hl-value">${esc(inner)}</span>`);
        }
      }

      if (i < len && source[i] === "}") {
        out.push(`<span class="latex-hl-brace">}</span>`);
        i++;
      }
      continue;
    }

    if (ch === "&") {
      out.push(`<span class="latex-hl-op">&amp;</span>`);
      i++;
      continue;
    }

    if (ch === "\n") {
      out.push("<br/>");
      i++;
      continue;
    }

    const plainMatch = source.slice(i).match(/^[a-zA-Z0-9.,+\-=\s()]+/);
    if (plainMatch) {
      const text = plainMatch[0];
      const parts = text.split(/(\s+)/);
      for (const part of parts) {
        if (/^\s+$/.test(part)) {
          out.push(part);
        } else if (/^[a-zA-Z0-9.,+\-=()]+$/.test(part) && part.length > 0) {
          out.push(`<span class="latex-hl-value">${esc(part)}</span>`);
        }
      }
      i += text.length;
      continue;
    }

    out.push(esc(ch));
    i++;
  }

  return out.join("");
}

interface MathEditorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialLatex?: string;
  onConfirm: (latex: string) => void;
  mode: "inline" | "block";
}

interface MathExample {
  label: string;
  latex: string;
  category: string;
}

const EXAMPLES: MathExample[] = [
  { label: "Fração", latex: "\\frac{a}{b}", category: "Básico" },
  { label: "Raiz quadrada", latex: "\\sqrt{x}", category: "Básico" },
  { label: "Raiz n-ésima", latex: "\\sqrt[n]{x}", category: "Básico" },
  { label: "Potência", latex: "x^{n}", category: "Básico" },
  { label: "Subscrito", latex: "x_{i}", category: "Básico" },
  { label: "Somatório", latex: "\\sum_{i=1}^{n} x_i", category: "Operadores" },
  {
    label: "Produtório",
    latex: "\\prod_{i=1}^{n} x_i",
    category: "Operadores",
  },
  {
    label: "Integral",
    latex: "\\int_{a}^{b} f(x) \\, dx",
    category: "Operadores",
  },
  {
    label: "Integral dupla",
    latex: "\\iint_{D} f(x,y) \\, dA",
    category: "Operadores",
  },
  {
    label: "Limite",
    latex: "\\lim_{x \\to \\infty} f(x)",
    category: "Operadores",
  },
  {
    label: "Matriz 2x2",
    latex: "\\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix}",
    category: "Estruturas",
  },
  {
    label: "Determinante",
    latex: "\\begin{vmatrix} a & b \\\\ c & d \\end{vmatrix}",
    category: "Estruturas",
  },
  {
    label: "Sistema de equações",
    latex: "\\begin{cases} x + y = 1 \\\\ x - y = 0 \\end{cases}",
    category: "Estruturas",
  },
  { label: "Binomial", latex: "\\binom{n}{k}", category: "Estruturas" },
];

function renderToString(latex: string, displayMode: boolean): string {
  try {
    return katex.renderToString(latex, {
      displayMode,
      throwOnError: false,
      output: "htmlAndMathml",
    });
  } catch {
    return "";
  }
}

export function MathEditorDialog({
  open,
  onOpenChange,
  initialLatex = "",
  onConfirm,
  mode,
}: MathEditorDialogProps) {
  const [latex, setLatex] = useState(initialLatex);
  const [error, setError] = useState<string | null>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (open) {
      setLatex(initialLatex);
      setError(null);
      setTimeout(() => textareaRef.current?.focus(), 50);
    }
  }, [open, initialLatex]);

  useEffect(() => {
    if (!previewRef.current) return;
    if (!latex.trim()) {
      previewRef.current.innerHTML =
        '<span class="text-text-disabled text-sm italic">O preview aparecerá aqui...</span>';
      setError(null);
      return;
    }
    try {
      katex.render(latex, previewRef.current, {
        displayMode: true,
        throwOnError: true,
        output: "htmlAndMathml",
      });
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Expressão inválida");
      previewRef.current.innerHTML = "";
    }
  }, [latex]);

  const handleConfirm = useCallback(() => {
    if (!latex.trim() || error) return;
    onConfirm(latex);
    onOpenChange(false);
  }, [latex, error, onConfirm, onOpenChange]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      handleConfirm();
    }
  };

  const insertSnippet = (snippet: string) => {
    if (!textareaRef.current) {
      setLatex((prev) => (prev ? `${prev} ${snippet}` : snippet));
      return;
    }
    const ta = textareaRef.current;
    const start = ta.selectionStart;
    const end = ta.selectionEnd;
    const before = latex.slice(0, start);
    const after = latex.slice(end);
    const newVal = before + snippet + after;
    setLatex(newVal);
    requestAnimationFrame(() => {
      ta.focus();
      const pos = start + snippet.length;
      ta.setSelectionRange(pos, pos);
    });
  };

  const highlighted = useMemo(() => highlightLatex(latex), [latex]);

  const categories = [...new Set(EXAMPLES.map((e) => e.category))];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="font-syne">
            {mode === "inline" ? "Expressão matemática" : "Bloco matemático"}
          </DialogTitle>
          <DialogDescription>
            Escreva LaTeX ou clique num exemplo para inserir. Ctrl+Enter para
            confirmar.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-1 flex-col gap-4 overflow-y-auto">
          {/* Preview */}
          <div
            className={cn(
              "flex min-h-[80px] items-center justify-center rounded-xl border border-border/60 px-6 py-4",
              "bg-ds-surface dark:bg-navy-950",
              error && "border-ds-danger/40",
            )}
          >
            <div
              ref={previewRef}
              className={cn(
                "w-full text-center text-text-primary",
                "[&_.katex-display]:!m-0",
                "[&_.katex]:text-xl",
              )}
            />
          </div>

          {error && <p className="text-xs text-ds-danger">{error}</p>}

          {/* Input */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="math-latex-input"
              className="text-xs font-medium text-text-muted"
            >
              LaTeX
            </label>
            <textarea
              ref={textareaRef}
              id="math-latex-input"
              value={latex}
              onChange={(e) => setLatex(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ex: \frac{a}{b}, \sqrt{x}, \sum_{i=1}^{n}"
              rows={3}
              spellCheck={false}
              className={cn(
                "w-full resize-y rounded-lg border border-border/60 bg-ds-surface-elevated px-3 py-2",
                "font-syne-mono text-sm text-text-primary placeholder:text-text-disabled",
                "outline-none focus:border-amber-400/40 focus:ring-2 focus:ring-amber-400/20",
                "dark:bg-navy-900 dark:focus:border-amber-400/30",
              )}
            />
            {/* Syntax highlight abaixo do textarea */}
            {latex.trim() && (
              <div
                className={cn(
                  "latex-highlight-overlay whitespace-pre-wrap break-words rounded-lg px-3 py-2",
                  "font-syne-mono text-sm leading-[1.65]",
                  "bg-navy-950/[0.03] dark:bg-white/[0.03]",
                )}
                dangerouslySetInnerHTML={{ __html: highlighted }}
              />
            )}
          </div>

          {/* Exemplos por categoria */}
          <div className="flex flex-col gap-3">
            <span className="text-xs font-medium text-text-muted">
              Exemplos — clique para inserir no cursor
            </span>
            {categories.map((cat) => (
              <div key={cat} className="flex flex-col gap-1.5">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-text-muted/60">
                  {cat}
                </span>
                <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-3">
                  {EXAMPLES.filter((e) => e.category === cat).map((ex) => (
                    <button
                      key={ex.label}
                      type="button"
                      onClick={() => insertSnippet(ex.latex)}
                      className={cn(
                        "flex flex-col items-start gap-1 rounded-lg border border-border/50 px-3 py-2",
                        "text-left transition-all",
                        "hover:bg-amber-400/8 hover:border-amber-400/30 hover:shadow-sm",
                        "dark:hover:bg-amber-400/6",
                      )}
                    >
                      <span className="text-[11px] font-medium text-text-secondary">
                        {ex.label}
                      </span>
                      <span
                        className="text-text-primary [&_.katex]:text-[13px]"
                        dangerouslySetInnerHTML={{
                          __html: renderToString(ex.latex, false),
                        }}
                      />
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <DialogFooter className="pt-2">
          <Button variant="ghost" size="sm" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button
            size="sm"
            onClick={handleConfirm}
            disabled={!latex.trim() || !!error}
          >
            {mode === "inline" ? "Inserir inline" : "Inserir bloco"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

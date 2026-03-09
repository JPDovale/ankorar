import { useState } from "react";
import { Link } from "react-router";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Input,
  InputRoot,
  InputBox,
  InputError,
  InputIcon,
  InputLabel,
  InputHint,
  Textarea,
} from "@/components/ui/input";
import {
  Card,
  CardHeader,
  CardIcon,
  CardTitle,
  CardBody,
  CardFooter,
} from "@/components/ui/card";
import { Alert, AlertTitle, AlertBody } from "@/components/ui/alert";
import { Avatar, AvatarStack } from "@/components/ui/avatar";
import { Switch, SwitchRow, SwitchLabel } from "@/components/ui/switch";
import { Checkbox, CheckboxRow } from "@/components/ui/checkbox";
import {
  FlashcardRoot,
  FlashcardLabel,
  FlashcardQuestion,
  RetentionRow,
  RetentionLabel,
  RetentionBar,
  RetentionFill,
  RetentionPct,
  FlashcardActions,
} from "@/components/ui/flashcard";
import { AnkorarLogoMark } from "@/components/AnkorarLogoMark";
import {
  Brain,
  Layers,
  FileText,
  Link2,
  Timer,
  BarChart3,
  Search,
  Settings,
  Plus,
  Pencil,
  Trash2,
  Star,
  AlertTriangle,
  Check,
  Rocket,
  Flame,
  ArrowRight,
  Clock,
  Lightbulb,
} from "lucide-react";

export function DesignSystemPage() {
  const [switch1, setSwitch1] = useState(true);
  const [switch2, setSwitch2] = useState(false);
  const [switch3, setSwitch3] = useState(true);
  const [check1, setCheck1] = useState(true);
  const [check2, setCheck2] = useState(true);
  const [check3, setCheck3] = useState(false);

  return (
    <div
      className="min-h-screen flex bg-navy-950 text-text-primary text-base leading-relaxed antialiased"
      style={{ fontFamily: '"Syne", sans-serif' }}
    >
      <aside className="fixed inset-y-0 left-0 w-[220px] bg-navy-900 border-r border-white/5 py-6 overflow-y-auto z-50">
        <div className="flex items-center gap-2.5 px-5 pb-6 border-b border-white/5 mb-5">
          <AnkorarLogoMark className="size-7 shrink-0 text-amber-400" />
          <span className="font-bold text-base tracking-wide text-ds-white">Anko<span className="text-amber-400">rar</span></span>
        </div>
        <div className="px-4 mb-2">
          <div className="text-[0.72rem] font-bold tracking-[0.1em] uppercase text-text-muted py-2 px-3 mb-1">Fundamentos</div>
          <a href="#logo" className="block py-2 px-3 rounded-md text-sm font-medium text-text-secondary no-underline transition-colors hover:bg-white/5 hover:text-ds-white">Logo</a>
          <a href="#colors" className="block py-2 px-3 rounded-md text-sm font-medium text-text-secondary no-underline transition-colors hover:bg-white/5 hover:text-ds-white">Cores</a>
          <a href="#typography" className="block py-2 px-3 rounded-md text-sm font-medium text-text-secondary no-underline transition-colors hover:bg-white/5 hover:text-ds-white">Tipografia</a>
          <a href="#spacing" className="block py-2 px-3 rounded-md text-sm font-medium text-text-secondary no-underline transition-colors hover:bg-white/5 hover:text-ds-white">Espaçamento</a>
          <a href="#radius" className="block py-2 px-3 rounded-md text-sm font-medium text-text-secondary no-underline transition-colors hover:bg-white/5 hover:text-ds-white">Bordas</a>
        </div>
        <div className="px-4 mb-2">
          <div className="text-[0.72rem] font-bold tracking-[0.1em] uppercase text-text-muted py-2 px-3 mb-1">Componentes</div>
          <a href="#buttons" className="block py-2 px-3 rounded-md text-sm font-medium text-text-secondary no-underline transition-colors hover:bg-white/5 hover:text-ds-white">Botões</a>
          <a href="#badges" className="block py-2 px-3 rounded-md text-sm font-medium text-text-secondary no-underline transition-colors hover:bg-white/5 hover:text-ds-white">Badges</a>
          <a href="#inputs" className="block py-2 px-3 rounded-md text-sm font-medium text-text-secondary no-underline transition-colors hover:bg-white/5 hover:text-ds-white">Inputs</a>
          <a href="#cards" className="block py-2 px-3 rounded-md text-sm font-medium text-text-secondary no-underline transition-colors hover:bg-white/5 hover:text-ds-white">Cards</a>
          <a href="#progress" className="block py-2 px-3 rounded-md text-sm font-medium text-text-secondary no-underline transition-colors hover:bg-white/5 hover:text-ds-white">Progresso</a>
          <a href="#alerts" className="block py-2 px-3 rounded-md text-sm font-medium text-text-secondary no-underline transition-colors hover:bg-white/5 hover:text-ds-white">Alertas</a>
          <a href="#avatars" className="block py-2 px-3 rounded-md text-sm font-medium text-text-secondary no-underline transition-colors hover:bg-white/5 hover:text-ds-white">Avatares</a>
          <a href="#controls" className="block py-2 px-3 rounded-md text-sm font-medium text-text-secondary no-underline transition-colors hover:bg-white/5 hover:text-ds-white">Controles</a>
          <a href="#icons" className="block py-2 px-3 rounded-md text-sm font-medium text-text-secondary no-underline transition-colors hover:bg-white/5 hover:text-ds-white">Ícones</a>
        </div>
      </aside>

      <main className="ml-[220px] py-12 px-12 max-w-[1100px]">
        <div className="bg-navy-900 border border-white/5 rounded-3xl py-12 px-10 mb-16 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-amber-400 to-transparent" />
          <div className="absolute top-0 right-0 bottom-0 w-[40%] bg-gradient-to-l from-amber-400/10 to-transparent pointer-events-none" />
          <div className="text-[0.72rem] font-bold tracking-widest uppercase text-amber-400 mb-3">Design System v1.0</div>
          <h1 className="text-[2.6rem] font-extrabold text-ds-white tracking-tight mb-3 leading-tight">Ankorar DS</h1>
          <p className="text-base text-text-muted font-normal max-w-[480px] leading-relaxed">Sistema de design para a plataforma Ankorar. Fonte: Syne. Paleta: Navy + Amber. Construído para clareza, hierarquia e consistência.</p>
          <div className="flex gap-6 mt-8">
            <div>
              <span className="block text-xl font-extrabold text-amber-300 font-syne-mono">2</span>
              <span className="text-[0.72rem] text-text-muted font-medium">Fontes</span>
            </div>
            <div>
              <span className="block text-xl font-extrabold text-amber-300 font-syne-mono">14</span>
              <span className="text-[0.72rem] text-text-muted font-medium">Cores base</span>
            </div>
            <div>
              <span className="block text-xl font-extrabold text-amber-300 font-syne-mono">11</span>
              <span className="text-[0.72rem] text-text-muted font-medium">Componentes</span>
            </div>
          </div>
        </div>

        <section className="mb-20 scroll-mt-8" id="logo">
          <div className="mb-8 pb-5 border-b border-white/5">
            <div className="text-[0.72rem] font-bold tracking-[0.12em] uppercase text-amber-400 mb-2">01 — Identidade</div>
            <h2 className="text-2xl font-bold text-ds-white tracking-tight">Logo</h2>
            <p className="text-sm text-text-muted mt-2 font-normal">Elos de corrente representando conexão entre conceitos. Sempre manter proporções e espaço de respiro.</p>
          </div>
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-6 bg-navy-900 border border-white/5 rounded-2xl p-6">
              <div className="py-5 px-8 rounded-xl flex items-center gap-2.5 bg-navy-950">
                <AnkorarLogoMark className="size-8" style={{ color: "#D4882A" }} />
                <span className="font-extrabold text-[1.3rem] tracking-wide text-ds-white">Anko<span className="text-amber-400">rar</span></span>
              </div>
              <span className="text-[0.72rem] text-text-muted">Em fundo escuro</span>
            </div>
            <div className="flex items-center gap-6 bg-navy-900 border border-white/5 rounded-2xl p-6">
              <div className="py-5 px-8 rounded-xl flex items-center gap-2.5 bg-[#f5efe4]">
                <AnkorarLogoMark className="size-8" style={{ color: "#A86820" }} />
                <span className="font-extrabold text-[1.3rem] tracking-wide text-navy-900">Anko<span className="text-amber-600">rar</span></span>
              </div>
              <span className="text-[0.72rem] text-text-muted">Em fundo claro</span>
            </div>
            <div className="flex items-center gap-6 bg-navy-900 border border-white/5 rounded-2xl p-6">
              <div className="py-5 px-8 rounded-xl flex items-center gap-2.5 bg-amber-400">
                <AnkorarLogoMark className="size-8" style={{ color: "#070F18" }} />
                <span className="font-extrabold text-[1.3rem] tracking-wide text-navy-950">Ankorar</span>
              </div>
              <span className="text-[0.72rem] text-text-muted">Em fundo amber (uso limitado)</span>
            </div>
          </div>
        </section>

        <section className="mb-20 scroll-mt-8" id="colors">
          <div className="mb-8 pb-5 border-b border-white/5">
            <div className="text-[0.72rem] font-bold tracking-[0.12em] uppercase text-amber-400 mb-2">02 — Fundamentos</div>
            <h2 className="text-2xl font-bold text-ds-white tracking-tight">Cores</h2>
            <p className="text-sm text-text-muted mt-2 font-normal">Paleta primária Navy + Amber. Semântica para estados do sistema.</p>
          </div>
          <div className="mb-8">
            <div className="text-[0.72rem] font-bold tracking-widest uppercase text-text-muted mb-3">Navy — Primária</div>
            <div className="flex gap-0.5 rounded-xl overflow-hidden">
              {["#070F18","#0D1B2A","#122233","#1A3044","#1E3A52","#2A4E6A","#3D6680"].map((hex, i) => (
                <div key={hex} className="flex-1 h-[72px] relative cursor-pointer" style={{ background: hex }}>
                  <div className="absolute bottom-0 left-0 right-0 py-1.5 px-2 bg-black/30 backdrop-blur-sm">
                    <span className="block text-[9px] font-bold text-white/70 tracking-wide">{["950","900","800","700","600","500","400"][i]}</span>
                    <span className="block text-[9px] font-syne-mono text-white/50">{hex}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="mb-8">
            <div className="text-[0.72rem] font-bold tracking-widest uppercase text-text-muted mb-3">Amber — Acento</div>
            <div className="flex gap-0.5 rounded-xl overflow-hidden">
              {["#A86820","#C97B26","#D4882A","#E09E44","#F0B86A","#FBE4BC","#FFF6E8"].map((hex, i) => (
                <div key={hex} className="flex-1 h-[72px] relative cursor-pointer" style={{ background: hex }}>
                  <div className="absolute bottom-0 left-0 right-0 py-1.5 px-2 bg-black/30 backdrop-blur-sm">
                    <span className="block text-[9px] font-bold text-white/70 tracking-wide">{["600","500","400 ★","300","200","100","50"][i]}</span>
                    <span className="block text-[9px] font-syne-mono text-white/50">{hex}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-4 gap-3 mt-4">
            {[
              { role: "Success", hex: "#3DB87A", bg: "#3DB87A" },
              { role: "Warning", hex: "#E09E44", bg: "#E09E44" },
              { role: "Danger", hex: "#E05A5A", bg: "#E05A5A" },
              { role: "Info", hex: "#4A9ECC", bg: "#4A9ECC" },
            ].map(({ role, hex, bg }) => (
              <div key={role} className="rounded-xl overflow-hidden border border-white/5">
                <div className="h-14" style={{ background: bg }} />
                <div className="p-3 bg-navy-900">
                  <div className="text-xs font-bold text-text-primary mb-0.5">{role}</div>
                  <div className="font-syne-mono text-[10px] text-text-muted">{hex}</div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6">
            <div className="text-[0.72rem] font-bold tracking-widest uppercase text-text-muted mb-3">Texto</div>
            <div className="flex flex-col gap-3">
              {[
                { token: "--text-primary", sample: "Título, conteúdo principal", color: "#EEF2F6", hex: "#EEF2F6" },
                { token: "--text-secondary", sample: "Subtítulos, labels", color: "#A8BAC8", hex: "#A8BAC8" },
                { token: "--text-muted", sample: "Metadados, descrições", color: "#627D90", hex: "#627D90" },
                { token: "--text-disabled", sample: "Estado desativado", color: "#3D5566", hex: "#3D5566" },
              ].map(({ token, sample, color, hex }) => (
                <div key={token} className="grid grid-cols-[200px_1fr_140px] items-center gap-6 p-4 px-5 bg-navy-900 border border-white/5 rounded-xl">
                  <span className="font-syne-mono text-xs text-text-muted">{token}</span>
                  <span className="text-sm" style={{ color }}>{sample}</span>
                  <span className="font-syne-mono text-xs text-amber-300 text-right">{hex}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mb-20 scroll-mt-8" id="typography">
          <div className="mb-8 pb-5 border-b border-white/5">
            <div className="text-[0.72rem] font-bold tracking-[0.12em] uppercase text-amber-400 mb-2">03 — Fundamentos</div>
            <h2 className="text-2xl font-bold text-ds-white tracking-tight">Tipografia</h2>
            <p className="text-sm text-text-muted mt-2 font-normal">Syne para display e UI. Syne Mono para dados, código e labels técnicas.</p>
          </div>
          <div className="bg-navy-900 border border-white/5 rounded-2xl p-6 mb-4">
            <div className="flex gap-8 mb-6">
              <div>
                <div className="text-[0.72rem] text-text-muted font-bold tracking-widest uppercase mb-2">Display</div>
                <div className="font-syne text-2xl font-extrabold text-amber-400">Syne</div>
                <div className="text-sm text-text-muted font-normal">400 · 500 · 600 · 700 · 800</div>
              </div>
              <div>
                <div className="text-[0.72rem] text-text-muted font-bold tracking-widest uppercase mb-2">Mono</div>
                <div className="font-syne-mono text-2xl font-extrabold text-amber-400">Syne Mono</div>
                <div className="font-syne-mono text-sm text-text-muted">400 only</div>
              </div>
            </div>
            <div className="text-3xl font-extrabold tracking-tight leading-tight text-ds-white">AaBbCcDdEeFf 0123456789</div>
            <div className="font-syne-mono text-base text-text-secondary mt-3">AaBbCcDdEe  →  --retention: 78%;  →  flashcard.id = &quot;nsc-001&quot;</div>
          </div>
          <div className="bg-navy-900 border border-white/5 rounded-2xl overflow-hidden mb-3">
            {[
              { meta: "Display / 5xl", meta2: "3.4rem · 800", sample: "Ancorar", class: "text-[3.4rem] font-extrabold tracking-tight leading-none" },
              { meta: "H1 / 4xl", meta2: "2.6rem · 800", sample: "Aprenda conectando", class: "text-4xl font-extrabold tracking-tight leading-tight" },
              { meta: "H2 / 3xl", meta2: "2rem · 700", sample: "Mapas Mentais", class: "text-3xl font-bold tracking-tight" },
              { meta: "H3 / 2xl", meta2: "1.6rem · 700", sample: "Repetição Espaçada", class: "text-2xl font-bold" },
              { meta: "Body / base", meta2: "1rem · 400", sample: "O Ankorar une mapas mentais, flashcards e documentos em uma rede de conhecimento viva — criada para o jeito que seu cérebro realmente aprende.", class: "text-base font-normal text-text-secondary max-w-[480px]" },
              { meta: "Small / sm", meta2: "0.85rem · 400", sample: "Metadados, datas, descrições secundárias e tooltips de interface.", class: "text-sm text-text-muted" },
              { meta: "Label / xs", meta2: "0.72rem · 700", sample: "Neurociência da Aprendizagem", class: "text-[0.72rem] font-bold tracking-widest uppercase text-amber-400" },
              { meta: "Mono", meta2: "Syne Mono", sample: "retention: 78%  ·  streak: 5d  ·  cards: 142", class: "font-syne-mono text-sm text-amber-300" },
            ].map((row, i) => (
              <div key={i} className={cn("grid grid-cols-[140px_1fr] gap-6 items-baseline py-5 px-6 border-b border-white/5", i === 7 && "border-b-0")}>
                <div className="font-syne-mono text-[10px] text-text-muted leading-snug"><strong className="block text-amber-400 mb-0.5">{row.meta}</strong>{row.meta2}</div>
                <div className={row.class}>{row.sample}</div>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-20 scroll-mt-8" id="spacing">
          <div className="mb-8 pb-5 border-b border-white/5">
            <div className="text-[0.72rem] font-bold tracking-[0.12em] uppercase text-amber-400 mb-2">04 — Fundamentos</div>
            <h2 className="text-2xl font-bold text-ds-white tracking-tight">Espaçamento</h2>
            <p className="text-sm text-text-muted mt-2 font-normal">Escala baseada em múltiplos de 4px.</p>
          </div>
          <div className="bg-navy-900 border border-white/5 rounded-2xl p-6">
            <div className="flex flex-col gap-1.5">
              {[4,8,12,16,20,24,32,40,48,64,80].map((px, i) => (
                <div key={px} className="flex items-center gap-4">
                  <div className="shrink-0 h-5 rounded bg-gradient-to-r from-amber-500 to-amber-300" style={{ width: px }} />
                  <span className="font-syne-mono text-[10px] text-text-muted"><strong className="text-amber-300">sp-{i + 1}</strong> {px}px</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mb-20 scroll-mt-8" id="radius">
          <div className="mb-8 pb-5 border-b border-white/5">
            <div className="text-[0.72rem] font-bold tracking-[0.12em] uppercase text-amber-400 mb-2">05 — Fundamentos</div>
            <h2 className="text-2xl font-bold text-ds-white tracking-tight">Border Radius</h2>
          </div>
          <div className="bg-navy-900 border border-white/5 rounded-2xl p-6">
            <div className="flex flex-wrap gap-4">
              {[
                { name: "r-sm", val: 4 },
                { name: "r-md", val: 8 },
                { name: "r-lg", val: 12 },
                { name: "r-xl", val: 16 },
                { name: "r-2xl", val: 24 },
                { name: "r-full", val: "∞" },
              ].map(({ name, val }) => (
                <div key={name} className="flex flex-col items-center gap-2">
                  <div className="w-[60px] h-[60px] bg-navy-700 border border-amber-400/25" style={{ borderRadius: typeof val === "number" ? val : 9999 }} />
                  <div className="font-syne-mono text-[10px] text-text-muted text-center"><strong className="block text-amber-300">{name}</strong>{String(val)}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mb-20 scroll-mt-8" id="buttons">
          <div className="mb-8 pb-5 border-b border-white/5">
            <div className="text-[0.72rem] font-bold tracking-[0.12em] uppercase text-amber-400 mb-2">06 — Componentes</div>
            <h2 className="text-2xl font-bold text-ds-white tracking-tight">Botões</h2>
            <p className="text-sm text-text-muted mt-2 font-normal">5 variantes × 4 tamanhos × estados hover, active, disabled.</p>
          </div>
          <div className="bg-navy-900 border border-white/5 rounded-2xl p-8">
            <div className="flex flex-wrap items-center gap-4 mb-6">
              <span className="text-[0.72rem] font-bold tracking-wider uppercase text-text-muted w-20 shrink-0">Variantes</span>
              <Button>Primário →</Button>
              <Button variant="secondary">Secundário</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="amber-ghost">Amber Ghost</Button>
              <Button variant="destructive">Perigo</Button>
            </div>
            <div className="flex flex-wrap items-center gap-4 mb-6">
              <span className="text-[0.72rem] font-bold tracking-wider uppercase text-text-muted w-20 shrink-0">Tamanhos</span>
              <Button size="sm">Small</Button>
              <Button>Medium</Button>
              <Button size="lg">Large</Button>
              <Button size="xl">Extra Large</Button>
            </div>
            <div className="flex flex-wrap items-center gap-4 mb-6">
              <span className="text-[0.72rem] font-bold tracking-wider uppercase text-text-muted w-20 shrink-0">Com ícone</span>
              <Button icon={Brain} iconPosition="left">Criar mapa</Button>
              <Button variant="secondary" icon={Layers} iconPosition="left">Novo flashcard</Button>
              <Button variant="ghost" icon={FileText} iconPosition="left">Importar PDF</Button>
              <Button variant="secondary" size="icon"><Settings className="size-4" /></Button>
              <Button variant="ghost" size="icon"><Link2 className="size-4" /></Button>
            </div>
            <div className="flex flex-wrap items-center gap-4">
              <span className="text-[0.72rem] font-bold tracking-wider uppercase text-text-muted w-20 shrink-0">Disabled</span>
              <Button disabled>Primário</Button>
              <Button variant="secondary" disabled>Secundário</Button>
              <Button variant="ghost" disabled>Ghost</Button>
            </div>
          </div>
        </section>

        <section className="mb-20 scroll-mt-8" id="badges">
          <div className="mb-8 pb-5 border-b border-white/5">
            <div className="text-[0.72rem] font-bold tracking-[0.12em] uppercase text-amber-400 mb-2">07 — Componentes</div>
            <h2 className="text-2xl font-bold text-ds-white tracking-tight">Badges & Tags</h2>
          </div>
          <div className="bg-navy-900 border border-white/5 rounded-2xl p-8">
            <div className="flex flex-wrap items-center gap-4 mb-6">
              <span className="text-[0.72rem] font-bold tracking-wider uppercase text-text-muted w-20 shrink-0">Estados</span>
              <Badge variant="amber" dot>Em andamento</Badge>
              <Badge variant="success" dot>Concluído</Badge>
              <Badge variant="danger" dot>Atrasado</Badge>
              <Badge variant="info" dot>Revisão</Badge>
              <Badge variant="neutral">Arquivado</Badge>
            </div>
            <div className="flex flex-wrap items-center gap-4">
              <span className="text-[0.72rem] font-bold tracking-wider uppercase text-text-muted w-20 shrink-0">Conteúdo</span>
              <Badge variant="amber">Neurociência</Badge>
              <Badge variant="success">Dominado</Badge>
              <Badge variant="danger">Esquecer em breve</Badge>
              <Badge variant="info">Novo</Badge>
              <Badge variant="neutral">142 cards</Badge>
            </div>
          </div>
        </section>

        <section className="mb-20 scroll-mt-8" id="inputs">
          <div className="mb-8 pb-5 border-b border-white/5">
            <div className="text-[0.72rem] font-bold tracking-[0.12em] uppercase text-amber-400 mb-2">08 — Componentes</div>
            <h2 className="text-2xl font-bold text-ds-white tracking-tight">Inputs</h2>
          </div>
          <div className="bg-navy-900 border border-white/5 rounded-2xl p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputRoot>
                <InputLabel htmlFor="ds-title">Título do deck</InputLabel>
                <InputBox>
                  <Input id="ds-title" type="text" placeholder="Ex: Neurociência do Sono" />
                </InputBox>
                <InputHint>Seja específico para facilitar a busca.</InputHint>
              </InputRoot>
              <InputRoot>
                <InputLabel htmlFor="ds-search">Com ícone</InputLabel>
                <InputBox>
                  <InputIcon><Search className="size-4" /></InputIcon>
                  <Input id="ds-search" type="text" placeholder="Buscar conceitos..." />
                </InputBox>
              </InputRoot>
              <InputRoot>
                <InputLabel htmlFor="ds-error">Estado de erro</InputLabel>
                <InputBox data-has-error={true}>
                  <Input id="ds-error" type="email" defaultValue="nao-e-email" />
                </InputBox>
                <InputError>Insira um e-mail válido.</InputError>
              </InputRoot>
              <InputRoot>
                <InputLabel htmlFor="ds-disabled">Desativado</InputLabel>
                <InputBox>
                  <Input id="ds-disabled" type="text" placeholder="Campo desativado" disabled className="opacity-40 cursor-not-allowed" />
                </InputBox>
              </InputRoot>
              <InputRoot className="md:col-span-2">
                <InputLabel htmlFor="ds-textarea">Anotação / Textarea</InputLabel>
                <Textarea id="ds-textarea" rows={3} placeholder="Escreva sua nota ou conceito..." />
              </InputRoot>
            </div>
          </div>
        </section>

        <section className="mb-20 scroll-mt-8" id="cards">
          <div className="mb-8 pb-5 border-b border-white/5">
            <div className="text-[0.72rem] font-bold tracking-[0.12em] uppercase text-amber-400 mb-2">09 — Componentes</div>
            <h2 className="text-2xl font-bold text-ds-white tracking-tight">Cards</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardIcon><Brain className="size-5 text-amber-400" /></CardIcon>
                <Badge variant="amber">Novo</Badge>
              </CardHeader>
              <CardTitle>Mapas Mentais</CardTitle>
              <CardBody className="mb-4">
                Conecte conceitos visualmente e deixe o algoritmo sugerir relações que você ainda não percebeu.
              </CardBody>
              <CardFooter>
                <span className="text-xs text-text-muted">12 mapas criados</span>
                <Button variant="ghost" size="sm">Abrir <ArrowRight className="size-3.5 ml-0.5" /></Button>
              </CardFooter>
            </Card>
            <FlashcardRoot>
              <FlashcardLabel>Pergunta</FlashcardLabel>
              <FlashcardQuestion>O que é a curva do esquecimento de Ebbinghaus e como ela afeta a retenção de longo prazo?</FlashcardQuestion>
              <RetentionRow>
                <RetentionLabel>Retenção atual</RetentionLabel>
                <RetentionBar><RetentionFill value={78} /></RetentionBar>
                <RetentionPct>78%</RetentionPct>
              </RetentionRow>
              <FlashcardActions onWrong={() => {}} onHard={() => {}} onCorrect={() => {}} />
            </FlashcardRoot>
            <Card variant="amber">
              <p className="text-xs font-bold tracking-widest uppercase text-amber-400 mb-3">Sequência atual</p>
              <div className="text-5xl font-extrabold text-ds-white font-syne-mono leading-none">12</div>
              <p className="text-sm text-text-muted mt-2">dias consecutivos <Flame className="size-4 inline text-amber-400" /></p>
              <div className="flex gap-1 mt-4">
                {[1,2,3,4,5,6,7].map((i) => (
                  <div key={i} className={cn("flex-1 h-1.5 rounded-full", i <= 5 ? "bg-amber-400" : "bg-navy-600")} />
                ))}
              </div>
            </Card>
            <Card>
              <div className="flex items-center gap-3 mb-4">
                <div className="size-10 h-[52px] bg-navy-700 border border-amber-400/25 rounded-md flex items-center justify-center shrink-0">
                  <FileText className="size-5 text-amber-400" />
                </div>
                <div>
                  <CardTitle className="text-sm">Princípios de Neurociência</CardTitle>
                  <p className="text-xs text-text-muted">Kandel et al. • 892 páginas</p>
                </div>
              </div>
              <div className="flex gap-2 flex-wrap mb-4">
                <Badge variant="info">Neurônios</Badge>
                <Badge variant="amber">Sinapses</Badge>
                <Badge variant="neutral">Memória</Badge>
                <Badge variant="neutral">+14</Badge>
              </div>
              <CardFooter>
                <span className="text-xs text-text-muted">Conectado a 3 mapas</span>
                <Badge variant="success" dot>Indexado</Badge>
              </CardFooter>
            </Card>
          </div>
        </section>

        <section className="mb-20 scroll-mt-8" id="progress">
          <div className="mb-8 pb-5 border-b border-white/5">
            <div className="text-[0.72rem] font-bold tracking-[0.12em] uppercase text-amber-400 mb-2">10 — Componentes</div>
            <h2 className="text-2xl font-bold text-ds-white tracking-tight">Progresso</h2>
          </div>
          <div className="flex flex-col gap-4 bg-navy-900 border border-white/5 rounded-2xl p-6">
            {[
              { name: "Neurociência do Sono", pct: 87, fill: "bg-gradient-to-r from-amber-500 to-amber-200" },
              { name: "Farmacologia Clínica", pct: 62, fill: "bg-ds-info" },
              { name: "Bioquímica Celular", pct: 41, fill: "bg-ds-success" },
              { name: "Anatomia do SNC", pct: 18, fill: "bg-navy-500" },
            ].map(({ name, pct, fill }) => (
              <div key={name}>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-semibold text-text-primary">{name}</span>
                  <span className="text-xs font-bold font-syne-mono text-text-muted">{pct}%</span>
                </div>
                <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                  <div className={cn("h-full rounded-full transition-[width] duration-500", fill)} style={{ width: `${pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-20 scroll-mt-8" id="alerts">
          <div className="mb-8 pb-5 border-b border-white/5">
            <div className="text-[0.72rem] font-bold tracking-[0.12em] uppercase text-amber-400 mb-2">11 — Componentes</div>
            <h2 className="text-2xl font-bold text-ds-white tracking-tight">Alertas</h2>
          </div>
          <div className="space-y-3">
            <Alert variant="amber" icon={Clock}>
              <AlertTitle>Revisão necessária</AlertTitle>
              <AlertBody>Você tem 8 flashcards prestes a entrar na zona de esquecimento. Revise hoje para manter sua curva de retenção.</AlertBody>
            </Alert>
            <Alert variant="success" icon={Check}>
              <AlertTitle>Sessão concluída!</AlertTitle>
              <AlertBody>Você revisou 24 cards hoje. Sua retenção média subiu para 82%. Continue amanhã para consolidar.</AlertBody>
            </Alert>
            <Alert variant="danger" icon={AlertTriangle}>
              <AlertTitle>Sequência em risco</AlertTitle>
              <AlertBody>Você não fez nenhuma revisão hoje. Complete ao menos uma sessão para manter sua sequência de 12 dias.</AlertBody>
            </Alert>
            <Alert variant="info" icon={Lightbulb}>
              <AlertTitle>Dica de aprendizado</AlertTitle>
              <AlertBody>Estudar em intervalos curtos é mais eficaz do que maratonas. Tente 3 sessões de 25 minutos hoje.</AlertBody>
            </Alert>
          </div>
        </section>

        <section className="mb-20 scroll-mt-8" id="avatars">
          <div className="mb-8 pb-5 border-b border-white/5">
            <div className="text-[0.72rem] font-bold tracking-[0.12em] uppercase text-amber-400 mb-2">12 — Componentes</div>
            <h2 className="text-2xl font-bold text-ds-white tracking-tight">Avatares</h2>
          </div>
          <div className="bg-navy-900 border border-white/5 rounded-2xl p-8">
            <div className="flex flex-wrap items-center gap-4 mb-6">
              <span className="text-[0.72rem] font-bold tracking-wider uppercase text-text-muted w-20 shrink-0">Tamanhos</span>
              <Avatar size="xs" variant="amber">LA</Avatar>
              <Avatar size="sm" variant="blue">MR</Avatar>
              <Avatar size="md" variant="amber">LA</Avatar>
              <Avatar size="lg" variant="green">BF</Avatar>
              <Avatar size="xl" variant="amber">LA</Avatar>
            </div>
            <div className="flex flex-wrap items-center gap-4">
              <span className="text-[0.72rem] font-bold tracking-wider uppercase text-text-muted w-20 shrink-0">Empilhado</span>
              <AvatarStack>
                <Avatar size="sm" variant="amber">LA</Avatar>
                <Avatar size="sm" variant="blue">MR</Avatar>
                <Avatar size="sm" variant="green">BF</Avatar>
                <Avatar size="sm" variant="navy">+8</Avatar>
              </AvatarStack>
              <span className="text-sm text-text-muted ml-3">11 estudando agora</span>
            </div>
          </div>
        </section>

        <section className="mb-20 scroll-mt-8" id="controls">
          <div className="mb-8 pb-5 border-b border-white/5">
            <div className="text-[0.72rem] font-bold tracking-[0.12em] uppercase text-amber-400 mb-2">13 — Componentes</div>
            <h2 className="text-2xl font-bold text-ds-white tracking-tight">Controles</h2>
          </div>
          <div className="bg-navy-900 border border-white/5 rounded-2xl p-8">
            <div className="flex flex-col items-start gap-4">
              <SwitchRow onClick={() => setSwitch1((v) => !v)}>
                <Switch checked={switch1} onCheckedChange={setSwitch1} />
                <SwitchLabel>Repetição espaçada ativa</SwitchLabel>
              </SwitchRow>
              <SwitchRow onClick={() => setSwitch2((v) => !v)}>
                <Switch checked={switch2} onCheckedChange={setSwitch2} />
                <SwitchLabel>Notificações de revisão</SwitchLabel>
              </SwitchRow>
              <SwitchRow onClick={() => setSwitch3((v) => !v)}>
                <Switch checked={switch3} onCheckedChange={setSwitch3} />
                <SwitchLabel>Modo foco (Pomodoro)</SwitchLabel>
              </SwitchRow>
            </div>
            <div className="w-px bg-white/5 my-5" />
            <div className="flex flex-col items-start gap-3">
              <CheckboxRow onClick={() => setCheck1((v) => !v)}>
                <Checkbox checked={check1} onCheckedChange={setCheck1} />
                <SwitchLabel>Neurociência do Sono — Capítulo 1</SwitchLabel>
              </CheckboxRow>
              <CheckboxRow onClick={() => setCheck2((v) => !v)}>
                <Checkbox checked={check2} onCheckedChange={setCheck2} />
                <SwitchLabel>Memória de Trabalho — Conceitos base</SwitchLabel>
              </CheckboxRow>
              <CheckboxRow onClick={() => setCheck3((v) => !v)}>
                <Checkbox checked={check3} onCheckedChange={setCheck3} />
                <SwitchLabel>Plasticidade Sináptica — Revisão pendente</SwitchLabel>
              </CheckboxRow>
            </div>
          </div>
        </section>

        <section className="mb-20 scroll-mt-8" id="icons">
          <div className="mb-8 pb-5 border-b border-white/5">
            <div className="text-[0.72rem] font-bold tracking-[0.12em] uppercase text-amber-400 mb-2">14 — Componentes</div>
            <h2 className="text-2xl font-bold text-ds-white tracking-tight">Ícones</h2>
            <p className="text-sm text-text-muted mt-2 font-normal">Conjunto de ícones de UI. Lucide React na implementação.</p>
          </div>
          <div className="bg-navy-900 border border-white/5 rounded-2xl p-6">
            <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2">
              {[
                { Icon: Brain, title: "Mapa mental" },
                { Icon: Layers, title: "Flashcard" },
                { Icon: FileText, title: "Documento" },
                { Icon: Link2, title: "Conexão" },
                { Icon: Timer, title: "Timer" },
                { Icon: BarChart3, title: "Gráfico" },
                { Icon: Search, title: "Busca" },
                { Icon: Settings, title: "Configuração" },
                { Icon: Plus, title: "Adicionar" },
                { Icon: Pencil, title: "Editar" },
                { Icon: Trash2, title: "Deletar" },
                { Icon: Star, title: "Estrela" },
                { Icon: AlertTriangle, title: "Alerta" },
                { Icon: Check, title: "Check" },
                { Icon: Rocket, title: "Foguete" },
                { Icon: Flame, title: "Chama" },
              ].map(({ Icon, title }) => (
                <div
                  key={title}
                  className="aspect-square bg-navy-800 border border-white/5 rounded-xl flex items-center justify-center cursor-pointer transition-all hover:bg-amber-400/10 hover:border-amber-400/25 hover:scale-105"
                  title={title}
                >
                  <Icon className="size-6" />
                </div>
              ))}
            </div>
          </div>
        </section>

        <div className="pt-8 border-t border-white/5">
          <Link to="/">
            <Button variant="ghost" icon={ArrowRight} iconPosition="right">Voltar ao início</Button>
          </Link>
        </div>
      </main>
    </div>
  );
}

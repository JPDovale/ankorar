import { DatePicker } from "@/components/ui/date-picker";
import { InputRoot } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function featureLabel(feature: string): string {
  const labels: Record<string, string> = {
    "create:user": "Criar usuário",
    "create:user:other": "Criar usuário (outro)",
    "read:user": "Ler usuário",
    "read:user:other": "Ler outros usuários",
    "read:activation_token": "Ler token de ativação",
    "create:session": "Criar sessão",
    "read:session": "Ler sessão",
    "read:organization": "Ler organização",
    "read:organization_members": "Ler membros",
    "remove:member": "Remover membro",
    "read:api_key": "Ler chaves de API",
    "create:api_key": "Criar chave de API",
    "create:organization_invite": "Criar convite",
    "cancel:organization_invite": "Cancelar convite",
    "update:organization": "Atualizar organização",
    "read:map": "Ler mapa",
    "read:map:other": "Ler mapa de um membro",
    "create:map": "Criar mapa",
    "create:map:other": "Criar mapa para membro",
    "update:map": "Atualizar mapa",
    "update:map:other": "Atualizar mapa de membro",
    "delete:map": "Excluir mapa",
    "delete:map:other": "Excluir mapa de membro",
    "like:map": "Curtir mapa",
    "like:map:other": "Curtir mapa de membro",
    "unlike:map:other": "Descurtir mapa de membro",
    "read:library": "Ler biblioteca",
    "create:library": "Criar biblioteca",
    "connect:library": "Conectar biblioteca",
    "read:plans": "Ler planos",
    "read:subscription": "Ler assinatura",
    "create:checkout": "Criar checkout",
    "create:portal": "Criar portal do cliente",
  };
  return labels[feature] ?? feature;
}

type CreateApiKeyFormBodyProps = {
  expiresAtDate: Date | null;
  onExpiresAtDateChange: (date: Date | null) => void;
  isPermanent: boolean;
  onPermanentChange: (checked: boolean) => void;
  availableFeatures: string[];
  selectedFeatures: string[];
  onToggleFeature: (feature: string) => void;
  onSelectAllFeatures: () => void;
  onDeselectAllFeatures: () => void;
  isCreating: boolean;
  minDate: Date;
};

export function CreateApiKeyFormBody({
  expiresAtDate,
  onExpiresAtDateChange,
  isPermanent,
  onPermanentChange,
  availableFeatures,
  selectedFeatures,
  onToggleFeature,
  onSelectAllFeatures,
  onDeselectAllFeatures,
  isCreating,
  minDate,
}: CreateApiKeyFormBodyProps) {
  return (
    <div className="space-y-4">
      <InputRoot>
        <Label htmlFor="create-api-key-expires-at">Data de expiracao</Label>
        <div className="mt-1">
          <DatePicker
            id="create-api-key-expires-at"
            value={expiresAtDate}
            onChange={(date) => onExpiresAtDateChange(date ?? null)}
            placeholder="Selecione a data"
            disabled={isPermanent || isCreating}
            minDate={minDate}
          />
        </div>
      </InputRoot>

      <label className="flex cursor-pointer items-center gap-2">
        <input
          type="checkbox"
          checked={isPermanent}
          onChange={(e) => onPermanentChange(e.target.checked)}
          disabled={isCreating}
          className="size-4 rounded border-zinc-300 text-violet-600 focus:ring-violet-500 disabled:opacity-50"
          aria-describedby="permanent-key-warning"
        />
        <span className="text-sm font-medium text-zinc-700">
          Chave permanente
        </span>
      </label>

      {isPermanent && (
        <p
          id="permanent-key-warning"
          className="mt-3 rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800"
          role="alert"
        >
          Chaves permanentes nao expiram e podem ser mais perigosas se
          vazarem. Prefira usar data de expiracao quando possivel.
        </p>
      )}

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label>Permissoes da chave</Label>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={onSelectAllFeatures}
              disabled={isCreating}
              className="text-xs text-violet-600 hover:underline disabled:opacity-50"
            >
              Todas
            </button>
            <span className="text-zinc-400">|</span>
            <button
              type="button"
              onClick={onDeselectAllFeatures}
              disabled={isCreating}
              className="text-xs text-violet-600 hover:underline disabled:opacity-50"
            >
              Nenhuma
            </button>
          </div>
        </div>
        <div className="max-h-48 space-y-1.5 overflow-y-auto rounded-md border border-zinc-200 bg-zinc-50/50 p-2">
          {availableFeatures.map((feature) => (
            <label
              key={feature}
              className="flex cursor-pointer items-center gap-2 rounded px-1.5 py-1 hover:bg-zinc-100"
            >
              <input
                type="checkbox"
                checked={selectedFeatures.includes(feature)}
                onChange={() => onToggleFeature(feature)}
                disabled={isCreating}
                className="size-4 rounded border-zinc-300 text-violet-600 focus:ring-violet-500 disabled:opacity-50"
              />
              <span className="text-sm text-zinc-700">
                {featureLabel(feature)}
              </span>
              <span className="text-xs text-zinc-400">({feature})</span>
            </label>
          ))}
        </div>
        <p className="text-xs text-zinc-500">
          Se nenhuma for selecionada, a chave tera todas as permissoes.
        </p>
      </div>
    </div>
  );
}

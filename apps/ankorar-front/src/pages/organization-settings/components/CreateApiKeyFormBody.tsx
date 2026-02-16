import { DatePicker } from "@/components/ui/date-picker";
import { InputRoot } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type CreateApiKeyFormBodyProps = {
  expiresAtDate: Date | null;
  onExpiresAtDateChange: (date: Date | null) => void;
  isPermanent: boolean;
  onPermanentChange: (checked: boolean) => void;
  isCreating: boolean;
  minDate: Date;
};

export function CreateApiKeyFormBody({
  expiresAtDate,
  onExpiresAtDateChange,
  isPermanent,
  onPermanentChange,
  isCreating,
  minDate,
}: CreateApiKeyFormBodyProps) {
  return (
    <div className="space-y-3">
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
    </div>
  );
}

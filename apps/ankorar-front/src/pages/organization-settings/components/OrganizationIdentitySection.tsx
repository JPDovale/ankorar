import { Button } from "@/components/ui/button";
import { Input, InputBox, InputError, InputRoot } from "@/components/ui/input";
import type { UseFormRegister } from "react-hook-form";

type OrganizationIdentityFormData = {
  organizationName: string;
};

interface OrganizationIdentitySectionProps {
  organizationNameErrorMessage: string | undefined;
  handleIdentitySubmit: (e: React.FormEvent) => void;
  isSubmittingIdentity: boolean;
  register: UseFormRegister<OrganizationIdentityFormData>;
}

export function OrganizationIdentitySection({
  organizationNameErrorMessage,
  handleIdentitySubmit,
  isSubmittingIdentity,
  register,
}: OrganizationIdentitySectionProps) {
  return (
    <section
      id="organization-identity"
      aria-labelledby="organization-identity-title"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <h2
            id="organization-identity-title"
            className="text-sm font-semibold text-zinc-900"
          >
            Identidade
          </h2>
          <p className="text-sm text-zinc-500">
            Nome exibido para o time nos ambientes internos.
          </p>
        </div>
      </div>

      <form
        id="organization-identity-form"
        className="mt-4 max-w-md"
        onSubmit={handleIdentitySubmit}
      >
        <InputRoot disabled={isSubmittingIdentity}>
          <label
            htmlFor="organization-settings-name"
            className="text-xs font-medium text-zinc-600"
          >
            Nome da organizacao
          </label>

          <InputBox
            data-disabled={isSubmittingIdentity}
            data-has-error={Boolean(organizationNameErrorMessage)}
            className="mt-1 h-10 border-zinc-300 bg-white transition-colors focus-within:border-violet-400"
          >
            <Input
              id="organization-settings-name"
              type="text"
              placeholder="Digite o nome da organizacao"
              disabled={isSubmittingIdentity}
              {...register("organizationName")}
            />
          </InputBox>

          {organizationNameErrorMessage && (
            <InputError role="alert">
              {organizationNameErrorMessage}
            </InputError>
          )}
        </InputRoot>

        <Button
          type="submit"
          variant="outline"
          size="sm"
          className="mt-3"
          disabled={isSubmittingIdentity}
        >
          Salvar
        </Button>
      </form>
    </section>
  );
}

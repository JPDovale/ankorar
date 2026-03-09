import { Button } from "@/components/ui/button";
import {
  Input,
  InputBox,
  InputError,
  InputRoot,
} from "@/components/ui/input";
import type { UseFormRegister } from "react-hook-form";
import type { ProfileFormData } from "../hooks/useUserSettingsPage";

interface UserProfileSectionProps {
  handleSubmit: (e: React.FormEvent) => void;
  isSubmitting: boolean;
  register: UseFormRegister<ProfileFormData>;
  errors: { name?: { message?: string }; email?: { message?: string } };
}

export function UserProfileSection({
  handleSubmit,
  isSubmitting,
  register,
  errors,
}: UserProfileSectionProps) {
  return (
    <section id="user-profile" aria-labelledby="user-profile-title">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <h2
            id="user-profile-title"
            className="text-sm font-semibold text-navy-900 dark:text-ds-white transition-colors duration-200"
          >
            Perfil
          </h2>
          <p className="text-sm text-text-muted">
            Nome e e-mail exibidos na plataforma.
          </p>
        </div>
      </div>

      <form
        id="user-profile-form"
        className="mt-4 max-w-md space-y-4"
        onSubmit={handleSubmit}
      >
        <InputRoot disabled={isSubmitting}>
          <label
            htmlFor="user-settings-name"
            className="text-xs font-bold tracking-wider uppercase text-text-secondary"
          >
            Nome
          </label>
          <InputBox
            data-disabled={isSubmitting}
            data-has-error={Boolean(errors.name)}
            className="mt-1 h-10"
          >
            <Input
              id="user-settings-name"
              type="text"
              placeholder="Digite seu nome"
              disabled={isSubmitting}
              {...register("name")}
            />
          </InputBox>
          {errors.name && (
            <InputError role="alert">{errors.name.message}</InputError>
          )}
        </InputRoot>

        <InputRoot disabled={isSubmitting}>
          <label
            htmlFor="user-settings-email"
            className="text-xs font-bold tracking-wider uppercase text-text-secondary"
          >
            E-mail
          </label>
          <InputBox
            data-disabled={isSubmitting}
            data-has-error={Boolean(errors.email)}
            className="mt-1 h-10"
          >
            <Input
              id="user-settings-email"
              type="email"
              placeholder="seu@email.com"
              disabled={isSubmitting}
              {...register("email")}
            />
          </InputBox>
          {errors.email && (
            <InputError role="alert">{errors.email.message}</InputError>
          )}
        </InputRoot>

        <Button
          type="submit"
          variant="outline"
          size="sm"
          className="mt-3"
          disabled={isSubmitting}
        >
          Salvar
        </Button>
      </form>
    </section>
  );
}

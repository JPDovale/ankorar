import { Button } from "@/components/ui/button";
import {
  Input,
  InputBox,
  InputError,
  InputRoot,
} from "@/components/ui/input";
import type { UseFormRegister } from "react-hook-form";
import type { PasswordFormData } from "../hooks/useUserSettingsPage";

interface UserPasswordSectionProps {
  handleSubmit: (e: React.FormEvent) => void;
  isSubmitting: boolean;
  register: UseFormRegister<PasswordFormData>;
  errors: {
    current_password?: { message?: string };
    new_password?: { message?: string };
    confirm_password?: { message?: string };
  };
}

export function UserPasswordSection({
  handleSubmit,
  isSubmitting,
  register,
  errors,
}: UserPasswordSectionProps) {
  return (
    <section id="user-password" aria-labelledby="user-password-title">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <h2
            id="user-password-title"
            className="text-sm font-semibold text-zinc-900"
          >
            Alterar senha
          </h2>
          <p className="text-sm text-zinc-500">
            Use uma senha forte com pelo menos 8 caracteres.
          </p>
        </div>
      </div>

      <form
        id="user-password-form"
        className="mt-4 max-w-md space-y-4"
        onSubmit={handleSubmit}
      >
        <InputRoot disabled={isSubmitting}>
          <label
            htmlFor="user-settings-current-password"
            className="text-xs font-medium text-zinc-600"
          >
            Senha atual
          </label>
          <InputBox
            data-disabled={isSubmitting}
            data-has-error={Boolean(errors.current_password)}
            className="mt-1 h-10 border-zinc-300 bg-white transition-colors focus-within:border-violet-400"
          >
            <Input
              id="user-settings-current-password"
              type="password"
              placeholder="••••••••"
              autoComplete="current-password"
              disabled={isSubmitting}
              {...register("current_password")}
            />
          </InputBox>
          {errors.current_password && (
            <InputError role="alert">
              {errors.current_password.message}
            </InputError>
          )}
        </InputRoot>

        <InputRoot disabled={isSubmitting}>
          <label
            htmlFor="user-settings-new-password"
            className="text-xs font-medium text-zinc-600"
          >
            Nova senha
          </label>
          <InputBox
            data-disabled={isSubmitting}
            data-has-error={Boolean(errors.new_password)}
            className="mt-1 h-10 border-zinc-300 bg-white transition-colors focus-within:border-violet-400"
          >
            <Input
              id="user-settings-new-password"
              type="password"
              placeholder="••••••••"
              autoComplete="new-password"
              disabled={isSubmitting}
              {...register("new_password")}
            />
          </InputBox>
          {errors.new_password && (
            <InputError role="alert">
              {errors.new_password.message}
            </InputError>
          )}
        </InputRoot>

        <InputRoot disabled={isSubmitting}>
          <label
            htmlFor="user-settings-confirm-password"
            className="text-xs font-medium text-zinc-600"
          >
            Confirmar nova senha
          </label>
          <InputBox
            data-disabled={isSubmitting}
            data-has-error={Boolean(errors.confirm_password)}
            className="mt-1 h-10 border-zinc-300 bg-white transition-colors focus-within:border-violet-400"
          >
            <Input
              id="user-settings-confirm-password"
              type="password"
              placeholder="••••••••"
              autoComplete="new-password"
              disabled={isSubmitting}
              {...register("confirm_password")}
            />
          </InputBox>
          {errors.confirm_password && (
            <InputError role="alert">
              {errors.confirm_password.message}
            </InputError>
          )}
        </InputRoot>

        <Button
          type="submit"
          variant="outline"
          size="sm"
          className="mt-3"
          disabled={isSubmitting}
        >
          Alterar senha
        </Button>
      </form>
    </section>
  );
}

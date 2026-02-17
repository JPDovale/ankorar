import { AuthScene } from "@/components/auth/AuthScene";
import { Button } from "@/components/ui/button";
import { useUser } from "@/hooks/useUser";
import { Input, InputBox, InputError, InputRoot } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderCircle } from "lucide-react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router";
import { toast } from "sonner";
import { z } from "zod";

const registerSchema = z
  .object({
    name: z.string().trim().min(3, "O nome precisa ter pelo menos 3 caracteres."),
    email: z.email("Digite um email válido."),
    password: z.string().min(8, "A senha precisa ter pelo menos 8 caracteres."),
    confirmPassword: z.string().min(8, "A senha precisa ter pelo menos 8 caracteres."),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não coincidem.",
    path: ["confirmPassword"],
  });

type RegisterFormData = z.infer<typeof registerSchema>;

export function RegisterPage() {
  const navigate = useNavigate();
  const { createUser, isCreatingUser } = useUser();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting: isSubmittingForm },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    mode: "onSubmit",
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const isSubmitting = isSubmittingForm || isCreatingUser;
  const nameErrorMessage = errors.name?.message;
  const emailErrorMessage = errors.email?.message;
  const passwordErrorMessage = errors.password?.message;
  const confirmPasswordErrorMessage = errors.confirmPassword?.message;
  const submitLabel = isSubmitting ? "Cadastrando..." : "Criar conta";
  const nameFieldId = "register-name";
  const emailFieldId = "register-email";
  const passwordFieldId = "register-password";
  const confirmPasswordFieldId = "register-confirm-password";

  async function onValidSubmit(payload: RegisterFormData) {
    const { success } = await createUser({
      name: payload.name.trim(),
      email: payload.email.trim(),
      password: payload.password.trim(),
    });

    if (!success) {
      return;
    }

    toast.success("Cadastro realizado. Verifique seu email para ativar a conta.");
    navigate("/", { replace: true });
  }

  function onInvalidSubmit() {
    const firstErrorMessage = Object.values(errors)[0]?.message;
    toast.error(firstErrorMessage ?? "Verifique os dados do formulário.");
  }

  return (
    <AuthScene
      tone="violet"
      panelEyebrow="Cadastro"
      panelTitle="Comece sua conta"
      panelDescription="Preencha seus dados para criar acesso aos mapas e bibliotecas."
    >
      <form
        className="mt-6 flex flex-col gap-4"
        onSubmit={handleSubmit(onValidSubmit, onInvalidSubmit)}
      >
        <p className="text-sm text-zinc-600 dark:text-zinc-300">
          Crie sua conta para organizar mapas, bibliotecas e conexoes em um so lugar.
        </p>
        <InputRoot disabled={isSubmitting}>
          <label
            htmlFor={nameFieldId}
            className="text-xs font-semibold uppercase tracking-[0.08em] text-zinc-600 dark:text-zinc-300"
          >
            Nome
          </label>
          <InputBox
            data-disabled={isSubmitting}
            data-has-error={Boolean(nameErrorMessage)}
            className="h-11 border-zinc-300 bg-white transition-colors focus-within:border-violet-400 dark:border-zinc-700 dark:bg-zinc-950/60 dark:focus-within:border-violet-400"
          >
            <Input
              id={nameFieldId}
              type="text"
              placeholder="Digite seu nome completo"
              autoComplete="name"
              {...register("name")}
              disabled={isSubmitting}
            />
          </InputBox>
          {nameErrorMessage && <InputError role="alert">{nameErrorMessage}</InputError>}
        </InputRoot>
        <InputRoot disabled={isSubmitting}>
          <label
            htmlFor={emailFieldId}
            className="text-xs font-semibold uppercase tracking-[0.08em] text-zinc-600 dark:text-zinc-300"
          >
            Email
          </label>
          <InputBox
            data-disabled={isSubmitting}
            data-has-error={Boolean(emailErrorMessage)}
            className="h-11 border-zinc-300 bg-white transition-colors focus-within:border-violet-400 dark:border-zinc-700 dark:bg-zinc-950/60 dark:focus-within:border-violet-400"
          >
            <Input
              id={emailFieldId}
              type="email"
              placeholder="voce@empresa.com"
              autoComplete="email"
              {...register("email")}
              disabled={isSubmitting}
            />
          </InputBox>
          {emailErrorMessage && <InputError role="alert">{emailErrorMessage}</InputError>}
        </InputRoot>
        <InputRoot disabled={isSubmitting}>
          <label
            htmlFor={passwordFieldId}
            className="text-xs font-semibold uppercase tracking-[0.08em] text-zinc-600 dark:text-zinc-300"
          >
            Senha
          </label>
          <InputBox
            data-disabled={isSubmitting}
            data-has-error={Boolean(passwordErrorMessage)}
            className="h-11 border-zinc-300 bg-white transition-colors focus-within:border-violet-400 dark:border-zinc-700 dark:bg-zinc-950/60 dark:focus-within:border-violet-400"
          >
            <Input
              id={passwordFieldId}
              type="password"
              placeholder="Crie uma senha"
              autoComplete="new-password"
              {...register("password")}
              disabled={isSubmitting}
            />
          </InputBox>
          {passwordErrorMessage && <InputError role="alert">{passwordErrorMessage}</InputError>}
        </InputRoot>
        <InputRoot disabled={isSubmitting}>
          <label
            htmlFor={confirmPasswordFieldId}
            className="text-xs font-semibold uppercase tracking-[0.08em] text-zinc-600 dark:text-zinc-300"
          >
            Confirmar senha
          </label>
          <InputBox
            data-disabled={isSubmitting}
            data-has-error={Boolean(confirmPasswordErrorMessage)}
            className="h-11 border-zinc-300 bg-white transition-colors focus-within:border-violet-400 dark:border-zinc-700 dark:bg-zinc-950/60 dark:focus-within:border-violet-400"
          >
            <Input
              id={confirmPasswordFieldId}
              type="password"
              placeholder="Repita sua senha"
              autoComplete="new-password"
              {...register("confirmPassword")}
              disabled={isSubmitting}
            />
          </InputBox>
          {confirmPasswordErrorMessage && <InputError role="alert">{confirmPasswordErrorMessage}</InputError>}
        </InputRoot>
        <Button
          type="submit"
          disabled={isSubmitting}
          className="mt-2 h-11 w-full bg-violet-400 text-white hover:bg-violet-500 dark:bg-violet-400 dark:hover:bg-violet-500"
        >
          {isSubmitting && <LoaderCircle className="size-4 animate-spin" />}
          {submitLabel}
        </Button>
        <p className="text-center text-sm text-zinc-600 dark:text-zinc-300">
          Já possui conta?{" "}
          <Link to="/login" className="font-semibold text-violet-400 underline-offset-4 hover:underline dark:text-violet-300">
            Fazer login
          </Link>
        </p>
      </form>
    </AuthScene>
  );
}

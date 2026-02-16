import { AuthScene } from "@/components/auth/AuthScene";
import { Button } from "@/components/ui/button";
import { useUser } from "@/hooks/useUser";
import { Input, InputBox, InputError, InputRoot } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderCircle } from "lucide-react";
import { useForm } from "react-hook-form";
import { Link, useLocation, useNavigate } from "react-router";
import { toast } from "sonner";
import { z } from "zod";

const loginSchema = z.object({
  email: z.email("Digite um email válido."),
  password: z.string().min(8, "A senha precisa ter pelo menos 8 caracteres."),
});

type LoginFormData = z.infer<typeof loginSchema>;

export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isLoggingIn } = useUser();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting: isSubmittingForm },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: "onSubmit",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const isSubmitting = isSubmittingForm || isLoggingIn;
  const emailErrorMessage = errors.email?.message;
  const passwordErrorMessage = errors.password?.message;
  const submitLabel = isSubmitting ? "Entrando..." : "Entrar";
  const emailFieldId = "login-email";
  const passwordFieldId = "login-password";

  async function onValidSubmit(payload: LoginFormData) {
    const { success } = await login({
      email: payload.email.trim(),
      password: payload.password.trim(),
    });

    if (!success) {
      return;
    }

    toast.success("Login realizado com sucesso.");

    const routeState = location.state as { from?: string } | null;
    const destination =
      routeState?.from && routeState.from !== "/" ? routeState.from : "/home";

    navigate(destination, { replace: true });
  }

  function onInvalidSubmit() {
    const firstErrorMessage = Object.values(errors)[0]?.message;
    toast.error(firstErrorMessage ?? "Verifique os dados do formulário.");
  }

  return (
    <AuthScene tone="violet">
      <form
        className="mt-6 flex flex-col gap-4"
        onSubmit={handleSubmit(onValidSubmit, onInvalidSubmit)}
      >
        <p className="text-sm text-zinc-600 dark:text-zinc-300">
          Use o email da sua conta para acessar seu espaco de trabalho.
        </p>

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
              placeholder="Digite sua senha"
              autoComplete="current-password"
              {...register("password")}
              disabled={isSubmitting}
            />
          </InputBox>
          {passwordErrorMessage && (
            <InputError role="alert">{passwordErrorMessage}</InputError>
          )}
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
          Ainda não tem conta?{" "}
          <Link
            to="/register"
            className="font-semibold text-violet-400 underline-offset-4 hover:underline dark:text-violet-300"
          >
            Criar cadastro
          </Link>
        </p>
      </form>
    </AuthScene>
  );
}

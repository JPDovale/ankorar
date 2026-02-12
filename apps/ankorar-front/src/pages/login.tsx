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
    <AuthScene>
      <form
        className="mt-6 flex flex-col gap-3"
        onSubmit={handleSubmit(onValidSubmit, onInvalidSubmit)}
      >
        <InputRoot disabled={isSubmitting}>
          <span className="text-xs">Email</span>
          <InputBox
            data-disabled={isSubmitting}
            data-has-error={Boolean(errors.email?.message)}
          >
            <Input
              type="email"
              placeholder="Digite seu email"
              autoComplete="email"
              {...register("email")}
              disabled={isSubmitting}
            />
          </InputBox>
          {errors.email?.message ? <InputError>{errors.email.message}</InputError> : null}
        </InputRoot>

        <InputRoot disabled={isSubmitting}>
          <span className="text-xs">Senha</span>
          <InputBox
            data-disabled={isSubmitting}
            data-has-error={Boolean(errors.password?.message)}
          >
            <Input
              type="password"
              placeholder="Digite sua senha"
              autoComplete="current-password"
              {...register("password")}
              disabled={isSubmitting}
            />
          </InputBox>
          {errors.password?.message ? (
            <InputError>{errors.password.message}</InputError>
          ) : null}
        </InputRoot>

        <Button
          type="submit"
          disabled={isSubmitting}
          className="mt-2 w-full bg-violet-600 text-zinc-100 hover:bg-violet-700"
        >
          {isSubmitting ? (
            <>
              <LoaderCircle className="size-4 animate-spin" />
              Entrando...
            </>
          ) : (
            "Entrar"
          )}
        </Button>

        <p className="text-center text-sm text-zinc-600 dark:text-zinc-300">
          Ainda não tem conta?{" "}
          <Link
            to="/register"
            className="font-semibold text-violet-600 hover:underline"
          >
            Criar cadastro
          </Link>
        </p>
      </form>
    </AuthScene>
  );
}

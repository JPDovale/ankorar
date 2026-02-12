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
    <AuthScene subtitle="Crie sua conta para começar a organizar suas ideias">
      <form
        className="mt-6 flex flex-col gap-3"
        onSubmit={handleSubmit(onValidSubmit, onInvalidSubmit)}
      >
        <InputRoot disabled={isSubmitting}>
          <span className="text-xs">Nome</span>
          <InputBox
            data-disabled={isSubmitting}
            data-has-error={Boolean(errors.name?.message)}
          >
            <Input
              type="text"
              placeholder="Digite seu nome"
              autoComplete="name"
              {...register("name")}
              disabled={isSubmitting}
            />
          </InputBox>
          {errors.name?.message ? <InputError>{errors.name.message}</InputError> : null}
        </InputRoot>

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
              placeholder="Crie uma senha"
              autoComplete="new-password"
              {...register("password")}
              disabled={isSubmitting}
            />
          </InputBox>
          {errors.password?.message ? (
            <InputError>{errors.password.message}</InputError>
          ) : null}
        </InputRoot>

        <InputRoot disabled={isSubmitting}>
          <span className="text-xs">Confirmar senha</span>
          <InputBox
            data-disabled={isSubmitting}
            data-has-error={Boolean(errors.confirmPassword?.message)}
          >
            <Input
              type="password"
              placeholder="Repita sua senha"
              autoComplete="new-password"
              {...register("confirmPassword")}
              disabled={isSubmitting}
            />
          </InputBox>
          {errors.confirmPassword?.message ? (
            <InputError>{errors.confirmPassword.message}</InputError>
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
              Cadastrando...
            </>
          ) : (
            "Criar conta"
          )}
        </Button>

        <p className="text-center text-sm text-zinc-600 dark:text-zinc-300">
          Já possui conta?{" "}
          <Link to="/" className="font-semibold text-violet-600 hover:underline">
            Fazer login
          </Link>
        </p>
      </form>
    </AuthScene>
  );
}

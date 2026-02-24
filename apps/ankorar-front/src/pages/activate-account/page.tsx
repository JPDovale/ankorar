import { AuthScene } from "@/components/auth/AuthScene";
import { Button } from "@/components/ui/button";
import { activateAccountRequest } from "@/services/activation/activateAccountRequest";
import { CheckCircle2, LoaderCircle, XCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";

type ActivateStatus = "idle" | "loading" | "success" | "error";

/** Reutiliza a mesma requisição por token (evita dupla chamada no Strict Mode e garante que ambos os mounts recebam o resultado). */
const activationPromises = new Map<
  string,
  ReturnType<typeof activateAccountRequest>
>();

export function ActivateAccountPage() {
  const { tokenId } = useParams<{ tokenId: string }>();
  const [status, setStatus] = useState<ActivateStatus>("idle");
  const [errorMessage, setErrorMessage] = useState<string>("");

  useEffect(() => {
    if (!tokenId) {
      setStatus("error");
      setErrorMessage("Link de ativação inválido.");
      return;
    }
    const id: string = tokenId;

    let cancelled = false;

    async function activate() {
      setStatus("loading");
      setErrorMessage("");

      let promise = activationPromises.get(id);
      if (!promise) {
        promise = activateAccountRequest(id);
        activationPromises.set(id, promise);
      }

      const response = await promise;
      activationPromises.delete(id);

      if (cancelled) return;

      if (response.status === 200) {
        setStatus("success");
        return;
      }

      setStatus("error");
      const message =
        (response as { error?: { message?: string } }).error?.message ??
        "Link expirado ou já utilizado. Solicite um novo e-mail de confirmação.";
      setErrorMessage(message);
    }

    activate();
    return () => {
      cancelled = true;
    };
  }, [tokenId]);

  return (
    <AuthScene
      tone="violet"
      panelEyebrow="Ativação"
      panelTitle="Ative sua conta"
      panelDescription="Use o link enviado por e-mail para ativar e fazer login."
    >
      <div className="mt-6 flex flex-col items-center gap-6 text-center">
        {status === "loading" && (
          <>
            <div className="flex size-14 items-center justify-center rounded-2xl bg-violet-100 text-violet-600">
              <LoaderCircle className="size-8 animate-spin" aria-hidden />
            </div>
            <div className="space-y-1">
              <h1 className="text-lg font-semibold text-zinc-900">
                Ativando sua conta
              </h1>
              <p className="text-sm text-zinc-500">
                Aguarde um momento...
              </p>
            </div>
          </>
        )}

        {status === "success" && (
          <>
            <div className="flex size-14 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600">
              <CheckCircle2 className="size-8" aria-hidden />
            </div>
            <div className="space-y-1">
              <h1 className="text-lg font-semibold text-zinc-900">
                Conta ativada
              </h1>
              <p className="text-sm text-zinc-500">
                Sua conta foi ativada. Faça login para continuar.
              </p>
            </div>
            <Button size="lg" className="mt-2" asChild>
              <Link to="/login">Ir para o login</Link>
            </Button>
          </>
        )}

        {status === "error" && (
          <>
            <div className="flex size-14 items-center justify-center rounded-2xl bg-red-100 text-red-600">
              <XCircle className="size-8" aria-hidden />
            </div>
            <div className="space-y-1">
              <h1 className="text-lg font-semibold text-zinc-900">
                Não foi possível ativar
              </h1>
              <p className="text-sm text-zinc-500">{errorMessage}</p>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row">
              <Button variant="outline" size="sm" asChild>
                <Link to="/login">Ir para o login</Link>
              </Button>
              <Button variant="outline" size="sm" asChild>
                <Link to="/register">Criar nova conta</Link>
              </Button>
            </div>
          </>
        )}

        {status === "idle" && (
          <div className="flex size-14 items-center justify-center rounded-2xl bg-zinc-100">
            <LoaderCircle className="size-8 animate-spin text-zinc-400" />
          </div>
        )}
      </div>
    </AuthScene>
  );
}

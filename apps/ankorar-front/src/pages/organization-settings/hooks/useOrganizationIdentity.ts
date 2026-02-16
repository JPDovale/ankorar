import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { updateOrganizationNameRequest } from "@/services/organizations/updateOrganizationNameRequest";
import { useOrganizations } from "@/hooks/useOrganizations";

const organizationIdentitySchema = z.object({
  organizationName: z
    .string()
    .trim()
    .min(3, "O nome precisa ter pelo menos 3 caracteres.")
    .max(120, "O nome precisa ter no maximo 120 caracteres."),
});

type OrganizationIdentityFormData = z.infer<typeof organizationIdentitySchema>;

export function useOrganizationIdentity() {
  const { organizations, refetchOrganizations } = useOrganizations();

  const currentOrganization = organizations.find((o) => o.is_current);
  const currentOrganizationId = currentOrganization?.id ?? "";
  const currentOrganizationName = currentOrganization?.name ?? "";

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting: isSubmittingIdentity },
  } = useForm<OrganizationIdentityFormData>({
    resolver: zodResolver(organizationIdentitySchema),
    mode: "onSubmit",
    defaultValues: {
      organizationName: "",
    },
  });

  const formOrganizationName = watch("organizationName");

  useEffect(() => {
    if (currentOrganizationId && currentOrganizationName) {
      reset({ organizationName: currentOrganizationName });
    }
  }, [currentOrganizationId, currentOrganizationName, reset]);

  const organizationNameErrorMessage = errors.organizationName?.message;

  async function onValidIdentitySubmit(payload: OrganizationIdentityFormData) {
    const normalizedName = payload.organizationName.trim();

    try {
      const response = await updateOrganizationNameRequest({
        name: normalizedName,
      });

      if (response.status !== 200) {
        const message =
          (response as { error?: { message?: string } }).error?.message ??
          "Nao foi possivel salvar o nome da organizacao.";
        toast.error(message);
        return;
      }

      toast.success("Nome da organizacao atualizado.");
      await refetchOrganizations();
      reset({ organizationName: normalizedName });
    } catch (err) {
      const message =
        err && typeof err === "object" && "message" in err
          ? String((err as { message: unknown }).message)
          : "Nao foi possivel salvar o nome da organizacao.";
      toast.error(message);
    }
  }

  function onInvalidIdentitySubmit() {
    const firstErrorMessage = Object.values(errors)[0]?.message;
    toast.error(firstErrorMessage ?? "Verifique os dados do formulario.");
  }

  return {
    handleIdentitySubmit: handleSubmit(
      onValidIdentitySubmit,
      onInvalidIdentitySubmit,
    ),
    isSubmittingIdentity,
    organizationNameErrorMessage,
    register,
    formOrganizationName: formOrganizationName ?? "",
  };
}

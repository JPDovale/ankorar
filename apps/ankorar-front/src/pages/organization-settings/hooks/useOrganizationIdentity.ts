import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const organizationIdentitySchema = z.object({
  organizationName: z
    .string()
    .trim()
    .min(3, "O nome precisa ter pelo menos 3 caracteres.")
    .max(120, "O nome precisa ter no maximo 120 caracteres."),
});

type OrganizationIdentityFormData = z.infer<typeof organizationIdentitySchema>;

export function useOrganizationIdentity() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting: isSubmittingIdentity },
  } = useForm<OrganizationIdentityFormData>({
    resolver: zodResolver(organizationIdentitySchema),
    mode: "onSubmit",
    defaultValues: {
      organizationName: "Ankorar Labs",
    },
  });

  const organizationNameErrorMessage = errors.organizationName?.message;

  async function onValidIdentitySubmit(payload: OrganizationIdentityFormData) {
    const normalizedName = payload.organizationName.trim();
    toast.info(
      `Placeholder: salvar nome da organizacao para "${normalizedName}" quando a API estiver disponivel.`,
    );
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
  };
}

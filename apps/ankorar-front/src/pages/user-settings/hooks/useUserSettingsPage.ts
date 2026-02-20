import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useUser } from "@/hooks/useUser";

const profileSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, "Nome deve ter no mínimo 3 caracteres")
    .max(256, "Nome deve ter no máximo 256 caracteres"),
  email: z.string().email("E-mail inválido").trim().toLowerCase(),
});

const passwordSchema = z
  .object({
    current_password: z.string().min(1, "Informe a senha atual"),
    new_password: z
      .string()
      .min(8, "A nova senha deve ter no mínimo 8 caracteres")
      .max(60, "A nova senha deve ter no máximo 60 caracteres"),
    confirm_password: z.string().min(1, "Confirme a nova senha"),
  })
  .refine((data) => data.new_password === data.confirm_password, {
    message: "As senhas não coincidem",
    path: ["confirm_password"],
  });

export type ProfileFormData = z.infer<typeof profileSchema>;
export type PasswordFormData = z.infer<typeof passwordSchema>;

export function useUserSettingsPage() {
  const {
    user,
    updateUser,
    updateUserPassword,
    isUpdatingUser,
    isUpdatingUserPassword,
  } = useUser();

  const profileForm = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    mode: "onSubmit",
    defaultValues: { name: "", email: "" },
  });

  const passwordForm = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
    mode: "onSubmit",
    defaultValues: {
      current_password: "",
      new_password: "",
      confirm_password: "",
    },
  });

  useEffect(() => {
    if (user) {
      profileForm.reset({ name: user.name, email: user.email });
    }
  }, [user?.id, user?.name, user?.email]);

  async function onProfileSubmit(payload: ProfileFormData) {
    const success = await updateUser({
      name: payload.name.trim(),
      email: payload.email.trim().toLowerCase(),
    });
    if (success) profileForm.reset(payload);
  }

  async function onPasswordSubmit(payload: PasswordFormData) {
    const success = await updateUserPassword({
      current_password: payload.current_password,
      new_password: payload.new_password,
    });
    if (success) passwordForm.reset();
  }

  return {
    profileForm,
    passwordForm,
    onProfileSubmit,
    onPasswordSubmit,
    isUpdatingUser,
    isUpdatingUserPassword,
  };
}

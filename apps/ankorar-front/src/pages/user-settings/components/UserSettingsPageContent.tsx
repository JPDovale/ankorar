import { Separator } from "@/components/ui/separator";
import { useUserSettingsPage } from "../hooks/useUserSettingsPage";
import { UserPasswordSection } from "./UserPasswordSection";
import { UserProfileSection } from "./UserProfileSection";

export function UserSettingsPageContent() {
  const {
    profileForm,
    passwordForm,
    onProfileSubmit,
    onPasswordSubmit,
    isUpdatingUser,
    isUpdatingUserPassword,
  } = useUserSettingsPage();

  return (
    <section className="space-y-8">
      <header className="space-y-1">
        <h1 className="text-xl font-semibold tracking-tight text-zinc-900">
          Minha conta
        </h1>
        <p className="text-sm text-zinc-500">
          Atualize seu perfil e senha quando quiser.
        </p>
      </header>

      <div className="space-y-10">
        <UserProfileSection
          handleSubmit={profileForm.handleSubmit(onProfileSubmit)}
          isSubmitting={isUpdatingUser}
          register={profileForm.register}
          errors={profileForm.formState.errors}
        />

        <Separator />

        <UserPasswordSection
          handleSubmit={passwordForm.handleSubmit(onPasswordSubmit)}
          isSubmitting={isUpdatingUserPassword}
          register={passwordForm.register}
          errors={passwordForm.formState.errors}
        />
      </div>
    </section>
  );
}

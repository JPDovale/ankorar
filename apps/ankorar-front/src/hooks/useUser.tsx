import { librariesQueryKey } from "@/hooks/useLibraries";
import { mapsQueryKey } from "@/hooks/useMaps";
import { useCallback } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { organizationsQueryKey } from "@/hooks/useOrganizations";
import {
  loginRequest,
  type LoginRequestBody,
} from "@/services/session/loginRequest";
import { logoutRequest } from "@/services/session/logoutRequest";
import {
  createUserRequest,
  type CreateUserRequestBody,
} from "@/services/users/createUserRequest";
import { getUserRequest, type User } from "@/services/users/getUserRequest";
import { updateUserPasswordRequest } from "@/services/users/updateUserPasswordRequest";
import { updateUserRequest } from "@/services/users/updateUserRequest";
import { toast } from "sonner";

export const userQueryKey = ["user"] as const;

type UserWithFeatures = { user: User; features: string[] };

function extractUnexpectedErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  return "Não foi possível concluir a operação.";
}

async function getUserQueryFn(): Promise<UserWithFeatures | null> {
  const response = await getUserRequest();

  if (response.status === 200 && response.data?.user) {
    return {
      user: response.data.user,
      features: response.data.features ?? [],
    };
  }

  return null;
}

interface LoginMutationResult {
  success: boolean;
  user: User | null;
  features: string[];
}

interface CreateUserMutationResult {
  success: boolean;
}

interface LogoutMutationResult {
  success: boolean;
}

interface UpdateUserRequestBody {
  name?: string;
  email?: string;
}

interface UpdateUserPasswordRequestBody {
  current_password: string;
  new_password: string;
}

interface UpdateUserMutationResult {
  success: boolean;
}

interface UpdateUserPasswordMutationResult {
  success: boolean;
}

async function loginMutationFn(
  payload: LoginRequestBody,
): Promise<LoginMutationResult> {
  const loginResponse = await loginRequest(payload);

  if (loginResponse.status !== 201) {
    toast.error(
      loginResponse.error?.message ?? "Não foi possível fazer login.",
      {
        action: loginResponse.error?.action,
      },
    );
    return { success: false, user: null, features: [] };
  }

  const meResponse = await getUserRequest();

  if (meResponse.status === 200 && meResponse.data?.user) {
    return {
      success: true,
      user: meResponse.data.user,
      features: meResponse.data.features ?? [],
    };
  }

  toast.error(
    meResponse.error?.message ??
      "Sessão criada, mas não foi possível carregar o usuário.",
    {
      action: meResponse.error?.action,
    },
  );

  return { success: false, user: null, features: [] };
}

async function createUserMutationFn(
  payload: CreateUserRequestBody,
): Promise<CreateUserMutationResult> {
  const response = await createUserRequest(payload);

  if (response.status !== 201) {
    toast.error(response.error?.message ?? "Não foi possível criar usuário.", {
      action: response.error?.action,
    });
    return { success: false };
  }

  return { success: true };
}

async function logoutMutationFn(): Promise<LogoutMutationResult> {
  const response = await logoutRequest();

  if (response.status !== 200) {
    toast.error(
      response.error?.message ?? "Não foi possível encerrar a sessão.",
      {
        action: response.error?.action,
      },
    );
    return { success: false };
  }

  return { success: true };
}

async function updateUserMutationFn(
  payload: UpdateUserRequestBody,
): Promise<UpdateUserMutationResult> {
  const response = await updateUserRequest(payload);

  if (response.status !== 204) {
    toast.error(
      response.error?.message ?? "Não foi possível atualizar seu perfil.",
      { action: response.error?.action },
    );
    return { success: false };
  }

  return { success: true };
}

async function updateUserPasswordMutationFn(
  payload: UpdateUserPasswordRequestBody,
): Promise<UpdateUserPasswordMutationResult> {
  const response = await updateUserPasswordRequest(payload);

  if (response.status !== 204) {
    toast.error(
      response.error?.message ?? "Não foi possível alterar a senha.",
      { action: response.error?.action },
    );
    return { success: false };
  }

  return { success: true };
}

export function useUser() {
  const queryClient = useQueryClient();

  const userQuery = useQuery({
    queryKey: userQueryKey,
    queryFn: getUserQueryFn,
    staleTime: 5 * 60 * 1000,
    retry: false,
    refetchOnWindowFocus: false,
  });

  const loginUserMutation = useMutation({
    mutationFn: loginMutationFn,
    onSuccess: (result) => {
      if (result.success && result.user) {
        queryClient.setQueryData(userQueryKey, {
          user: result.user,
          features: result.features,
        });
        queryClient.invalidateQueries({
          queryKey: organizationsQueryKey,
        });
      }
    },
  });

  const createUserMutation = useMutation({
    mutationFn: createUserMutationFn,
  });

  const logoutMutation = useMutation({
    mutationFn: logoutMutationFn,
    onSuccess: (result) => {
      if (!result.success) {
        return;
      }

      queryClient.setQueryData(userQueryKey, null);
      queryClient.removeQueries({ queryKey: organizationsQueryKey });
      queryClient.removeQueries({ queryKey: mapsQueryKey });
      queryClient.removeQueries({ queryKey: librariesQueryKey });
    },
  });

  const updateUserMutation = useMutation({
    mutationFn: updateUserMutationFn,
    onSuccess: (result) => {
      if (result.success) {
        queryClient.invalidateQueries({ queryKey: userQueryKey });
        toast.success("Perfil atualizado.");
      }
    },
  });

  const updateUserPasswordMutation = useMutation({
    mutationFn: updateUserPasswordMutationFn,
    onSuccess: (result) => {
      if (result.success) {
        toast.success("Senha alterada com sucesso.");
      }
    },
  });

  const me = userQuery.data;
  const user = me?.user ?? null;
  const features = me?.features ?? [];
  const can = useCallback(
    (feature: string) => features.includes(feature),
    [features],
  );

  const login = useCallback(
    async (payload: LoginRequestBody): Promise<LoginMutationResult> => {
      return loginUserMutation.mutateAsync(payload).catch((error) => {
        toast.error(extractUnexpectedErrorMessage(error));
        return { success: false, user: null };
      });
    },
    [loginUserMutation],
  );

  const createUser = useCallback(
    async (
      payload: CreateUserRequestBody,
    ): Promise<CreateUserMutationResult> => {
      return createUserMutation.mutateAsync(payload).catch((error) => {
        toast.error(extractUnexpectedErrorMessage(error));
        return { success: false };
      });
    },
    [createUserMutation],
  );

  const logout = useCallback(async (): Promise<LogoutMutationResult> => {
    return logoutMutation.mutateAsync().catch((error) => {
      toast.error(extractUnexpectedErrorMessage(error));
      return { success: false };
    });
  }, [logoutMutation]);

  const updateUser = useCallback(
    async (
      payload: UpdateUserRequestBody,
    ): Promise<UpdateUserMutationResult> => {
      return updateUserMutation.mutateAsync(payload).catch((error) => {
        toast.error(extractUnexpectedErrorMessage(error));
        return { success: false };
      });
    },
    [updateUserMutation],
  );

  const updateUserPassword = useCallback(
    async (
      payload: UpdateUserPasswordRequestBody,
    ): Promise<UpdateUserPasswordMutationResult> => {
      return updateUserPasswordMutation.mutateAsync(payload).catch((error) => {
        toast.error(extractUnexpectedErrorMessage(error));
        return { success: false };
      });
    },
    [updateUserPasswordMutation],
  );

  return {
    user,
    features,
    can,
    isLoadingUser: userQuery.isPending,
    refetchUser: userQuery.refetch,
    login,
    createUser,
    logout,
    updateUser,
    updateUserPassword,
    isLoggingIn: loginUserMutation.isPending,
    isCreatingUser: createUserMutation.isPending,
    isLoggingOut: logoutMutation.isPending,
    isUpdatingUser: updateUserMutation.isPending,
    isUpdatingUserPassword: updateUserPasswordMutation.isPending,
  };
}

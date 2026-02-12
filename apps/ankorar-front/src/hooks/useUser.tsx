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
import { toast } from "sonner";

const userQueryKey = ["user"] as const;

function extractUnexpectedErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  return "Não foi possível concluir a operação.";
}

async function getUserQueryFn(): Promise<User | null> {
  const response = await getUserRequest();

  if (response.status === 200 && response.data?.user) {
    return response.data.user;
  }

  return null;
}

interface LoginMutationResult {
  success: boolean;
  user: User | null;
}

interface CreateUserMutationResult {
  success: boolean;
}

interface LogoutMutationResult {
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
    return { success: false, user: null };
  }

  const meResponse = await getUserRequest();

  if (meResponse.status === 200 && meResponse.data?.user) {
    return {
      success: true,
      user: meResponse.data.user,
    };
  }

  toast.error(
    meResponse.error?.message ??
      "Sessão criada, mas não foi possível carregar o usuário.",
    {
      action: meResponse.error?.action,
    },
  );

  return { success: false, user: null };
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
        queryClient.setQueryData(userQueryKey, result.user);
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

  return {
    user: userQuery.data ?? null,
    isLoadingUser: userQuery.isPending,
    refetchUser: userQuery.refetch,
    login,
    createUser,
    logout,
    isLoggingIn: loginUserMutation.isPending,
    isCreatingUser: createUserMutation.isPending,
    isLoggingOut: logoutMutation.isPending,
  };
}

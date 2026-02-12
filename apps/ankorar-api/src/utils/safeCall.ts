export type SafeCallResult<TData, TError = unknown> =
  | {
      success: true;
      data: TData;
      error: null;
    }
  | {
      success: false;
      data: null;
      error: TError;
    };

type SafeCallInput<TData> = Promise<TData> | (() => TData | Promise<TData>);

export async function safeCall<TData, TError = unknown>(
  call: SafeCallInput<TData>,
): Promise<SafeCallResult<TData, TError>> {
  try {
    const data = await (typeof call === "function" ? call() : call);

    return {
      success: true,
      data,
      error: null,
    };
  } catch (error) {
    return {
      success: false,
      data: null,
      error: error as TError,
    };
  }
}

'use client';

import { syncUpdate } from '@/libs/@react-query/taskScheduler';

/**
 * onMutate가 동기적으로 동작하고 listener가 동기적으로 반응하게 합니다.
 */
export function useMutationWithSyncUpdate<
  TData = unknown,
  TError = unknown,
  TVariables = void,
  TContext = unknown,
>(options: MutationOptions<TData, TError, TVariables, TContext>) {
  const mutate = async (
    variables: TVariables,
    callbacks?: {
      onSuccess?: (
        data: TData,
        variables: TVariables,
        context?: TContext,
      ) => void;
      onError?: (
        error: TError,
        variables: TVariables,
        context?: TContext,
      ) => void;
    },
  ): Promise<TData> => {
    const { mutationFn, onMutate, onError, onSettled } = options;

    let context: TContext | undefined;

    try {
      if (onMutate) {
        syncUpdate(() => {
          context = onMutate(variables);
        });
      }

      const data = await mutationFn(variables);

      callbacks?.onSuccess?.(data, variables, context);

      onSettled?.(data, null, variables, context);

      return data;
    } catch (error) {
      callbacks?.onError?.(error as TError, variables, context);

      onError?.(error as TError, variables, context);
      onSettled?.(undefined, error as TError, variables, context);

      throw error;
    }
  };

  return { mutate };
}

interface MutationOptions<TData, TError, TVariables, TContext> {
  mutationFn: (variables: TVariables) => Promise<TData>;
  onMutate?: (variables: TVariables) => TContext;
  onError?: (error: TError, variables: TVariables, context?: TContext) => void;
  onSettled?: (
    data: TData | undefined,
    error: TError | null,
    variables: TVariables,
    context?: TContext,
  ) => void;
}

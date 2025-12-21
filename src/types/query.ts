import { UseMutationOptions } from '@tanstack/react-query';

export type MutationOptions = Omit<UseMutationOptions, 'mutationFn'>;

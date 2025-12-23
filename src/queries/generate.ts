import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { generateImage } from '../api';
import { GenerateImageResponse } from '../types';

type UseGenerateImageOptions = Omit<
  UseMutationOptions<
    GenerateImageResponse,
    AxiosError<{ message: string; nsfw: boolean }>,
    { text: string; size: number }
  >,
  'mutationFn'
>;

export const useGenerateImage = (options?: UseGenerateImageOptions) =>
  useMutation({
    ...options,
    mutationFn: (body) => generateImage(body)
  });

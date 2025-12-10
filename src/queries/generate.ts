import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import { AxiosError, AxiosResponse } from 'axios';
import { generateImage } from '../api';
import { GeneratedImage } from '../types';

type UseGenerateImageOptions = Omit<
  UseMutationOptions<
    AxiosResponse<GeneratedImage>,
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

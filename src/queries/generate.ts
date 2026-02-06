import { type UseMutationOptions, useMutation } from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import { generateImage } from '../api';
import type { GenerateImageResponse } from '../types';

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

import { apis } from '../assets/apis/apis';
import type { GenerateImageBody, GenerateImageResponse } from '../types';
import { req } from '.';

export const generateImage = async (body: GenerateImageBody) => {
	const res = await req.post<GenerateImageResponse>(`v1/${apis.generate}/image`, body);
	return res.data;
};

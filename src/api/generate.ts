import { req } from '.';
import { apis } from '../assets/apis/apis';
import { GenerateImageBody, GenerateImageResponse } from '../types';

export const generateImage = async (body: GenerateImageBody) => {
  const res = await req.post<GenerateImageResponse>(`v1/${apis.generate}/image`, body);
  return res.data;
};

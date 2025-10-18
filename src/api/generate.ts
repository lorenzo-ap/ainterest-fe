import { req } from '.';
import { apis } from '../assets/apis/apis';
import { GeneratedImage } from '../types';

export const generateImage = (text: string, size: number) =>
  req.post<GeneratedImage>(`v1/${apis.generate}/image`, { text, size });

import { authReq } from '.';
import { apis } from '../assets/apis/apis';
import { GeneratedImage } from '../types';

export const generateImage = (text: string, size: number) =>
  authReq.post<GeneratedImage>(`v1/${apis.generate}/image`, { text, size });

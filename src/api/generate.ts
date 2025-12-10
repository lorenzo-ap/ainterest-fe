import { req } from '.';
import { apis } from '../assets/apis/apis';
import { GeneratedImage, GenerateImageBody } from '../types';

export const generateImage = (body: GenerateImageBody) => req.post<GeneratedImage>(`v1/${apis.generate}/image`, body);

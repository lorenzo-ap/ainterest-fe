import { rapidApi } from '../assets/apis/apis';
import { CheckTextResponse, TranslateTextResponse } from '../types';
import { getRapidApiHeaders } from '../utils';
import req from './axios';

export const checkTextForNSFW = (text: string) => {
  const headers = getRapidApiHeaders(rapidApi.nsfw);

  return req.get<CheckTextResponse>(`https://${rapidApi.nsfw}/nsfw?text=${text}`, {
    headers
  });
};

export const translateText = (text: string) => {
  const headers = getRapidApiHeaders(rapidApi.translate);
  const body = {
    texts: [text],
    tls: ['en'],
    sl: 'auto'
  };

  return req.post<TranslateTextResponse[]>(`https://${rapidApi.translate}/translates`, body, {
    headers
  });
};

export const generateImage = (text: string, size: string) => {
  const headers = getRapidApiHeaders(rapidApi.image);
  const body = {
    negative_prompt: 'NSFW',
    prompt: text,
    width: size,
    height: size,
    hr_scale: 2
  };

  return req.post<string>(`https://${rapidApi.image}/image`, body, { headers });
};

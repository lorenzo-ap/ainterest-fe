import axios from 'axios';
import { getRapidApiHeaders } from '../utils';

interface CheckTextResponse {
  flagged: boolean;
  sexual: boolean;
  sexual_score: number;
}

interface TranslateTextResponse {
  code: number;
  texts: string;
  tl: string;
}

export const rapidApiService = {
  checkTextForNSFW: async (text: string) => {
    const headers = getRapidApiHeaders('nsfw-text-detection.p.rapidapi.com');

    return await axios.get<CheckTextResponse>('https://nsfw-text-detection.p.rapidapi.com/nsfw?text=' + text, {
      headers
    });
  },

  translateText: async (text: string) => {
    const headers = getRapidApiHeaders('ai-translate.p.rapidapi.com');
    const body = {
      texts: [text],
      tls: ['en'],
      sl: 'auto'
    };

    return axios.post<TranslateTextResponse[]>('https://ai-translate.p.rapidapi.com/translates', body, {
      headers
    });
  },

  generateImage: async (text: string) => {
    const headers = getRapidApiHeaders('imageai-generator.p.rapidapi.com');
    const body = {
      negative_prompt: 'NSFW',
      prompt: text,
      width: 512,
      height: 512,
      hr_scale: 2
    };

    return axios.post<string>('https://imageai-generator.p.rapidapi.com/image', body, { headers });
  }
};

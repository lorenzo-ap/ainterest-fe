export interface CheckTextResponse {
  flagged: boolean;
  sexual: boolean;
  sexual_score: number;
}

export interface TranslateTextResponse {
  code: number;
  texts: string;
  tl: string;
}

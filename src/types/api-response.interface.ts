export interface APIResponse<T> {
  success: boolean;
  data: T;
}

export interface TranslateAPIResponse {
  code: number;
  texts: string;
  tl: string;
}

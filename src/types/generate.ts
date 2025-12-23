export interface NSFWCheck {
  flagged: boolean;
  sexual: boolean;
  sexual_score: number;
}

export interface GenerateImageResponse {
  originalText: string;
  translatedText: string;
  nsfwCheck: NSFWCheck;
  image: string;
}

export interface GenerateImageBody {
  text: string;
  size: number;
}

export interface GeneratedImage {
  originalText: string;
  translatedText: string;
  nsfwCheck: NSFWCheck;
  image: string;
}

export interface NSFWCheck {
  flagged: boolean;
  sexual: boolean;
  sexual_score: number;
}

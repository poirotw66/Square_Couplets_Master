export interface GenerationResult {
  keyword: string;
  generatedPrompt: string;
  imageUrl?: string;
  blessingPhrase?: string;
}

export interface LoadingState {
  isGeneratingPrompt: boolean;
  isGeneratingImage: boolean;
}

export enum GenerationStatus {
  IDLE = 'IDLE',
  PROCESSING_PROMPT = 'PROCESSING_PROMPT',
  PROCESSING_IMAGE = 'PROCESSING_IMAGE',
  COMPLETED = 'COMPLETED',
  ERROR = 'ERROR'
}

// API Types
export interface GeminiResponse {
  text?: string;
  candidates?: Array<{
    content?: {
      parts?: Array<{
        text?: string;
        inlineData?: {
          mimeType: string;
          data: string;
        };
      }>;
    };
  }>;
}

export interface ApiError {
  status?: number;
  message?: string;
  code?: string;
}

// Settings Types
export interface AppSettings {
  apiKey: string;
  imageModel: 'gemini-2.5-flash-image' | 'gemini-3-pro-image-preview';
  imageSize: '1K' | '2K' | '4K';
}

// Result Types
export interface GenerationResultData {
  prompt: string;
  blessingPhrase: string;
  imageUrl: string;
}
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
  imageModel: ImageModel;
  imageSize: ImageSize;
}

// Result Types
export interface GenerationResultData {
  prompt: string;
  blessingPhrase: string;
  imageUrl: string;
}

// Gemini API Types
export interface GeminiContentPart {
  text?: string;
  inlineData?: {
    mimeType: string;
    data: string;
  };
}

// Error Types
export type ApiErrorInput = 
  | { status?: number; message?: string; code?: string }
  | Error
  | unknown;

// Image Model Types
export type ImageModel = 'gemini-2.5-flash-image' | 'gemini-3-pro-image-preview';
export type ImageSize = '1K' | '2K' | '4K';

// Customization Types
export type ArtStyle = 'traditional' | 'modern' | 'minimalist' | 'luxurious' | 'vintage' | 'contemporary' | 'abstract' | 'realistic' | 'custom';
export type ColorTheme = 'classic-red-gold' | 'elegant-subtle' | 'vibrant-rich' | 'monochrome' | 'pastel-soft' | 'deep-mysterious' | 'warm-earth' | 'cool-blue' | 'custom';
export type CalligraphyStyle = 'kaishu' | 'xingshu' | 'caoshu' | 'lishu' | 'zhuanshu' | 'weibei' | 'custom';
export type DecorationLevel = 'minimal' | 'moderate' | 'rich' | 'extravagant' | 'custom';

export interface CustomizationOptions {
  artStyle: ArtStyle;
  customArtStyle?: string; // Custom art style description
  colorTheme: ColorTheme;
  customColorTheme?: string; // Custom color theme description
  calligraphyStyle: CalligraphyStyle;
  customCalligraphyStyle?: string; // Custom calligraphy style description
  decorationLevel: DecorationLevel;
  customDecorationLevel?: string; // Custom decoration level description
  customBlessingPhrase?: string; // Optional: user can provide their own 4-character phrase
  customStyleDescription?: string; // Optional: user can provide a general style description
}
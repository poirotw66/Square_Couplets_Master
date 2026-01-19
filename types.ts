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
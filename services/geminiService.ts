import { GoogleGenAI, Type } from "@google/genai";
import { 
  DOUFANG_SYSTEM_PROMPT,
  getDoufangSystemPromptWithReference,
  getReferenceImageAnalysisPrompt,
  getSimpleUserInputPrompt,
  getImageGenerationPromptWithReference,
  getDoufangSystemPromptWithCustomization
} from "../constants";
import { processImageDataUrl } from "../utils/imageUtils.node";
import { handleApiError } from "../utils/errorHandler";
import { retryWithBackoff } from "../utils/retry";
import type { GeminiContentPart, CustomizationOptions } from "../types";

const getClient = (apiKey?: string) => {
  // Use user-provided key if available, otherwise fallback to env var
  const userKey = apiKey?.trim();
  const envKey = process.env.API_KEY?.trim();
  const key = userKey || envKey;
  
  if (!key) {
    throw new Error("API Key is missing. Please click the Settings icon to configure your Gemini API Key.");
  }
  
  // Basic validation: API keys should be non-empty strings
  if (typeof key !== 'string' || key.length === 0) {
    throw new Error("Invalid API Key format. Please check your API Key configuration.");
  }
  
  return new GoogleGenAI({ apiKey: key });
};

export const generateDoufangPrompt = async (
  userKeyword: string, 
  apiKey?: string, 
  referenceImageDataUrl?: string | null,
  customizationOptions?: CustomizationOptions,
  signal?: AbortSignal
): Promise<{ blessingPhrase: string; imagePrompt: string }> => {
  return retryWithBackoff(async () => {
    const ai = getClient(apiKey);
    
    try {
      // Check if request was cancelled
      if (signal?.aborted) {
        throw new Error('Request cancelled');
      }

      // Prepare content parts
      const parts: GeminiContentPart[] = [];
    
    // Add reference image if provided - image should come first
    if (referenceImageDataUrl) {
      const imageData = processImageDataUrl(referenceImageDataUrl);
      if (imageData) {
        parts.push({
          inlineData: {
            mimeType: imageData.mimeType,
            data: imageData.base64Data
          }
        });
      } else {
        // Fallback: try to use as-is (may fail, but attempt anyway)
        console.warn('Reference image format may be incorrect, attempting to use as-is');
        parts.push({
          inlineData: {
            mimeType: 'image/jpeg', // Default to JPEG
            data: referenceImageDataUrl.replace(/^data:image\/[^;]+;base64,/, '')
          }
        });
      }
      
      // Add text instruction with reference image context and customization
      parts.push({ 
        text: getReferenceImageAnalysisPrompt(userKeyword, customizationOptions)
      });
    } else {
      // No reference image, use simple text with customization
      parts.push({ 
        text: getSimpleUserInputPrompt(userKeyword, customizationOptions) 
      });
    }
    
    // Get system instruction based on whether reference image is provided and customization options
    const systemInstruction = referenceImageDataUrl 
      ? getDoufangSystemPromptWithReference(customizationOptions)
      : (customizationOptions 
        ? getDoufangSystemPromptWithCustomization(customizationOptions)
        : DOUFANG_SYSTEM_PROMPT);
    
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: {
        parts: parts
      },
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            blessingPhrase: { type: Type.STRING },
            imagePrompt: { type: Type.STRING }
          },
          required: ["blessingPhrase", "imagePrompt"]
        }
      }
    });

    const text = response.text;
    if (!text) {
      throw new Error("No response from Gemini");
    }

      // Check if request was cancelled before parsing
      if (signal?.aborted) {
        throw new Error('Request cancelled');
      }

      return JSON.parse(text);
    } catch (e: unknown) {
      if (signal?.aborted) {
        throw new Error('Request cancelled');
      }
      throw handleApiError(e, 'generateDoufangPrompt');
    }
  });
};

export const generateDoufangImage = async (
  prompt: string, 
  apiKey?: string, 
  model: string = 'gemini-2.5-flash-image', 
  imageSize: '1K' | '2K' | '4K' = '1K', 
  referenceImageDataUrl?: string | null,
  signal?: AbortSignal
): Promise<string> => {
  return retryWithBackoff(async () => {
    const ai = getClient(apiKey);

    // Check if request was cancelled
    if (signal?.aborted) {
      throw new Error('Request cancelled');
    }

    let config: Record<string, unknown> = {};
  
    // Different models have different support for imageConfig
    // Flash model does NOT support imageConfig parameter - it will cause 400 errors
    // Only Pro model supports imageConfig with custom sizes
    if (model === 'gemini-3-pro-image-preview') {
      // Pro model supports all sizes (1K, 2K, 4K)
      config = {
        imageConfig: {
          aspectRatio: "1:1",
          imageSize: imageSize
        }
      };
    }
    // For Flash model: Do NOT set imageConfig at all
    // Flash model only supports default 1K (1024x1024) resolution
    // Setting imageConfig will cause 400 INVALID_ARGUMENT error

    try {
      // Prepare content parts
      const parts: GeminiContentPart[] = [];
    
    // Add reference image if provided - image should come first
    // Note: The prompt already contains style guidance from the reference image
    // (generated in generateDoufangPrompt), so we just need to provide the image
    // as additional visual reference for the image generation model
    if (referenceImageDataUrl) {
      const imageData = processImageDataUrl(referenceImageDataUrl);
      if (imageData) {
        parts.push({
          inlineData: {
            mimeType: imageData.mimeType,
            data: imageData.base64Data
          }
        });
      } else {
        // Fallback: try to use as-is (may fail, but attempt anyway)
        console.warn('Reference image format may be incorrect, attempting to use as-is');
        parts.push({
          inlineData: {
            mimeType: 'image/jpeg', // Default to JPEG
            data: referenceImageDataUrl.replace(/^data:image\/[^;]+;base64,/, '')
          }
        });
      }
      
      // Add prompt with reference image context
      // The prompt already includes style guidance, so we just reinforce it
      parts.push({ 
        text: getImageGenerationPromptWithReference(prompt)
      });
    } else {
      // No reference image, use original prompt
      parts.push({ text: prompt });
    }

    const response = await ai.models.generateContent({
      model: model,
      contents: {
        parts: parts
      },
      config: Object.keys(config).length > 0 ? config : undefined
    });

      // Check if request was cancelled before processing response
      if (signal?.aborted) {
        throw new Error('Request cancelled');
      }

      // Extract image
      for (const part of response.candidates?.[0]?.content?.parts || []) {
        if (part.inlineData) {
          return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
        }
      }

      throw new Error("No image generated in the response.");
    } catch (e: unknown) {
      if (signal?.aborted) {
        throw new Error('Request cancelled');
      }
      
      const error = handleApiError(e, 'generateDoufangImage');
      
      // Add specific context for image size errors
      if (error.code === 'INVALID_REQUEST') {
        if (model === 'gemini-2.5-flash-image') {
          error.userMessage = 'Flash 模型不支援自訂圖片大小設定，僅支援預設 1K (1024×1024) 解析度。如需更高解析度，請使用 Pro 模型。';
        } else if (imageSize === '4K') {
          error.userMessage = '4K 解析度可能不被此模型或您的 API 方案支援，請嘗試 2K 或 1K。';
        }
      }
      
      throw error;
    }
  });
};
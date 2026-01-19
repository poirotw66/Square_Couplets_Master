import { GoogleGenAI, Type } from "@google/genai";
import { 
  DOUFANG_SYSTEM_PROMPT,
  getDoufangSystemPromptWithReference,
  getReferenceImageAnalysisPrompt,
  getSimpleUserInputPrompt,
  getImageGenerationPromptWithReference
} from "../constants";

const getClient = (apiKey?: string) => {
  // Use user-provided key if available, otherwise fallback to env var
  const key = apiKey?.trim() || process.env.API_KEY;
  if (!key) {
    throw new Error("API Key is missing. Please click the Settings icon to configure your Gemini API Key.");
  }
  return new GoogleGenAI({ apiKey: key });
};

export const generateDoufangPrompt = async (userKeyword: string, apiKey?: string, referenceImageDataUrl?: string | null): Promise<{ blessingPhrase: string; imagePrompt: string }> => {
  const ai = getClient(apiKey);
  
  try {
    // Prepare content parts
    const parts: any[] = [];
    
    // Add reference image if provided - image should come first
    if (referenceImageDataUrl) {
      // Convert data URL to base64 and extract mime type
      const base64Match = referenceImageDataUrl.match(/^data:([^;]+);base64,(.+)$/);
      if (base64Match) {
        const mimeType = base64Match[1];
        const base64Data = base64Match[2];
        
        parts.push({
          inlineData: {
            mimeType: mimeType,
            data: base64Data
          }
        });
      } else {
        // If it's already base64 without data URL prefix
        console.warn('Reference image format may be incorrect, attempting to use as-is');
        parts.push({
          inlineData: {
            mimeType: 'image/jpeg', // Default to JPEG
            data: referenceImageDataUrl.replace(/^data:image\/[^;]+;base64,/, '')
          }
        });
      }
      
      // Add text instruction with reference image context
      parts.push({ 
        text: getReferenceImageAnalysisPrompt(userKeyword)
      });
    } else {
      // No reference image, use simple text
      parts.push({ text: getSimpleUserInputPrompt(userKeyword) });
    }
    
    // Get system instruction based on whether reference image is provided
    const systemInstruction = referenceImageDataUrl 
      ? getDoufangSystemPromptWithReference()
      : DOUFANG_SYSTEM_PROMPT;
    
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

    return JSON.parse(text);
  } catch (e: any) {
    console.error("Prompt generation failed", e);
    if (e.status === 403 || e.message?.includes("403")) {
      throw new Error("Permission Denied (403) during text generation. Your API Key might be invalid or lacks access to 'gemini-3-flash-preview'.");
    }
    throw e;
  }
};

export const generateDoufangImage = async (prompt: string, apiKey?: string, model: string = 'gemini-2.5-flash-image', imageSize: '1K' | '2K' | '4K' = '1K', referenceImageDataUrl?: string | null): Promise<string> => {
  const ai = getClient(apiKey);

  let config: any = {};
  
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
    const parts: any[] = [];
    
    // Add reference image if provided - image should come first
    // Note: The prompt already contains style guidance from the reference image
    // (generated in generateDoufangPrompt), so we just need to provide the image
    // as additional visual reference for the image generation model
    if (referenceImageDataUrl) {
      // Convert data URL to base64 and extract mime type
      const base64Match = referenceImageDataUrl.match(/^data:([^;]+);base64,(.+)$/);
      if (base64Match) {
        const mimeType = base64Match[1];
        const base64Data = base64Match[2];
        
        parts.push({
          inlineData: {
            mimeType: mimeType,
            data: base64Data
          }
        });
      } else {
        // If it's already base64 without data URL prefix, try to detect mime type
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

    // Extract image
    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
      }
    }

    throw new Error("No image generated in the response.");
  } catch (e: any) {
    console.error("Image generation failed", e);
    
    // Handle errors related to reference images
    if (referenceImageDataUrl && (e.status === 400 || e.message?.includes("400") || e.message?.includes("INVALID_ARGUMENT"))) {
      // Check if error might be related to reference image format
      if (e.message?.includes("image") || e.message?.includes("format") || e.message?.includes("mime")) {
        throw new Error(`Reference image format may not be supported. Please try a different image (JPG, PNG recommended). Original error: ${e.message}`);
      }
    }
    
    // Handle 400 errors - invalid argument
    if (e.status === 400 || e.message?.includes("400") || e.message?.includes("INVALID_ARGUMENT")) {
      if (model === 'gemini-2.5-flash-image') {
        // Flash model does not support imageConfig parameter at all
        throw new Error(`Flash model does not support custom image size settings. It only supports default 1K (1024×1024) resolution. Please use the Pro model if you need higher resolutions (2K/4K).`);
      } else if (imageSize === '4K') {
        // 4K might not be supported, suggest 2K
        throw new Error(`4K resolution may not be supported by this model or your API plan. Please try 2K or 1K in Settings.`);
      } else {
        throw new Error(`Invalid request: ${e.message || 'The selected image size or model configuration is not supported. Please try a different size (1K) or check your API settings.'}`);
      }
    }
    
    if (e.status === 403 || e.message?.includes("403")) {
      if (model === 'gemini-3-pro-image-preview') {
        throw new Error(`Permission Denied (403). The 'Pro' model requires a Paid API Key (Billing Enabled). Please switch to 'Flash' in Settings or use a key with billing.`);
      }
      throw new Error(`Permission Denied (403). Your API Key is invalid or does not have access to ${model}.`);
    }
    
    throw e;
  }
};
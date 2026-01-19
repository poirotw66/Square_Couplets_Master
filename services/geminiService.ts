import { GoogleGenAI, Type } from "@google/genai";
import { DOUFANG_SYSTEM_PROMPT } from "../constants";

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
        text: `User input keyword: 「${userKeyword}」

CRITICAL INSTRUCTION: A reference image has been provided above. You MUST analyze this reference image in detail and generate a prompt that DIRECTLY USES the reference image's visual content, patterns, and style.

STEP-BY-STEP ANALYSIS REQUIRED:
1. FIRST, describe what you see in the reference image:
   - What is the main subject or central figure? (e.g., samurai, warrior, character, object, etc.)
   - What specific visual patterns, motifs, or decorative elements are present?
   - What is the composition structure? How are elements arranged?
   - What are the distinctive visual characteristics? (shapes, forms, graphic elements)
   - What background elements or environmental details are visible?

2. THEN, identify the artistic style:
   - What is the artistic technique? (ink wash, brush painting, illustration style, etc.)
   - What is the color palette? (specific colors, tones, contrast levels)
   - What is the brushwork quality? (bold strokes, fine lines, texture, etc.)
   - What is the visual mood? (dramatic, serene, energetic, etc.)
   - What material/texture characteristics are visible?

3. FINALLY, generate a prompt that:
   - DIRECTLY incorporates the main subject or key visual elements from the reference image
   - PRESERVES the exact visual patterns, motifs, and decorative elements visible in the reference
   - MAINTAINS the same artistic style, brushwork, and technique
   - USES the same color palette and visual mood
   - ADAPTS these elements to the diamond-shaped Doufang format while keeping the reference image's visual identity
   - BLENDS the user's keyword (${userKeyword}) with the reference image's visual content

The generated prompt MUST explicitly describe:
- The specific visual elements from the reference image to be included
- How to recreate the reference image's patterns and motifs in the Doufang
- The exact artistic style and technique to match the reference
- The color palette and visual characteristics to preserve

DO NOT create generic descriptions. Be SPECIFIC about what you see in the reference image and how to recreate it.` 
      });
    } else {
      // No reference image, use simple text
      parts.push({ text: `User input keyword: 「${userKeyword}」` });
    }
    
    // Modify system instruction if reference image is provided
    let systemInstruction = DOUFANG_SYSTEM_PROMPT;
    if (referenceImageDataUrl) {
      systemInstruction = `You are a professional Chinese New Year couplet and calligraphy art designer.

IMPORTANT: The user has provided a REFERENCE IMAGE. The reference image is the PRIMARY source of visual inspiration. Your task is to analyze the reference image and generate a prompt that DIRECTLY incorporates its visual content, patterns, and style into a Chinese New Year Doufang artwork.

Step 1: Understand the meaning and blessing intention of the keyword.
- If the keyword is about wealth -> design a wealth-themed couplet.
- If about health -> design a health & longevity themed couplet.
- If about career -> design a success & promotion themed couplet.
- If about peace -> design a safety & harmony themed couplet.
- If about love -> design a relationship & harmony themed couplet.
- If about study -> design wisdom & academic success themed couplet.
- If about general luck -> design auspicious & good fortune themed couplet.

Step 2: Decide the final 4-character Chinese blessing phrase automatically.
- The phrase must be elegant, common in Chinese New Year usage, and culturally appropriate.
- If the user input itself is suitable (e.g. "馬上發財", "平安喜樂"), you may use it directly.
- Otherwise, transform or upgrade it into a proper 4-character blessing phrase.

Step 3: Analyze the reference image FIRST, then generate the artwork prompt.

REFERENCE IMAGE ANALYSIS (MUST DO FIRST):
1. Identify the main subject: What is the central figure, character, or primary visual element in the reference image? (e.g., samurai, warrior, animal, object, scene, etc.)
2. Identify visual patterns: What specific patterns, motifs, decorative elements, symbols, or visual details are visible?
3. Identify composition: How are elements arranged? What is the layout structure?
4. Identify artistic style: What is the technique? (ink wash, brush painting, illustration, etc.)
5. Identify visual characteristics: Colors, brushwork, texture, mood, atmosphere

PROMPT GENERATION REQUIREMENTS:
- The generated prompt MUST directly incorporate the main subject or key visual elements from the reference image
- The prompt MUST preserve the specific patterns, motifs, and decorative elements visible in the reference image
- The prompt MUST maintain the exact artistic style, brushwork technique, and visual characteristics from the reference image
- The prompt MUST use the same color palette and visual mood as the reference image
- The prompt should adapt these elements to a diamond-shaped Doufang format while preserving the reference image's visual identity
- The prompt should blend the Chinese New Year theme and blessing phrase with the reference image's visual content

The generated prompt must be SPECIFIC and DETAILED about:
- What visual elements from the reference image to include (be specific about what you see)
- How to recreate the reference image's patterns and style
- The exact artistic technique to match the reference
- The color palette and visual characteristics to preserve

DO NOT create generic descriptions. Be SPECIFIC about the reference image's content and how to recreate it in the Doufang artwork.

Artwork description:
A diamond-shaped Chinese New Year "Doufang" couplet on antique gold-flecked red Xuan paper.

Central theme: bold, powerful, energetic traditional Chinese ink wash calligraphy of the final 4-character blessing phrase: [INSERT PHRASE HERE].

Around the calligraphy: symbolic elements that visually represent the user's keyword, painted in traditional Chinese ink painting style (for example: horse, dragon, pine tree, crane, gold ingots, clouds, mountains, sun, plum blossoms, etc).

Style: traditional Chinese ink painting mixed with realistic illustration, elegant, prestigious, festive but high-class, not cartoon.

Material & texture: real Xuan paper texture, gold flecks, red rice paper, visible paper fibers, natural ink diffusion, subtle embossed gold foil details.

Color theme: deep Chinese red, gold, black ink, warm highlights.

Lighting: soft studio lighting, gentle glow on gold details, museum-quality artwork.

Composition: 
The diamond-shaped Doufang is fully visible and centered, with generous blank margins around all four corners.
The entire artwork is fully inside the frame, not touching any edge, not cropped, not cut off.
Clear safe area padding around the diamond shape for printing.
Clean background, symmetrical, perfectly framed, suitable for printing and hanging on wall.

Quality: ultra high detail, 8k, masterpiece, professional artwork, 1:1 aspect ratio.

Framing requirements:
- The entire diamond-shaped Doufang must be fully visible inside the image.
- No part of the artwork is cut off, cropped, out of frame, or touching the image borders.
- Wide safe margins around the artwork.

Text requirements:
- The Chinese characters must be clear, correct, readable.
- No typo, no deformed text.
- No modern elements, no western style, no watermark.

OUTPUT FORMAT:
Return a JSON object with the following structure:
{
  "blessingPhrase": "The 4 character phrase you chose",
  "imagePrompt": "The full detailed English image generation prompt that directly incorporates the reference image's visual content, patterns, and style."
}`;
    }
    
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
        text: `${prompt}

Note: The reference image provided above should be used as a visual style guide. Follow the style, color palette, and artistic approach described in the prompt, which was generated based on analysis of this reference image.` 
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
---
name: generate-doufang-image
description: Generate Doufang artwork images using Google Gemini API. Use when user wants to create actual artwork images from prompts. Supports both Gemini 2.5 Flash and Gemini 3 Pro models with different resolutions.
---

# generate-doufang-image Skill

## Instructions

When user wants to generate an actual Doufang artwork image:

1. **Check for API key:**
   - First, check for `GEMINI_API_KEY` in environment variables
   - If not found, check for `API_KEY` environment variable
   - If still not found, prompt user to provide API key or configure it in settings

2. **Select appropriate model:**
   - **Gemini 2.5 Flash** (`gemini-2.5-flash-image`):
     - Fast generation
     - 1K resolution only (1024×1024)
     - Good for quick iterations and testing
     - Free-friendly (works with free API keys)
   - **Gemini 3 Pro** (`gemini-3-pro-image-preview`):
     - Higher quality with richer details
     - Supports 1K, 2K, and 4K resolutions
     - Better style understanding
     - Requires paid API key (billing enabled)

3. **Handle reference image (if provided):**
   - If user provides a reference image, include it in the generation
   - Process the image: compress if needed, convert to base64
   - Pass reference image to both prompt generation and image generation steps
   - Ensure the generated prompt incorporates the reference image's style

4. **Generate image using the prompt:**
   - Use the image prompt from `generate-doufang-prompt` skill or user-provided prompt
   - If reference image provided, enhance the prompt with style guidance
   - Handle errors gracefully with user-friendly messages
   - Retry on transient errors (500, 503, network errors)

5. **Return the result:**
   - Return base64 encoded image data URL
   - Or save to file if user requests file output
   - Provide download link or file path

## Parameters

- `prompt` (required): The image generation prompt (from `generate-doufang-prompt` or user-provided)
- `model` (optional): 
  - `"gemini-2.5-flash-image"` (default, fast, 1K only)
  - `"gemini-3-pro-image-preview"` (high quality, supports 1K/2K/4K)
- `imageSize` (optional): 
  - `"1K"` (1024×1024, default, works with both models)
  - `"2K"` (2048×2048, Pro model only)
  - `"4K"` (4096×4096, Pro model only)
- `apiKey` (optional): Gemini API key (if not in environment)
- `referenceImage` (optional): Base64 encoded reference image or image file path

## Model Selection Guidelines

**Use Gemini 2.5 Flash when:**
- User wants fast generation
- User has free API key
- User is testing or iterating
- 1K resolution is sufficient

**Use Gemini 3 Pro when:**
- User wants highest quality
- User needs 2K or 4K resolution
- User wants better style understanding
- User has paid API key with billing enabled
- User wants final artwork for printing

## Examples

### Example 1: Basic Generation with Flash Model

**Input:**
```json
{
  "prompt": "A diamond-shaped Chinese New Year Doufang couplet on antique gold-flecked red Xuan paper...",
  "model": "gemini-2.5-flash-image",
  "imageSize": "1K",
  "apiKey": "user-api-key"
}
```

**Output:**
- Base64 encoded image data URL: `data:image/png;base64,...`
- Or file saved to: `./output/doufang-招財進寶.png`

### Example 2: High-Quality Generation with Pro Model

**Input:**
```json
{
  "prompt": "A diamond-shaped Chinese New Year Doufang couplet...",
  "model": "gemini-3-pro-image-preview",
  "imageSize": "2K",
  "apiKey": "user-api-key"
}
```

**Output:**
- Base64 encoded 2K resolution image
- Higher quality with more details

### Example 3: With Reference Image

**Input:**
```json
{
  "prompt": "A diamond-shaped Chinese New Year Doufang...",
  "model": "gemini-3-pro-image-preview",
  "imageSize": "2K",
  "referenceImage": "data:image/jpeg;base64,/9j/4AAQSkZJRg...",
  "apiKey": "user-api-key"
}
```

**Output:**
- Image generated with reference style incorporated
- Style elements from reference image preserved

## Error Handling

### Missing API Key
```
Error: API Key is missing. Please configure your Gemini API Key in settings or provide it as a parameter.
```

### Invalid Model/Size Combination
```
Error: Flash model only supports 1K resolution. Please use Pro model for 2K/4K or switch to 1K.
```

### Billing Required (Pro Model)
```
Error: Pro model requires paid API Key (billing enabled). Please switch to Flash model or enable billing for your API key.
```

### Rate Limit
```
Error: Rate limit exceeded. Please wait a moment and try again.
```

### Network Error
```
Error: Network connection error. Please check your internet connection and try again.
```

## Implementation Notes

- Use retry mechanism for transient errors (500, 503, network errors)
- Compress reference images if they exceed 500KB
- Validate image formats (JPEG, PNG supported)
- Handle cancellation signals for long-running requests
- Provide progress updates for image generation

## When to Use

- User wants to generate actual artwork image
- User has a prompt ready and wants to see the result
- User wants to test different models or resolutions
- User wants to generate artwork with reference image style

## When NOT to Use

- User only wants to generate a prompt (use `generate-doufang-prompt` instead)
- User wants to optimize an existing prompt (use `optimize-doufang-prompt` instead)
- User doesn't have API key configured

/**
 * Node.js version of image utilities (no browser APIs)
 * For CLI usage only
 */

/**
 * Process image data URL to extract mime type and base64 data
 */
export function processImageDataUrl(dataUrl: string): { mimeType: string; base64Data: string } | null {
  try {
    const matches = dataUrl.match(/^data:([^;]+);base64,(.+)$/);
    if (!matches) {
      console.warn('Invalid data URL format');
      return null;
    }
    
    return {
      mimeType: matches[1],
      base64Data: matches[2]
    };
  } catch (error) {
    console.error('Error processing image data URL:', error);
    return null;
  }
}

/**
 * Validate image file size (Node.js version - simplified)
 * @param buffer - Image buffer
 * @param maxSizeMB - Maximum file size in MB
 */
export function validateImageSize(buffer: Buffer, maxSizeMB: number = 10): void {
  const sizeMB = buffer.length / (1024 * 1024);
  if (sizeMB > maxSizeMB) {
    throw new Error(`Image file too large: ${sizeMB.toFixed(2)}MB (max: ${maxSizeMB}MB)`);
  }
}

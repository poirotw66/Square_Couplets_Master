import { IMAGE_CONSTANTS } from "../constants";

/**
 * Process image data URL and extract mime type and base64 data
 * @param dataUrl - The data URL string
 * @returns Object with mimeType and base64Data, or null if invalid
 */
export const processImageDataUrl = (dataUrl: string): { mimeType: string; base64Data: string } | null => {
  const base64Match = dataUrl.match(/^data:([^;]+);base64,(.+)$/);
  if (base64Match) {
    return {
      mimeType: base64Match[1],
      base64Data: base64Match[2]
    };
  }
  return null;
};

/**
 * Compress image file to reduce size while maintaining quality
 * @param file - The image file to compress
 * @param maxSizeKB - Maximum file size in KB (default: 500KB)
 * @param maxDimension - Maximum width or height in pixels (default: 1920)
 * @returns Promise resolving to compressed image data URL
 */
export const compressImage = async (
  file: File, 
  maxSizeKB: number = IMAGE_CONSTANTS.MAX_SIZE_KB,
  maxDimension: number = IMAGE_CONSTANTS.MAX_DIMENSION
): Promise<string> => {
  return new Promise((resolve, reject) => {
    // Validate file type
    if (!file.type.startsWith('image/')) {
      reject(new Error('File is not an image'));
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        
        // Calculate new dimensions to fit within maxDimension
        if (width > height && width > maxDimension) {
          height = (height * maxDimension) / width;
          width = maxDimension;
        } else if (height > maxDimension) {
          width = (width * maxDimension) / height;
          height = maxDimension;
        }
        
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        
        if (!ctx) {
          reject(new Error('Could not get canvas context'));
          return;
        }
        
        // Optimize canvas rendering
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        
        // Draw image with new dimensions
        ctx.drawImage(img, 0, 0, width, height);
        
        // Determine output format based on original file type
        const outputFormat = file.type === 'image/png' ? 'image/png' : 'image/jpeg';
        const outputQuality = outputFormat === 'image/png' ? undefined : IMAGE_CONSTANTS.COMPRESSION_QUALITY;
        
        // Convert to blob with quality compression
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error('Failed to compress image'));
              return;
            }
            
            // Check if compressed size is acceptable
            const sizeKB = blob.size / 1024;
            if (sizeKB <= maxSizeKB) {
              // Size is acceptable, convert to data URL
              const reader = new FileReader();
              reader.onload = () => resolve(reader.result as string);
              reader.onerror = () => reject(new Error('Failed to read compressed image'));
              reader.readAsDataURL(blob);
            } else {
              // Still too large, try lower quality
              const quality = Math.max(
                IMAGE_CONSTANTS.MIN_COMPRESSION_QUALITY, 
                IMAGE_CONSTANTS.COMPRESSION_QUALITY * (maxSizeKB / sizeKB)
              );
              canvas.toBlob(
                (compressedBlob) => {
                  if (!compressedBlob) {
                    reject(new Error('Failed to compress image'));
                    return;
                  }
                  const finalReader = new FileReader();
                  finalReader.onload = () => resolve(finalReader.result as string);
                  finalReader.onerror = () => reject(new Error('Failed to read compressed image'));
                  finalReader.readAsDataURL(compressedBlob);
                },
                'image/jpeg',
                quality
              );
            }
          },
          outputFormat,
          outputQuality // Initial quality (undefined for PNG)
        );
      };
      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = e.target?.result as string;
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
};

/**
 * Validate image file
 * @param file - The file to validate
 * @param maxSizeMB - Maximum file size in MB (default: 10MB)
 * @returns Error message if invalid, null if valid
 */
export const validateImageFile = (file: File, maxSizeMB: number = IMAGE_CONSTANTS.MAX_FILE_SIZE_MB): string | null => {
  // Validate file type
  if (!file.type.startsWith('image/')) {
    return 'Please upload an image file (JPG, PNG, etc.)';
  }

  // Validate file size
  if (file.size > maxSizeMB * 1024 * 1024) {
    return `Image file is too large. Maximum size is ${maxSizeMB}MB.`;
  }

  return null;
};

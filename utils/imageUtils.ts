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
  maxSizeKB: number = 500,
  maxDimension: number = 1920
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
        
        // Draw image with new dimensions
        ctx.drawImage(img, 0, 0, width, height);
        
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
              const quality = Math.max(0.1, 0.85 * (maxSizeKB / sizeKB));
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
          'image/jpeg',
          0.85 // Initial quality
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
export const validateImageFile = (file: File, maxSizeMB: number = 10): string | null => {
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

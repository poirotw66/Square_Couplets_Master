/**
 * Custom error class for application errors
 */
export class AppError extends Error {
  constructor(
    message: string,
    public code: string,
    public userMessage: string,
    public recoverable: boolean = false,
    public originalError?: any
  ) {
    super(message);
    this.name = 'AppError';
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

/**
 * Handle API errors and convert them to AppError
 */
export const handleApiError = (error: any, context?: string): AppError => {
  // Log error for debugging
  console.error(`API Error${context ? ` in ${context}` : ''}:`, error);

  // Handle 400 errors - Invalid Request
  if (error.status === 400 || error.message?.includes('400') || error.message?.includes('INVALID_ARGUMENT')) {
    if (error.message?.includes('image') || error.message?.includes('format') || error.message?.includes('mime')) {
      return new AppError(
        error.message || 'Invalid image format',
        'INVALID_IMAGE_FORMAT',
        '圖片格式不支援，請嘗試其他圖片（建議使用 JPG 或 PNG）',
        true,
        error
      );
    }
    return new AppError(
      error.message || 'Invalid request',
      'INVALID_REQUEST',
      '請求格式不正確，請檢查設置',
      true,
      error
    );
  }

  // Handle 403 errors - Permission Denied
  if (error.status === 403 || error.message?.includes('403') || error.message?.includes('Permission Denied')) {
    if (error.message?.includes('Paid API Key') || error.message?.includes('billing')) {
      return new AppError(
        error.message || 'Billing required',
        'BILLING_REQUIRED',
        '此功能需要付費 API Key，請在設置中切換到免費模型或啟用付費帳戶',
        true,
        error
      );
    }
    return new AppError(
      error.message || 'Permission denied',
      'PERMISSION_DENIED',
      'API Key 無效或沒有權限，請檢查設置',
      true,
      error
    );
  }

  // Handle 429 errors - Rate Limit
  if (error.status === 429 || error.message?.includes('429') || error.message?.includes('rate limit')) {
    return new AppError(
      error.message || 'Rate limit exceeded',
      'RATE_LIMIT',
      '請求過於頻繁，請稍後再試',
      true,
      error
    );
  }

  // Handle 500 errors - Server Error
  if (error.status === 500 || error.status === 503 || error.message?.includes('overloaded')) {
    return new AppError(
      error.message || 'Server error',
      'SERVER_ERROR',
      '服務器暫時無法處理請求，請稍後再試',
      true,
      error
    );
  }

  // Handle network errors
  if (error.message?.includes('network') || error.message?.includes('fetch')) {
    return new AppError(
      error.message || 'Network error',
      'NETWORK_ERROR',
      '網路連線錯誤，請檢查網路連線',
      true,
      error
    );
  }

  // Default error
  return new AppError(
    error.message || 'An unexpected error occurred',
    'UNKNOWN_ERROR',
    '發生未知錯誤，請稍後再試',
    false,
    error
  );
};

/**
 * Get user-friendly error message
 */
export const getUserFriendlyErrorMessage = (error: Error | AppError): string => {
  if (error instanceof AppError) {
    return error.userMessage;
  }
  return error.message || '發生未知錯誤';
};

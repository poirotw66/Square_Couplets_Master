/**
 * Retry a function with exponential backoff
 * @param fn - The function to retry
 * @param maxRetries - Maximum number of retries (default: 3)
 * @param initialDelay - Initial delay in milliseconds (default: 1000)
 * @returns Promise resolving to the function result
 */
export const retryWithBackoff = async <T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  initialDelay: number = 1000
): Promise<T> => {
  let lastError: Error | unknown;
  
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      
      // Don't retry on certain errors (4xx client errors except 429)
      if (error && typeof error === 'object' && 'status' in error) {
        const status = (error as { status?: number }).status;
        if (status && status >= 400 && status < 500 && status !== 429) {
          throw error;
        }
      }
      
      // If this is the last retry, throw the error
      if (i === maxRetries - 1) {
        throw error;
      }
      
      // Calculate delay with exponential backoff
      const delay = initialDelay * Math.pow(2, i);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  throw lastError || new Error('Max retries exceeded');
};

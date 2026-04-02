/**
 * Server-side error handling utilities
 */

export class APIError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public details?: string
  ) {
    super(message);
    this.name = 'APIError';
  }
}

export function handleAPIError(error: unknown) {
  const errorMessage = error instanceof Error ? error.message : String(error);
  const details = error instanceof Error ? error.stack : undefined;
  
  console.error('API Error:', {
    message: errorMessage,
    stack: details,
  });

  return {
    message: errorMessage,
    details: details,
  };
}

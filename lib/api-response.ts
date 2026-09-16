export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
  statusCode: number;
}

export function successResponse<T>(data: T, message = 'Success', statusCode = 200): ApiResponse<T> {
  return {
    success: true,
    message,
    data,
    statusCode,
  };
}

export function errorResponse(
  error: string,
  message = 'Error',
  statusCode = 500
): ApiResponse<null> {
  return {
    success: false,
    message,
    error,
    statusCode,
  };
}

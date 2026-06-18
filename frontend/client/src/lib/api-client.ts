import { apiConfig } from '@/constants/app';
import { ApiError, ApiSuccessResponse } from '@/lib/api-error';
import { getAccessToken, getRefreshToken, updateTokens } from '@/lib/auth-storage';

type RequestOptions = Omit<RequestInit, 'body'> & {
  body?: unknown;
  auth?: boolean;
};

async function parseResponse<T>(response: Response): Promise<T> {
  const data = await response.json();

  if (!response.ok) {
    const errorBody = data as { message?: string; errors?: unknown };
    throw new ApiError(
      errorBody.message ?? 'Request failed',
      response.status,
      errorBody.errors
    );
  }

  return data as T;
}

async function refreshAccessToken(): Promise<boolean> {
  const refreshToken = getRefreshToken();
  if (!refreshToken) return false;

  try {
    const response = await fetch(`${apiConfig.baseUrl}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
    });

    const result = await parseResponse<ApiSuccessResponse<{
      accessToken: string;
      refreshToken: string;
    }>>(response);

    updateTokens(result.data.accessToken, result.data.refreshToken);
    return true;
  } catch {
    return false;
  }
}

export async function apiClient<T>(
  path: string,
  options: RequestOptions = {}
): Promise<ApiSuccessResponse<T>> {
  const { body, auth = true, headers, ...rest } = options;

  const requestHeaders: HeadersInit = {
    'Content-Type': 'application/json',
    ...headers,
  };

  if (auth) {
    const token = getAccessToken();
    if (token) {
      (requestHeaders as Record<string, string>).Authorization = `Bearer ${token}`;
    }
  }

  const execute = () =>
    fetch(`${apiConfig.baseUrl}${path}`, {
      ...rest,
      headers: requestHeaders,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });

  let response = await execute();

  if (response.status === 401 && auth) {
    const refreshed = await refreshAccessToken();
    if (refreshed) {
      const token = getAccessToken();
      if (token) {
        (requestHeaders as Record<string, string>).Authorization = `Bearer ${token}`;
      }
      response = await execute();
    }
  }

  return parseResponse<ApiSuccessResponse<T>>(response);
}

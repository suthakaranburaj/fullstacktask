export const storageKeys = {
  accessToken: 'notenest_access_token',
  refreshToken: 'notenest_refresh_token',
  user: 'notenest_user',
  tourCompleted: 'notenest_tour_completed',
} as const;

export const apiConfig = {
  baseUrl: process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000/api/v1',
  googleClientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ?? '',
} as const;

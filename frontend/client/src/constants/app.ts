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

export const renderColdStartConfig = {
  noticeDelayMs: 10_000,
  message:
    'The server is hosted on Render and therefore has a cold-start downtime of up to 1 minute. Please wait until it is ready.',
} as const;

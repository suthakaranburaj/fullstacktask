export const routes = {
  home: '/',
  login: '/login',
  dashboard: '/dashboard',
  maintenance: '/maintenance',
  offline: '/offline',
  unauthorized: '/error/401',
  forbidden: '/error/403',
  serverError: '/error/500',
} as const;

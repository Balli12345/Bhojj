const API_BASE = (import.meta.env.VITE_BHOJJ_API_URL || 'https://bhojj-central-api.onrender.com/api').replace(/\/+$/, '');

let csrfToken: string | null = null;

export type ApiResult<T = any> = {
  success: boolean;
  message?: string;
  csrf?: string;
  user?: T;
  [key: string]: any;
};

async function request<T = any>(path: string, options: RequestInit = {}, retryCsrf = true): Promise<ApiResult<T>> {
  const method = (options.method || 'GET').toUpperCase();
  const headers = new Headers(options.headers || {});
  headers.set('Accept', 'application/json');
  if (method !== 'GET' && method !== 'HEAD') headers.set('Content-Type', 'application/json');
  if (csrfToken) headers.set('X-CSRF-Token', csrfToken);
  if (!headers.has('Idempotency-Key') && method !== 'GET' && method !== 'HEAD') headers.set('Idempotency-Key', crypto.randomUUID());

  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
    credentials: 'include',
    cache: 'no-store',
  });

  const text = await response.text();
  let data: ApiResult<T>;
  try { data = text ? JSON.parse(text) : { success: response.ok }; }
  catch { data = { success: false, message: `Invalid API response (${response.status})` }; }

  if (data.csrf) csrfToken = data.csrf;

  if (response.status === 419 && retryCsrf) {
    await ensureCsrf();
    return request<T>(path, options, false);
  }

  if (!response.ok || data.success === false) {
    throw new Error(data.message || `API request failed (${response.status})`);
  }
  return data;
}

export async function ensureCsrf() {
  const result = await request<{ token: string }>('/auth/csrf');
  if (result.csrf) csrfToken = result.csrf;
  return csrfToken;
}

export const bhojjApi = {
  getBootstrap: () => request('/bootstrap'),
  me: () => request('/auth/me'),
  login: async (identifier: string, role: string, password: string) => {
    await ensureCsrf();
    return request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ identifier, role, password }),
    });
  },
  register: async (payload: Record<string, any>) => {
    await ensureCsrf();
    return request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },
  logout: async () => {
    await ensureCsrf();
    return request('/auth/logout', { method: 'POST', body: '{}' });
  },
  createOrder: async (payload: Record<string, any>) => {
    await ensureCsrf();
    return request('/orders', { method: 'POST', body: JSON.stringify(payload) });
  },
  updateOrderStatus: async (orderId: string, status: string) => {
    await ensureCsrf();
    return request(`/orders/${encodeURIComponent(orderId)}`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  },
  autoAssignRider: async (orderId: string) => {
    await ensureCsrf();
    return request(`/orders/${encodeURIComponent(orderId)}/auto-assign`, { method: 'POST', body: '{}' });
  },
  assignRider: async (orderId: string, riderId: string) => {
    await ensureCsrf();
    return request(`/orders/${encodeURIComponent(orderId)}/assign`, { method: 'POST', body: JSON.stringify({ riderId }) });
  },
  acceptDelivery: async (orderId: string) => {
    await ensureCsrf();
    return request(`/orders/${encodeURIComponent(orderId)}/accept`, { method: 'POST', body: '{}' });
  },
  completeDelivery: async (orderId: string, otp: string) => {
    await ensureCsrf();
    return request(`/orders/${encodeURIComponent(orderId)}/otp`, { method: 'POST', body: JSON.stringify({ otp }) });
  },
  toggleRiderDuty: async (isOnline: boolean) => {
    await ensureCsrf();
    return request('/riders/duty', { method: 'POST', body: JSON.stringify({ isOnline }) });
  },
  updateRiderProfile: async (payload: Record<string, any>) => {
    await ensureCsrf();
    return request('/riders/me', { method: 'PATCH', body: JSON.stringify(payload) });
  },
  updateRiderLocation: async (location: { lat: number; lng: number; accuracy?: number }) => {
    await ensureCsrf();
    return request('/riders/location', { method: 'POST', body: JSON.stringify({ location }) });
  },
  sendRiderTelemetry: async (orderId: string, telemetry: Record<string, any>) => {
    await ensureCsrf();
    return request('/riders/telemetry', { method: 'POST', body: JSON.stringify({ orderId, ...telemetry }) });
  },
  createRestaurant: async (payload: Record<string, any>) => {
    await ensureCsrf();
    return request('/restaurants', { method: 'POST', body: JSON.stringify(payload) });
  },
  updateRestaurant: async (payload: Record<string, any>) => {
    await ensureCsrf();
    return request('/restaurants', { method: 'PATCH', body: JSON.stringify(payload) });
  },
  saveMenuItem: async (payload: Record<string, any>) => {
    await ensureCsrf();
    return request('/menu-items', { method: 'POST', body: JSON.stringify(payload) });
  },
  updateCms: async (payload: Record<string, any>) => {
    await ensureCsrf();
    return request('/cms', { method: 'PATCH', body: JSON.stringify(payload) });
  },
  adminUsers: async () => request('/admin/users'),
  adminUpdateUser: async (payload: Record<string, any>) => {
    await ensureCsrf();
    return request('/admin/users', { method: 'PATCH', body: JSON.stringify(payload) });
  },
  adminDeleteUser: async (userId: string) => {
    await ensureCsrf();
    return request(`/admin/users/${encodeURIComponent(userId)}`, { method: 'DELETE', body: '{}' });
  },
  adminVerifyRestaurant: async (restaurantId: string, isVerified: boolean) => {
    await ensureCsrf();
    return request('/restaurants', { method: 'PATCH', body: JSON.stringify({ id: restaurantId, is_verified: isVerified }) });
  },
  adminVerifyRider: async (riderId: string, isVerified: boolean) => {
    await ensureCsrf();
    return request('/riders', { method: 'PATCH', body: JSON.stringify({ id: riderId, is_verified: isVerified }) });
  },
  deleteMenuItem: async (itemId: string) => {
    await ensureCsrf();
    return request(`/menu-items?id=${encodeURIComponent(itemId)}`, { method: 'DELETE', body: '{}' });
  },
};


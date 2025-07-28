// src/lib/api.ts

export type ApiInterceptor = (url: string, options: RequestInit) => Promise<{ url: string; options: RequestInit }>;
export type ApiResponseInterceptor = (response: Response, data: any) => Promise<any>;

let requestInterceptors: ApiInterceptor[] = [];
let responseInterceptors: ApiResponseInterceptor[] = [];

export function addRequestInterceptor(interceptor: ApiInterceptor) {
  requestInterceptors.push(interceptor);
}
export function addResponseInterceptor(interceptor: ApiResponseInterceptor) {
  responseInterceptors.push(interceptor);
}

async function applyRequestInterceptors(url: string, options: RequestInit) {
  let result = { url, options };
  for (const interceptor of requestInterceptors) {
    result = await interceptor(result.url, result.options);
  }
  return result;
}

async function applyResponseInterceptors(response: Response, data: any) {
  let result = data;
  for (const interceptor of responseInterceptors) {
    result = await interceptor(response, result);
  }
  return result;
}

interface ApiFetchOptions extends RequestInit {
  useAuthToken?: boolean;
}

export async function apiFetch(url: string, options: ApiFetchOptions = {}, retryCount = 1): Promise<any> {
  let headers = {
    ...(options.headers || {}),
  };
  //  add token only in useAuthToken=true
  if (options.useAuthToken) {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (token) {
      headers = { ...headers, Authorization: `Bearer ${token}` };
    }
  }
  let finalOptions: RequestInit = { ...options, headers };
  // Interceptors before request
  const intercepted = await applyRequestInterceptors(url, finalOptions);
  url = intercepted.url;
  finalOptions = intercepted.options;
  let response: Response;
  let data: any;
  try {
    response = await fetch(url, finalOptions);
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      data = await response.text();
    }
    // Interceptors after response
    data = await applyResponseInterceptors(response, data);
    if (!response.ok) {
      throw new ApiError(data.message || 'API Error', response.status, data);
    }
    return data;
  } catch (error: any) {
    // Retry for network errors or 5xx
    if (retryCount > 0 && (error instanceof TypeError || (error.status && error.status >= 500))) {
      return apiFetch(url, options, retryCount - 1);
    }
    throw error;
  }
}

export class ApiError extends Error {
  status: number;
  data: any;
  constructor(message: string, status: number, data: any) {
    super(message);
    this.status = status;
    this.data = data;
  }
} 
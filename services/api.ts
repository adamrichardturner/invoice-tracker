import axios, { AxiosError, type InternalAxiosRequestConfig } from "axios";

interface APIErrorResponse {
  message: string;
}

const AUTH_PATH = "/auth/demo";
const retriedRequests = new WeakSet<InternalAxiosRequestConfig>();

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || undefined,
  withCredentials: true,
});

let refreshPromise: Promise<boolean> | null = null;

async function refreshSession(): Promise<boolean> {
  try {
    await api.post("/user/refresh");
    return true;
  } catch {
    return false;
  }
}

function redirectToAuth(): void {
  if (typeof window === "undefined") {
    return;
  }

  if (window.location.pathname.startsWith("/auth")) {
    return;
  }

  window.location.href = AUTH_PATH;
}

export const isAxiosError = (
  error: unknown,
): error is AxiosError<APIErrorResponse> => {
  return axios.isAxiosError(error);
};

api.interceptors.response.use(
  (response) => response,
  async (error: unknown) => {
    if (!isAxiosError(error)) {
      return Promise.reject(error);
    }

    const originalRequest = error.config;
    const status = error.response?.status;
    const requestUrl = originalRequest?.url ?? "";

    if (
      status !== 401 ||
      !originalRequest ||
      retriedRequests.has(originalRequest) ||
      requestUrl.includes("/user/refresh") ||
      requestUrl.includes("/user/demo-login")
    ) {
      return Promise.reject(error);
    }

    retriedRequests.add(originalRequest);

    if (!refreshPromise) {
      refreshPromise = refreshSession().finally(() => {
        refreshPromise = null;
      });
    }

    const refreshed = await refreshPromise;
    if (!refreshed) {
      redirectToAuth();
      return Promise.reject(error);
    }

    return api(originalRequest);
  },
);

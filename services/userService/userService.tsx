import axios, { AxiosError } from "axios";

// Define the expected error response structure
interface APIErrorResponse {
  message: string;
}

// Create the Axios instance
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || undefined,
  withCredentials: true,
});

// Axios request interceptor (if needed for additional configuration)
api.interceptors.request.use((config) => {
  return config;
});

// Helper to check if an error is an AxiosError
const isAxiosError = (
  error: unknown,
): error is AxiosError<APIErrorResponse> => {
  return (error as AxiosError).isAxiosError !== undefined;
};

// Login with demo credentials
export const loginWithDemo = async () => {
  try {
    await api.post("/user/demo-login");
    return { success: true };
  } catch (error: unknown) {
    if (isAxiosError(error) && error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error("Failed to login with demo account");
  }
};

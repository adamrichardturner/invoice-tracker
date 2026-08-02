import { api, isAxiosError } from "@/services/api";

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

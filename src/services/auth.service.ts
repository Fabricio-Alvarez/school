import { http } from "../api/http";
import type { AuthUser, LoginResponse } from "../types/auth";

export const authService = {
  async login(username: string, password: string) {
    const { data } = await http.post<LoginResponse>("/auth/login", { username, password });
    return data;
  },
  async me() {
    const { data } = await http.get<AuthUser>("/auth/me");
    return data;
  },
};

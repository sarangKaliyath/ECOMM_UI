import authAxios from "./axiosInstance";

export interface SignupResponse {
  id: number;
  name: string;
  email: string;
  roles: string[];
  state: string;
  createdAt: string;
  updatedAt: string;
}

export interface RefreshResponse {
  accessToken: string;
  expiresIn: number;
}

export const loginApi = (email: string, password: string): Promise<void> =>
  authAxios.post("/auth/login", { email, password }).then(() => undefined);

export const signupApi = (
  name: string,
  email: string,
  password: string,
): Promise<SignupResponse> =>
  authAxios
    .post<SignupResponse>("/auth/signup", { name, email, password })
    .then((r) => r.data);

export const refreshTokenApi = (): Promise<RefreshResponse> =>
  authAxios.post<RefreshResponse>("/auth/refresh").then((r) => r.data);

export const logoutApi = (): Promise<void> =>
  authAxios.post("/auth/logout").then(() => undefined);

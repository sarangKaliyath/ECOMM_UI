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

export const logoutAllApi = (): Promise<void> =>
  authAxios.post("/auth/logout-all").then(() => undefined);

export type VerificationType = "LOGIN" | "PASSWORD_RESET" | "EMAIL_VERIFICATION";

export const sendVerificationApi = (
  email: string,
  verificationType: VerificationType,
): Promise<void> =>
  authAxios
    .post("/verify/send", { email, verificationType })
    .then(() => undefined);

export interface ConfirmVerificationResponse {
  resetToken?: string;
}

export const confirmVerificationApi = (
  email: string,
  code: string,
  verificationType: VerificationType,
): Promise<ConfirmVerificationResponse> =>
  authAxios
    .post<ConfirmVerificationResponse>("/verify/confirm", {
      email,
      code,
      verificationType,
    })
    .then((r) => r.data ?? {});

export const resetPasswordApi = (
  resetToken: string,
  newPassword: string,
): Promise<void> =>
  authAxios
    .post("/auth/reset-password", { resetToken, newPassword })
    .then(() => undefined);

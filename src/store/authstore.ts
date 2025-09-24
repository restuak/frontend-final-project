"use client";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import axios, { AxiosError } from "axios";
import {
  ILoginParam,
  IRegisterParam,
  IJwtPayload,
} from "@/interface/auth.types";
import { BE_URL } from "@/configs/config";

interface AuthState {
  user: IJwtPayload | null;
  token: string | null;
  loading: boolean;
  error: string | null;


  signIn: (payload: ILoginParam) => Promise<void>;
  signUp: (payload: IRegisterParam) => Promise<void>; 
  verifyEmail: (token: string) => Promise<void>; 
  restoreSession: () => Promise<void>;
  signOut: () => void;
}

const setAxiosAuthHeader = (token?: string | null) => {
  if (token) {
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete axios.defaults.headers.common["Authorization"];
  }
};

const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      loading: false,
      error: null,

      // LOGIN (USER / TENANT)
      signIn: async ({ role, email, password }) => {
        set({ loading: true, error: null });
        try {
          const path =
            role === "TENANT" ? "api/auth/tenant-login" : "api/auth/user-login";

          const res = await axios.post(`${BE_URL}${path}`, { email, password });

          const data = res.data?.data || {};
          const token: string | undefined = data.token;
          const payload: IJwtPayload | undefined =
            data.userPayload || data.tenantPayload;

          if (!token || !payload) {
            throw new Error("Invalid login response");
          }

          set({ user: payload, token });
          setAxiosAuthHeader(token);
        } catch (err) {
          const error = err as AxiosError<any>;
          set({
            error:
              (error.response?.data as any)?.message ||
              error.message ||
              "Login gagal",
          });
          setAxiosAuthHeader(null);
          throw err;
        } finally {
          set({ loading: false });
        }
      },

      // REGISTER AWAL (kirim email verifikasi pendaftaran)
      signUp: async (payload) => {
        set({ loading: true, error: null });
        try {
          await axios.post(`${BE_URL}api/auth/register`, payload);
        } catch (err) {
          const error = err as AxiosError<any>;
          set({
            error:
              (error.response?.data as any)?.message ||
              error.message ||
              "Register gagal",
          });
          throw err;
        } finally {
          set({ loading: false });
        }
      },

      // VERIFIKASI EMAIL (resend/confirm alur user, di sini untuk CONFIRM)
      verifyEmail: async (verifyToken: string) => {
        set({ loading: true, error: null });
        try {
          const res = await axios.get(
            `${BE_URL}api/user/verify-email/confirm`,
            {
              params: { token: verifyToken },
            }
          );

          const token = get().token;
          if (token) {
            setAxiosAuthHeader(token);
            const me = await axios.get(`${BE_URL}api/user/profile`);
            set({ user: me.data?.data || null });
          }
        } catch (err) {
          const error = err as AxiosError<any>;
          set({
            error:
              (error.response?.data as any)?.message ||
              error.message ||
              "Verifikasi email gagal",
          });
          throw err;
        } finally {
          set({ loading: false });
        }
      },

      restoreSession: async () => {
        const token = get().token;
        if (!token) return;
        try {
          setAxiosAuthHeader(token);
          const res = await axios.get(`${BE_URL}api/user/profile`);
          set({ user: res.data?.data || null });
        } catch (err) {
          set({ user: null, token: null });
          setAxiosAuthHeader(null);
        }
      },

      // LOGOUT
      signOut: () => {
        set({ user: null, token: null, error: null });
        setAxiosAuthHeader(null);
      },
    }),
    {
      name: "tokenrestify",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        token: state.token,
      }),
      onRehydrateStorage: () => (state) => {
        const token = state?.token;
        setAxiosAuthHeader(token);
        state?.restoreSession?.();
      },
    }
  )
);

export default useAuthStore;

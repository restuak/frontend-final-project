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

/* ====================== State Shape ====================== */
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

/* ====================== Helper ====================== */
const setAxiosAuthHeader = (token?: string | null) => {
  if (token) {
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete axios.defaults.headers.common["Authorization"];
  }
};

/* ====================== Store ====================== */
const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      loading: false,
      error: null,

      /* ---------------- LOGIN ---------------- */
      signIn: async ({ role, email, password }) => {
        set({ loading: true, error: null });
        try {
          const path =
            role === "TENANT" ? "api/auth/tenant-login" : "api/auth/user-login";

          const res = await axios.post(`${BE_URL}${path}`, {
            email,
            password,
          });

          const { token, userPayload, tenantPayload } = res.data?.data || {};
          const payload: IJwtPayload | undefined = userPayload || tenantPayload;

          if (!token || !payload) {
            throw new Error("Invalid login response");
          }

          // ✅ Save to state (persist otomatis simpan ke localStorage)
          set({ user: payload, token });
          setAxiosAuthHeader(token);
        } catch (err) {
          const error = err as AxiosError<any>;
          set({
            error:
              error.response?.data?.message || error.message || "Login gagal",
          });
          setAxiosAuthHeader(null);
          throw err;
        } finally {
          set({ loading: false });
        }
      },

      /* ---------------- REGISTER ---------------- */
      signUp: async (payload) => {
        set({ loading: true, error: null });
        try {
          await axios.post(`${BE_URL}api/auth/register`, payload);
        } catch (err) {
          const error = err as AxiosError<any>;
          set({
            error:
              error.response?.data?.message ||
              error.message ||
              "Register gagal",
          });
          throw err;
        } finally {
          set({ loading: false });
        }
      },

      /* ---------------- VERIFY EMAIL ---------------- */
      verifyEmail: async (verifyToken: string) => {
        set({ loading: true, error: null });
        try {
          await axios.get(`${BE_URL}api/user/verify-email/confirm`, {
            params: { token: verifyToken },
          });

          // ✅ Refresh profile jika token sudah ada
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
              error.response?.data?.message ||
              error.message ||
              "Verifikasi email gagal",
          });
          throw err;
        } finally {
          set({ loading: false });
        }
      },

      /* ---------------- RESTORE SESSION ---------------- */
      restoreSession: async () => {
        const token = get().token;
        if (!token) return;
        try {
          setAxiosAuthHeader(token);
          const res = await axios.get(`${BE_URL}api/user/profile`);
          set({ user: res.data?.data || null });
        } catch (err) {
          // ❌ kalau gagal, hapus token & user
          set({ user: null, token: null });
          setAxiosAuthHeader(null);
        }
      },

      /* ---------------- SIGN OUT ---------------- */
      signOut: () => {
        set({ user: null, token: null, error: null });
        setAxiosAuthHeader(null);
        localStorage.removeItem("tokenrestify"); // 🔑 clear storage manual
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
    
      },
    }
  )
);

export default useAuthStore;

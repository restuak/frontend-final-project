"use client";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import axios, { AxiosError } from "axios";
import { ILoginParam, IRegisterParam, IJwtPayload } from "@/interface/auth.types";
import { BE_URL } from "@/configs/config";

interface AuthState {
  user: IJwtPayload | null;
  token: string | null;
  loading: boolean;
  error: string | null;

  signIn: (payload: ILoginParam) => Promise<void>;
  signUp: (payload: IRegisterParam) => Promise<void>;
  verifyEmail: (token: string) => Promise<void>;
  signOut: () => void;
}

const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      loading: false,
      error: null,

      // LOGIN
      signIn: async ({ role, email, password }) => {
        set({ loading: true, error: null });
        try {
          const res = await axios.post(`${BE_URL}/api/auth/login`, {
            role,
            email,
            password,
          });

          console.log("LOGIN RESPONSE:", res.data);

          set({
            user: res.data.data?.user || null,
            token: res.data.data?.token || null,
          });
        } catch (err) {
          const error = err as AxiosError<any>;
          console.error("LOGIN ERROR:", error.response?.data || error.message);
          set({
            error: error.response?.data?.message || "Login gagal",
          });
        } finally {
          set({ loading: false });
        }
      },

      // REGISTER
      signUp: async (payload) => {
        set({ loading: true, error: null });
        try {
          const res = await axios.post(`${BE_URL}/api/auth/register`, payload);
          console.log("REGISTER RESPONSE:", res.data);

          // Register tidak auto-login, hanya simpan info user sementara
          set({
            user: res.data.user || null,
          });
        } catch (err) {
          const error = err as AxiosError<any>;
          console.error(
            "REGISTER ERROR:",
            error.response?.data || error.message
          );
          set({
            error: error.response?.data?.message || "Register gagal",
          });
        } finally {
          set({ loading: false });
        }
      },

      // VERIFY EMAIL
      verifyEmail: async (verifyToken) => {
        set({ loading: true, error: null });
        try {
          const res = await axios.get(
            `${BE_URL}/api/auth/verify?token=${verifyToken}`
          );
          console.log("VERIFY RESPONSE:", res.data);

          set({
            user: res.data.user || null,
            token: res.data.token || null,
          });
        } catch (err) {
          const error = err as AxiosError<any>;
          console.error("VERIFY ERROR:", error.response?.data || error.message);
          set({
            error: error.response?.data?.message || "Verifikasi email gagal",
          });
        } finally {
          set({ loading: false });
        }
      },

      // LOGOUT
      signOut: () => {
        console.log("LOGOUT CALLED");
        set({ user: null, token: null });
      },
    }),
    {
      name: "tokenrestify",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        token: state.token,
      }),
    }
  )
);

export default useAuthStore;

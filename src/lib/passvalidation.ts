import { z } from "zod";

export const passwordSchema = z
  .object({
    password: z
      .string()
      .min(6, "Password minimal 6 karakter")
      .regex(/[a-z]/, "Harus ada huruf kecil")
      .regex(/[A-Z]/, "Harus ada huruf besar")
      .regex(/[0-9]/, "Harus ada angka"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Password dan konfirmasi tidak sama",
    path: ["confirmPassword"],
  });

export type PasswordInput = z.infer<typeof passwordSchema>;

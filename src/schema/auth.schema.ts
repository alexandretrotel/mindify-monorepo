import { z } from "zod";

export const loginFormSchema = z.object({
  email: z
    .string({
      invalid_type_error: "Adresse e-mail invalide"
    })
    .email(),
  password: z
    .string({
      invalid_type_error: "Mot de passe invalide"
    })
    .min(8, "Le mot de passe doit contenir au moins 8 caractères")
    .max(100, "Le mot de passe ne doit pas dépasser 100 caractères")
    .regex(/[a-z]/, "Le mot de passe doit contenir au moins une minuscule")
    .regex(/\d/, "Le mot de passe doit contenir au moins un chiffre")
});

export const signupFormSchema = z.object({
  email: z
    .string({
      invalid_type_error: "Adresse e-mail invalide"
    })
    .email(),
  password: z
    .string({
      invalid_type_error: "Mot de passe invalide"
    })
    .min(8, "Le mot de passe doit contenir au moins 8 caractères")
    .max(100, "Le mot de passe ne doit pas dépasser 100 caractères")
    .regex(/[a-z]/, "Le mot de passe doit contenir au moins une minuscule")
    .regex(/\d/, "Le mot de passe doit contenir au moins un chiffre"),
  firstName: z.string({
    invalid_type_error: "Prénom invalide"
  }),
  lastName: z.string({
    invalid_type_error: "Nom invalide"
  })
});

export const updatePasswordFormSchema = z
  .object({
    newPassword: z
      .string({
        invalid_type_error: "Mot de passe invalide"
      })
      .min(8, "Le mot de passe doit contenir au moins 8 caractères")
      .max(100, "Le mot de passe ne doit pas dépasser 100 caractères")
      .regex(/[a-z]/, "Le mot de passe doit contenir au moins une minuscule")
      .regex(/\d/, "Le mot de passe doit contenir au moins un chiffre"),
    confirmPassword: z.string({
      invalid_type_error: "Mot de passe invalide"
    })
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Les mots de passe ne correspondent pas",
    path: ["confirmPassword"]
  });

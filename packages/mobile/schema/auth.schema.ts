import { z } from "zod";

/**
 * Schema for validating the login form.
 *
 * @constant {ZodObject} loginFormSchema
 * @property {ZodString} email - The email address of the user.
 * @property {string} email.invalid_type_error - Error message when the email is not a string.
 * @property {ZodString} password - The password of the user.
 * @property {string} password.invalid_type_error - Error message when the password is not a string.
 * @property {number} password.min - Minimum length for the password.
 * @property {number} password.max - Maximum length for the password.
 * @property {RegExp} password.regex - Regular expression to ensure the password contains at least one lowercase letter and one digit.
 */
export const loginFormSchema = z.object({
  email: z
    .string({
      invalid_type_error: "Adresse e-mail invalide",
    })
    .email(),
  password: z
    .string({
      invalid_type_error: "Mot de passe invalide",
    })
    .min(8, "Le mot de passe doit contenir au moins 8 caractères")
    .max(100, "Le mot de passe ne doit pas dépasser 100 caractères")
    .regex(/[a-z]/, "Le mot de passe doit contenir au moins une minuscule")
    .regex(/\d/, "Le mot de passe doit contenir au moins un chiffre"),
});

/**
 * Schema for validating the signup form.
 *
 * @constant {ZodObject} signupFormSchema
 * @property {ZodString} email - The email address of the user.
 * @property {string} email.invalid_type_error - Error message when the email is not a string.
 * @property {ZodString} password - The password of the user.
 * @property {string} password.invalid_type_error - Error message when the password is not a string.
 * @property {number} password.min - Minimum length for the password.
 * @property {number} password.max - Maximum length for the password.
 * @property {RegExp} password.regex - Regular expression to ensure the password contains at least one lowercase letter and one digit.
 * @property {ZodString} firstName - The first name of the user.
 * @property {string} firstName.invalid_type_error - Error message when the first name is not a string.
 * @property {ZodString} lastName - The last name of the user.
 * @property {string} lastName.invalid_type_error - Error message when the last name is not a string.
 */
export const signupFormSchema = z.object({
  email: z
    .string({
      invalid_type_error: "Adresse e-mail invalide",
    })
    .email(),
  password: z
    .string({
      invalid_type_error: "Mot de passe invalide",
    })
    .min(8, "Le mot de passe doit contenir au moins 8 caractères")
    .max(100, "Le mot de passe ne doit pas dépasser 100 caractères")
    .regex(/[a-z]/, "Le mot de passe doit contenir au moins une minuscule")
    .regex(/\d/, "Le mot de passe doit contenir au moins un chiffre"),
  firstName: z.string({
    invalid_type_error: "Prénom invalide",
  }),
  lastName: z.string({
    invalid_type_error: "Nom invalide",
  }),
});

/**
 * Schema for validating the update password form.
 *
 * @constant {ZodObject} updatePasswordFormSchema
 * @property {ZodString} newPassword - The new password for the user.
 * @property {string} newPassword.invalid_type_error - Error message when the new password is not a string.
 * @property {number} newPassword.min - Minimum length for the new password.
 * @property {number} newPassword.max - Maximum length for the new password.
 * @property {RegExp} newPassword.regex - Regular expression to ensure the new password contains at least one lowercase letter and one digit.
 * @property {ZodString} confirmPassword - The confirmation of the new password.
 * @property {string} confirmPassword.invalid_type_error - Error message when the confirm password is not a string.
 */
export const updatePasswordFormSchema = z
  .object({
    newPassword: z
      .string({
        invalid_type_error: "Mot de passe invalide",
      })
      .min(8, "Le mot de passe doit contenir au moins 8 caractères")
      .max(100, "Le mot de passe ne doit pas dépasser 100 caractères")
      .regex(/[a-z]/, "Le mot de passe doit contenir au moins une minuscule")
      .regex(/\d/, "Le mot de passe doit contenir au moins un chiffre"),
    confirmPassword: z.string({
      invalid_type_error: "Mot de passe invalide",
    }),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Les mots de passe ne correspondent pas",
    path: ["confirmPassword"],
  });

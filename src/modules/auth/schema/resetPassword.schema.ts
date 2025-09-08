


import { z } from 'zod';

const resetPasswordSchema = z.object({
  password: z
    .string()
    .min(6, "A senha deve ter no mínimo 6 caracteres")
    .regex(/[A-Z]/, "A senha deve conter pelo menos 1 letra maiúscula")
    .regex(/[0-9]/, "A senha deve conter pelo menos 1 número"),
})

// Exportando o tipo inferido
export type resetPasswordSchemaFormData = z.infer<typeof resetPasswordSchema>;
export default resetPasswordSchema;

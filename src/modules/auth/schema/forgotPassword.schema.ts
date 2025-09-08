import { z } from 'zod';

const forgotPasswordSchema = z.object({
  email: z.string().min(3, "O email precisa ter pelo menos 3 caracteres").email('Formato email errado'),
})

// Exportando o tipo inferido
export type forgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;
export default forgotPasswordSchema;

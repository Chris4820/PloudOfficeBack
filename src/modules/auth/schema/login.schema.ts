

import { z } from 'zod';

// Schema para o login
export const loginSchema = z.object({
  email: z.string({ message: 'O email é obrigatório' }).email({ message: 'Email inválido' }),
  password: z.string({ message: 'A password é obrigatório' }).min(6, { message: 'A senha deve ter pelo menos 6 caracteres' }),
  remember: z.boolean(),
});
export type LoginSchemaProps = z.infer<typeof loginSchema>;
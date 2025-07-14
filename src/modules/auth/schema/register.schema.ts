



import { z } from 'zod';

// Schema para o login
export const registerSchema = z.object({
  name: z.string({message: 'O nome é obrigatório'}).min(3, "Nome precisa ter no minimo 3 caracters"),
  email: z.string({message: 'O email é obrigatório'}).email({ message: 'Email inválido' }),
  password: z.string({message: 'A password é obrigatório'}).min(6, { message: 'A senha deve ter pelo menos 6 caracteres' }),
});
export type RegisterSchemaProps = z.infer<typeof registerSchema>;

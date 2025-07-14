import { z } from 'zod';
import { shopScheduleSchema } from '../../../commons/schema/schedule.schema';

// Schema para criação de loja
export const CreateShopSchema = z.object({
  name: z
    .string({ message: 'O nome da loja é obrigatório.' })
    .min(3, 'O nome da loja deve ter pelo menos 3 caracteres.'),

  email: z
    .string({ message: 'O email é obrigatório.' })
    .email({ message: 'Informe um email válido.' }),

  storeType: z
    .string({ message: 'O tipo da loja é obrigatório.' }),

  subdomain: z
    .string({ message: 'O subdomínio é obrigatório.' })
    .min(3, 'O subdomínio deve ter pelo menos 3 caracteres.')
    .regex(/^[a-zA-Z0-9-_]+$/, 'O subdomínio pode conter apenas letras, números, hífens e underscores.'),

  phone: z
    .string({ message: 'O número de telefone é obrigatório.' }),

  address: z
    .string({ message: 'O endereço é obrigatório.' }),

  shopSchedule: shopScheduleSchema
});

export type CreateShopSchemaProps = z.infer<typeof CreateShopSchema>;

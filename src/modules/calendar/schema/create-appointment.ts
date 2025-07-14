
import { z } from 'zod';

// Definindo o esquema completo
export const createEventSchema = z.object({

  start: z.preprocess((val) => {
    if (typeof val === 'string' || val instanceof Date) {
      return new Date(val);
    }
    return val;
  }, z.date()),
  duration: z.number(), //Em minutos

  serviceId: z.number(),
  collabId: z.number(),

  Client: z.object({
    name: z.string(),
    email: z.string().email(),
    phone: z.string().optional(),
    notes: z.string().optional(),
  })

});

// Exportando o tipo inferido
export type CreateEventFormData = z.infer<typeof createEventSchema>;
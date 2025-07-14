import { z } from "zod";

// Main product schema
export const CreateServiceSchema = z.object({
  name: z.string().min(3, "Mínimo de 3 caracteres").max(100, "Máximo de 100 caracteres"),
  description: z.string().optional().nullable(),
  color: z.string(),
  hasChangeImage: z.boolean(),
  image: z.object({
    type: z.string().optional(),
    size: z.number().optional(),
  }).optional(),
  isActive: z.boolean(),
  price: z.number({ message: 'O preço é obrigatório' }).min(1, "O preço é obrigatório"),
  notes: z.string().optional(),
  duration: z.number({ message: 'A duração é obrigatória' }),
});

// Export the inferred type
export type CreateServiceFormData = z.infer<typeof CreateServiceSchema>;
import { z } from "zod";





// Main product schema
export const EditServiceSchema = z.object({
  name: z.string().min(3, "Mínimo de 3 caracteres").max(100, "Máximo de 100 caracteres"),
  description: z.string().optional(),
  color: z.string(),
  hasChangeImage: z.boolean().default(false),
  image: z.object({
    type: z.string().optional(),
    size: z.number().optional(),
  }).optional(),
  isActive: z.boolean().default(true),
});

// Export the inferred type
export type EditServiceFormData = z.infer<typeof EditServiceSchema>;

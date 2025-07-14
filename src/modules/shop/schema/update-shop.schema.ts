import { z } from "zod";



// Main product schema
export const UpdateSettingsSchema = z.object({
  name: z.string().min(3, "Mínimo de 3 caracteres").max(100, "Máximo de 100 caracteres"),
  description: z.string().optional().nullable(),
  address: z.string().optional().nullable(),
  instagramCompany: z.string().optional().nullable(),
  facebookCompany: z.string().optional().nullable(),
  emailSupport: z.string().email().optional().nullable(),
  isMaintenance: z.boolean(),
});

// Export the inferred type
export type UpdateSettingsFormData = z.infer<typeof UpdateSettingsSchema>;
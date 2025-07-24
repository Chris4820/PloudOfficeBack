import { z } from "zod";

// Main product schema
export const UpdateDesignSchema = z.object({
  primaryColor: z.string(),
  secondaryColor: z.string(),
  hasChangeLogoImage: z.boolean(),
  imageLogo: z.object({
    type: z.string().optional(),
    size: z.number().optional(),
  }).optional(),
  hasChangeBackgroundImage: z.boolean(),
  imageBackground: z.object({
    type: z.string().optional(),
    size: z.number().optional(),
  }).optional(),
});

// Export the inferred type
export type UpdateDesignFormData = z.infer<typeof UpdateDesignSchema>;
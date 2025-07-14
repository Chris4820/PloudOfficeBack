import { z } from "zod";

// Schema para validação no backend (preço como number)
export const EditServiceCollaboratorSchema = z.object({
  price: z.number()
    .positive("Preço deve ser maior que 0")
    .max(999999, "Preço máximo excedido"),
  collabId: z.number().int().positive("ID do colaborador inválido"),
  duration: z.number().int().min(5, "Duração mínima é 5 minutos").max(480, "Duração máxima é 8 horas"),
  notes: z.string().optional().nullable(),
  isActive: z.boolean()
});

// Export the inferred type
export type EditServiceCollabFormData = z.infer<typeof EditServiceCollaboratorSchema>;
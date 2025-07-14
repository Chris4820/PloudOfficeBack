import { z } from "zod";

export const shopScheduleSchema =
  z.array(
    z.object({
      dayOfWeek: z.enum(['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY']),
      isActive: z.boolean(),
      startTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Formato de hora inválido (HH:MM)").optional().nullable(),
      endTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Formato de hora inválido (HH:MM)").optional().nullable(),
      breakStart: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Formato de hora inválido (HH:MM)").optional().nullable(),
      breakEnd: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Formato de hora inválido (HH:MM)").optional().nullable(),
    }).refine((data) => {
      if (data.isActive) {
        return data.startTime && data.endTime; // Ambos são obrigatórios se ativo
      }
      return true; // Se não ativo, não exige horários
    })
  )

export type shopScheduleFormData = z.infer<typeof shopScheduleSchema>;
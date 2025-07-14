import { z } from "zod";



export const UpdatePositionAppointmentSchema = z.object({
  start: z.preprocess((val) => new Date(val as string), z.date({ message: 'Data inválida' })),
  end: z.preprocess((val) => new Date(val as string), z.date({ message: 'Data inválida' })),
  notificationClient: z.boolean(),
});

export type UpdatePositionAppointmentSchemaProps = z.infer<typeof UpdatePositionAppointmentSchema>;